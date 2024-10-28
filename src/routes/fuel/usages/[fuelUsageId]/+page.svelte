<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import flatpickr from 'flatpickr';

	interface Props {
		data: PageData;
	}

	let { data = $bindable() }: Props = $props();

	const fuelUsage = data.getFuelUsageByIdResponse;
	const defaultFuelPrice = Number(fuelUsage.fuelPrice);
	const defaultKmBeforeUse = fuelUsage.kilometerBeforeUse;
	const defaultKmAfterUse = fuelUsage.kilometerAfterUse;
	const defaultTotal = defaultFuelPrice * (defaultKmBeforeUse - defaultKmAfterUse);
	let defaultFuelUserIds: number[] = [];
	let defaultPaidUsers: number[] = [];
	for (const fuelUser of fuelUsage.fuelUsers) {
		defaultFuelUserIds.push(fuelUser.userId);
		if (fuelUser.isPaid) {
			defaultPaidUsers.push(fuelUser.userId);
		}
	}

	let fuelPriceDisplay = $state(defaultFuelPrice.toFixed(2));
	let kilometerBeforeUse = $state(defaultKmBeforeUse);
	let kilometerAfterUse = $state(defaultKmAfterUse);
	let description = $state(fuelUsage.description);
	let total = $derived((defaultFuelPrice * (kilometerBeforeUse - kilometerAfterUse)).toFixed(2));

	let fuelUserIds = $state<number[]>(defaultFuelUserIds);
	let paidUsers = $state<number[]>(defaultPaidUsers);

	let payEach = $derived.by(() => {
		if (fuelUserIds.length > 0) {
			return (Number(total) / fuelUserIds.length).toFixed(2);
		}
		return total;
	});

	let defaultFuelUseTime = new Date(fuelUsage.fuelUseTime);
	let year = defaultFuelUseTime.getFullYear();
	let month = ('0' + (defaultFuelUseTime.getMonth() + 1)).slice(-2);
	let date = ('0' + defaultFuelUseTime.getDate()).slice(-2);
	let hour = ('0' + defaultFuelUseTime.getHours()).slice(-2);
	let minute = ('0' + defaultFuelUseTime.getMinutes()).slice(-2);
	let second = ('0' + defaultFuelUseTime.getSeconds()).slice(-2);

	let fuelUseTime = $state(`${year}-${month}-${date}T${hour}:${minute}:${second}+07:00`);
	let fuelUseTimeInputElement = $state<HTMLElement>();

	onMount(() => {
		if (fuelUseTimeInputElement) {
			flatpickr(fuelUseTimeInputElement, {
				disableMobile: true,
				allowInput: true,
				clickOpens: true,
				enableTime: true,
				dateFormat: 'Y-m-dTH:i:S+07:00',
				altInput: true,
				altFormat: 'j F Y h:i:S K',
				enableSeconds: true,
				defaultDate: defaultFuelUseTime,
				onValueUpdate: (selectedDates, dateStr, instance) => {
					fuelUseTime = dateStr;
				}
			});
		}
	});
</script>

<section class="bg-white dark:bg-gray-900">
	<div class="py-2 px-4 mx-auto max-w-2xl lg:py-16">
		<form method="POST">
			<h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">
				แก้ไขการใช้รถ
			</h2>
			<div class="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
				<div>
					<label
						for="fuelUseTime"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วันที่</label
					>
					<input
						name="fuelUseTime"
						id="fuelUseTime"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						bind:this={fuelUseTimeInputElement}
						bind:value={fuelUseTime}
						required
					/>
				</div>
				<div>
					<label
						for="fuelPrice"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ราคาน้ำมัน</label
					>
					<input
						type="number"
						name="fuelPrice"
						id="fuelPrice"
						bind:value={fuelPriceDisplay}
						class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						readonly
						required
					/>
				</div>
				<div>
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="fuelUserIds">คนนั่ง</label
					>
					<div class="flex items-center space-x-4">
						{#each data.allUsers as user}
							<div class="flex items-center">
								<input
									id="inline-checkbox"
									type="checkbox"
									name="fuelUserId"
									value={user.id}
									bind:group={fuelUserIds}
									class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
								<label
									for="inline-checkbox"
									class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
									>{user.nickname}</label
								>
							</div>
						{/each}
					</div>
				</div>
				{#if fuelUserIds.length > 0}
					<div>
						<label
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							for="paidFuelUserIds">สถานะการจ่ายเงิน</label
						>
						<div class="flex items-center space-x-4">
							{#each fuelUserIds as fuelUserId}
								<div class="flex items-center">
									<input
										id="inline-checkbox"
										type="checkbox"
										name="paidFuelUserId"
										value={fuelUserId}
										bind:group={paidUsers}
										class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									/>
									<label
										for="inline-checkbox"
										class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>{data.userIdToNickname.get(fuelUserId)}</label
									>
								</div>
							{/each}
						</div>
					</div>
				{/if}
				<div>
					<label
						for="description"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายละเอียด</label
					>
					<textarea
						id="description"
						name="description"
						rows="1"
						class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						bind:value={description}
					></textarea>
				</div>
				<div>
					<label
						for="kilometerBeforeUse"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>น้ำมันเริ่มต้น (กม.)</label
					>
					<input
						type="number"
						name="kilometerBeforeUse"
						id="kilometerBeforeUse"
						bind:value={kilometerBeforeUse}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label
						for="kilometerAfterUse"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>น้ำมันสิ้นสุด (กม.)</label
					>
					<input
						type="number"
						name="kilometerAfterUse"
						id="kilometerAfterUse"
						bind:value={kilometerAfterUse}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label for="total" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>เป็นเงิน (บาท)</label
					>
					<input
						type="number"
						name="total"
						id="total"
						value={total}
						disabled
						class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label for="payEach" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>เป็นเงินคนละ (บาท)</label
					>
					<input
						type="number"
						name="payEach"
						id="payEach"
						value={payEach}
						disabled
						class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<input
					type="number"
					name="currentCarId"
					id="currentCarId"
					bind:value={data.currentCarId}
					class="hidden"
				/>
				<input
					type="number"
					name="currentUserId"
					id="currentUserId"
					bind:value={data.currentUserId}
					class="hidden"
				/>
				<input
					type="number"
					name="fuelUsageId"
					id="fuelUsageId"
					bind:value={data.fuelUsageId}
					class="hidden"
				/>
			</div>
			<div class="flex justify-between space-x-4">
				<button
					type="submit"
					formaction="?/deleteFuelUsage"
					class="inline-flex items-center px-5 py-2.5 text-md font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
				>
					ลบ
				</button>
				<button
					type="submit"
					formaction="?/updateFuelUsage"
					class="inline-flex items-center px-5 py-2.5 text-md font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
				>
					ยืนยัน
				</button>
			</div>
		</form>
	</div>
</section>
