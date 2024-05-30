<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let fuelPrice = Number(data.latestFuelPrice);
	let fuelPriceDisplay: string = fuelPrice.toFixed(2);
	let kilometerBeforeUse = data.latestKilometerAfterUse;
	let kilometerAfterUse = 0;
	let description = '';
	$: total = fuelPrice * (kilometerBeforeUse - kilometerAfterUse)
    $: totalString = total.toFixed(2)
    let fuelUserIds: number[] = [data.currentUserId]
    let paidUsers: number[] = []
    $: payEach = total;
    $: {
        if (fuelUserIds.length > 0) {
            payEach = total / fuelUserIds.length
        }
    }
    $: payEachDisplay = payEach.toFixed(2)

	let now = new Date();
	let year = now.getFullYear();
	let month = ('0' + (now.getMonth() + 1)).slice(-2);
	let date = ('0' + now.getDate()).slice(-2);
	let hour = ('0' + now.getHours()).slice(-2);
	let minute = ('0' + now.getMinutes()).slice(-2);
	let second = ('0' + now.getSeconds()).slice(-2);
	let nowBind = `${year}-${month}-${date}T${hour}:${minute}:${second}`;

    let userIdToNickname = new Map<number, string>()
    for (const user of data.allUsers) {
        userIdToNickname.set(user.id, user.nickname)
    }

    function getNicknameByUserId(userId:number) :string {
        let userNickname = userIdToNickname.get(userId)
        if (userNickname) {
            return userNickname
        }
        return ""
    }

    $: disableButton = fuelUserIds.length == 0 
</script>

<section class="bg-white dark:bg-gray-900">
    <div class="py-2 px-4 mx-auto max-w-2xl lg:py-16">
        <form method="POST">
            <h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">เพิ่มการใช้รถ</h2>
            <div class="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                    <label for="fuelUseTime" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วันที่</label>
                    <input type="datetime-local" step="1" name="fuelUseTime" id="fuelUseTime" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" bind:value={nowBind} required>
                </div>
                <div>
                    <label for="fuelPrice" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ราคาน้ำมัน</label>
                    <input type="number" name="fuelPrice" id="fuelPrice" bind:value={fuelPriceDisplay} class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" readonly required>
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="fuelUserIds">
                        คนนั่ง 
                        {#if fuelUserIds.length == 0 }
                            <span class="text-red-500">* กรุณาเลือกอย่างน้อย 1 คน</span>
                        {/if}
                    </label>
                    <div class="flex items-center space-x-4">
                        {#each data.allUsers as user}
                            <div class="flex items-center">
                                <input id="inline-checkbox" type="checkbox" name="fuelUserId" value={user.id} bind:group={fuelUserIds} class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="inline-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{user.nickname}</label>
                            </div>
                        {/each}
                    </div>
                </div>
                {#if fuelUserIds.length > 0}
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="paidFuelUserIds">สถานะการจ่ายเงิน</label>
                        <div class="flex items-center space-x-4">
                            {#each fuelUserIds as fuelUserId}
                                <div class="flex items-center">
                                    <input id="inline-checkbox" type="checkbox" name="paidFuelUserId" value={fuelUserId} bind:group={paidUsers} class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                    <label for="inline-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{getNicknameByUserId(fuelUserId)}</label>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
                <div>
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายละเอียด</label>
                    <textarea id="description" name="description" rows="1" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={description}></textarea>
                </div>
                <div>
                    <label for="kilometerBeforeUse" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">น้ำมันเริ่มต้น (กม.)</label>
                    <input type="number" name="kilometerBeforeUse" id="kilometerBeforeUse" bind:value={kilometerBeforeUse} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div>
                    <label for="kilometerAfterUse" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">น้ำมันสิ้นสุด (กม.)</label>
                    <input type="number" name="kilometerAfterUse" id="kilometerAfterUse" bind:value={kilometerAfterUse} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div>
                    <label for="total" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เป็นเงิน (บาท)</label>
                    <input type="number" name="total" id="total" bind:value={totalString} disabled class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div>
                    <label for="payEach" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เป็นเงินคนละ (บาท)</label>
                    <input type="number" name="payEach" id="payEach" bind:value={payEachDisplay} disabled class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <input type="number" name="currentCarId" id="currentCarId" bind:value={data.currentCarId} class="hidden">
                <input type="number" name="currentUserId" id="currentUserId" bind:value={data.currentUserId} class="hidden">
            </div>
           {#if disableButton }
                <button type="submit" disabled class="inline-flex items-center px-5 py-2.5 text-md font-medium text-center text-white bg-primary-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-600 hover:bg-primary-500 cursor-not-allowed">
                    เพิ่มการใช้รถ
                </button>
            {:else}
                <button type="submit" formaction="?/createFuelUsage" class="inline-flex items-center px-5 py-2.5 text-md font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    เพิ่มการใช้รถ
                </button>
           {/if}
        </form>
    </div>
</section>
