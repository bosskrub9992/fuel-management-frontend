<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import ToastFailed from '$lib/components/toastFailed.svelte';
	import ToastSucceeded from '$lib/components/toastSucceeded.svelte';
	import type {
		getUserUnpaidCarActivityResponse,
		patchUserUnpaidCarActivityRequest
	} from '$lib/api/users';
	import { getUserUnpaidCarActivity, patchUserUnpaidCarActivity } from '$lib/api/users';
	import { PUBLIC_BANK_ACCOUNT_NO, PUBLIC_BANK } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;

	let selectedFuelUsageUserIds: number[] = [];
	let selectedFuelUsageTotalMoney = 0;
	let allFuelUsageUserIds: number[] = [];
	let totalMoneyIfSelectedAllFuelUsage = 0;
	$: allSelectedFuelUsage = selectedFuelUsageUserIds.length == allFuelUsageUserIds.length;

	let selectedFuelRefillIds: number[] = [];
	let selectedFuelRefillTotalMoney = 0;
	let allFuelRefillIds: number[] = [];
	let totalMoneyIfSelectedAllFuelRefill = 0;
	$: allSelectedFuelRefill = selectedFuelRefillIds.length == allFuelRefillIds.length;

	let isPaying = false;
	$: totalMoney = selectedFuelUsageTotalMoney - selectedFuelRefillTotalMoney;

	let userUnpaidCarActivity: getUserUnpaidCarActivityResponse;
	let isLoading = true;
	let errorOccurred: unknown;

	onMount(async () => {
		const { initFlowbite } = await import('flowbite');
		initFlowbite();

		let [err, getUserUnpaidCarActivityResult] = await getUserUnpaidCarActivity(
			data.currentUserId,
			data.currentCarId
		);
		if (err || getUserUnpaidCarActivityResult == undefined) {
			errorOccurred = err;
		}
		if (getUserUnpaidCarActivityResult) {
			userUnpaidCarActivity = getUserUnpaidCarActivityResult.userUnpaidCarActivity;

			selectedFuelUsageUserIds = getUserUnpaidCarActivityResult.selectedUnpaidFuelUsageUserIds;
			allFuelUsageUserIds = getUserUnpaidCarActivityResult.selectedUnpaidFuelUsageUserIds;
			selectedFuelUsageTotalMoney =
				getUserUnpaidCarActivityResult.totalMoneySelectedUnpaidFuelUsage;
			totalMoneyIfSelectedAllFuelUsage =
				getUserUnpaidCarActivityResult.totalMoneySelectedUnpaidFuelUsage;

			selectedFuelRefillIds = getUserUnpaidCarActivityResult.selectedUnpaidFuelRefillIds;
			allFuelRefillIds = getUserUnpaidCarActivityResult.selectedUnpaidFuelRefillIds;
			selectedFuelRefillTotalMoney =
				getUserUnpaidCarActivityResult.totalMoneySelectedUnpaidFuelRefill;
			totalMoneyIfSelectedAllFuelRefill =
				getUserUnpaidCarActivityResult.totalMoneySelectedUnpaidFuelRefill;
		}

		isLoading = false;
	});

	function toggleAllFuelUsage() {
		if (allSelectedFuelUsage) {
			selectedFuelUsageUserIds = [];
			selectedFuelUsageTotalMoney = 0;
		} else {
			selectedFuelUsageUserIds = [...allFuelUsageUserIds];
			selectedFuelUsageTotalMoney = totalMoneyIfSelectedAllFuelUsage;
		}
	}

	function toggleAllFuelRefill() {
		if (allSelectedFuelRefill) {
			selectedFuelRefillIds = [];
			selectedFuelRefillTotalMoney = 0;
		} else {
			selectedFuelRefillIds = [...allFuelRefillIds];
			selectedFuelRefillTotalMoney = totalMoneyIfSelectedAllFuelRefill;
		}
	}

	function calculateFuelUsageTotalPayEach(e: Event, payEach: number) {
		let fuelUsage = e.target as HTMLInputElement;
		if (fuelUsage.checked) {
			selectedFuelUsageTotalMoney += payEach;
		} else {
			selectedFuelUsageTotalMoney -= payEach;
		}
	}

	function calculateFuelRefillTotalMoney(e: Event, amount: number) {
		let fuelRefill = e.target as HTMLInputElement;
		if (fuelRefill.checked) {
			selectedFuelRefillTotalMoney += amount;
		} else {
			selectedFuelRefillTotalMoney -= amount;
		}
	}

	async function pay() {
		isPaying = true;

		let req: patchUserUnpaidCarActivityRequest = {
			fuelUsageUserIds: selectedFuelUsageUserIds,
			fuelRefillIds: selectedFuelRefillIds
		};

		let err = await patchUserUnpaidCarActivity(data.currentUserId, data.currentCarId, req);
		if (err) {
			console.log('patchUserUnpaidCarActivity error: ', err);
			displayToast('paymentFailed');
			isPaying = false;
			return;
		}

		reloadPage('paymentSucceeded');
	}

	$: showToast = $page.url.searchParams.get('showToast');

	function displayToast(showToast: string) {
		const url = $page.url.searchParams;
		url.set('showToast', showToast);
		goto(`?${url}`);
	}

	function reloadPage(showToast: string) {
		$page.url.searchParams.set('showToast', showToast);
		const thisPage = $page.url.toString();
		goto('/').then(() => goto(thisPage));
	}
</script>

<!-- toast notification -->
{#if showToast != null && showToast == 'paymentSucceeded'}
	<ToastSucceeded toastMessage="จ่ายเงิน สำเร็จ" />
{:else if showToast != null && showToast == 'paymentFailed'}
	<ToastFailed toastMessage="จ่ายเงิน ไม่สำเร็จ" />
{/if}

<!-- content -->
{#if isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<Spinner />
	</div>
{:else if userUnpaidCarActivity.fuelUsages.length == 0 && userUnpaidCarActivity.fuelRefills.length == 0}
	<div class="flex justify-center items-center h-screen">
		<div class="flex flex-col items-center justify-center">
			<p class="text-lg">คุณไม่มีรายการค้างจ่ายแล้ว</p>
			<p class="text-lg">🎉🎉🎉</p>
		</div>
	</div>
{:else if userUnpaidCarActivity.fuelUsages.length > 0 || userUnpaidCarActivity.fuelRefills.length > 0}
	<h2
		class="pl-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white"
	>
		รายการรอคุณจ่าย
	</h2>

	<section class="bg-gray-50 dark:bg-gray-900 p-2 antialiased">
		<div class="mx-auto max-w-screen-xl px-0 lg:px-12">
			<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
				<div class="text-sm flex flex-row px-3 py-3">
					<div>
						<p>รถยนต์</p>
						<p class="pt-2">บัญชีธนาคาร</p>
					</div>
					<div class="pl-7">
						<p class="font-bold">{data.currentCar?.name}</p>
						<div class="inline-flex">
							<p class="font-bold pt-2">{PUBLIC_BANK}</p>
							<p class="font-bold pt-2 pl-2">{PUBLIC_BANK_ACCOUNT_NO}</p>
						</div>
					</div>
				</div>

				<!-- accordion fuel usage -->
				<div class="container mx-auto bg-white p-2">
					<details
						class="flex items-center w-full py-5 px-2 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 [&_svg]:open:-rotate-180"
					>
						<summary class="list-none">
							<div
								class="flex cursor-pointer list-none items-center gap-4 justify-between text-black"
							>
								<div class="flex justify-between pl-2">
									<svg
										class="inline rotate-0 transform text-blue-700 transition-all duration-300"
										fill="none"
										height="20"
										width="20"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										viewBox="0 0 24 24"
									>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
									<strong class="pl-3">ใช้น้ำมัน</strong>
								</div>
								<strong class="pr-4">฿{selectedFuelUsageTotalMoney}</strong>
							</div>
						</summary>

						<!-- table fuel usage -->
						<div class="overflow-x-auto pt-3">
							<table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
								<thead
									class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
								>
									<tr>
										<th scope="col" class="p-4">
											<div class="flex items-center">
												<input
													id="checkbox-all-search"
													type="checkbox"
													on:click={() => {
														toggleAllFuelUsage();
													}}
													checked={allSelectedFuelUsage}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label for="checkbox-all-search" class="sr-only">checkbox</label>
											</div>
										</th>
										<th scope="col" class="px-2 py-3">วันที่</th>
										<th scope="col" class="px-2 py-3">คนนั่ง</th>
										<th scope="col" class="px-2 py-3">รายละเอียด</th>
										<th scope="col" class="px-2 py-3">จ่ายคนละ</th>
									</tr>
								</thead>
								<tbody>
									{#each userUnpaidCarActivity.fuelUsages as fuelUsage}
										<tr class="border-b dark:border-gray-700">
											<td class="w-4 p-4">
												<div class="flex items-center">
													<input
														id="checkbox-fuel-usage-{fuelUsage.fuelUsageUserId}"
														type="checkbox"
														value={fuelUsage.fuelUsageUserId}
														bind:group={selectedFuelUsageUserIds}
														on:change={(e) => {
															calculateFuelUsageTotalPayEach(e, parseFloat(fuelUsage.payEach));
														}}
														class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														for="checkbox-fuel-usage-{fuelUsage.fuelUsageUserId}"
														class="sr-only">checkbox</label
													>
												</div>
											</td>
											<td
												id="td-fuel-usage-{fuelUsage.fuelUsageUserId}-FuelUsetime"
												class="px-2 py-3"
											>
												{fuelUsage.fuelUseTime}</td
											>
											<td
												id="td-fuel-usage-{fuelUsage.fuelUsageUserId}-FuelUsers"
												class="px-2 py-3 align-middle">{fuelUsage.fuelUsers}</td
											>
											<td
												id="td-fuel-usage-{fuelUsage.fuelUsageUserId}-Description"
												class="px-2 py-3">{fuelUsage.description}</td
											>
											<td id="td-fuel-usage-{fuelUsage.fuelUsageUserId}-PayEach" class="px-2 py-3"
												>{'฿' + fuelUsage.payEach}</td
											>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</details>

					<!-- accordion fuel refill -->
					<details
						class=" flex items-center w-full py-5 px-2 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-b-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 [&_svg]:open:-rotate-180"
					>
						<summary class="list-none">
							<div
								class="flex cursor-pointer list-none items-center gap-4 justify-between text-black"
							>
								<div class="flex justify-between pl-2">
									<svg
										class="inline rotate-0 transform text-blue-700 transition-all duration-300"
										fill="none"
										height="20"
										width="20"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										viewBox="0 0 24 24"
									>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
									<strong class="pl-3">เติมน้ำมัน</strong>
								</div>
								<strong class="pr-4">฿{selectedFuelRefillTotalMoney}</strong>
							</div>
						</summary>

						<!-- table fuel refill -->
						<div class="overflow-x-auto pt-3">
							<table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
								<thead
									class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
								>
									<tr>
										<th scope="col" class="p-4">
											<div class="flex items-center">
												<input
													id="checkbox-all-fuel-refill"
													type="checkbox"
													on:click={() => {
														toggleAllFuelRefill();
													}}
													checked={allSelectedFuelRefill}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label for="checkbox-all-fuel-refill" class="sr-only">checkbox</label>
											</div>
										</th>
										<th scope="col" class="px-2 py-3">วันที่</th>
										<th scope="col" class="px-2 py-3">สถานะการจ่ายจากกองกลาง</th>
										<th scope="col" class="px-2 py-3">เป็นเงิน</th>
									</tr>
								</thead>
								<tbody>
									{#each userUnpaidCarActivity.fuelRefills as fuelRefill}
										<tr class="border-b dark:border-gray-700">
											<td class="w-4 p-4">
												<div class="flex items-center">
													<input
														id="checkbox-fuel-refill-id-{fuelRefill.fuelRefillId}"
														type="checkbox"
														value={fuelRefill.fuelRefillId}
														bind:group={selectedFuelRefillIds}
														on:change={(e) => {
															calculateFuelRefillTotalMoney(e, parseFloat(fuelRefill.totalMoney));
														}}
														class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														for="checkbox-fuel-refill-id-{fuelRefill.fuelRefillId}"
														class="sr-only">checkbox</label
													>
												</div>
											</td>
											<td
												id="td-fuel-refill-{fuelRefill.fuelRefillId}-RefillTime"
												class="px-2 py-3"
											>
												{fuelRefill.refillTime}</td
											>
											<td
												id="td-fuel-refill-{fuelRefill.fuelRefillId}-Ispaid"
												class="px-2 py-3 align-middle">{fuelRefill.isPaid}</td
											>
											<td id="td-fuel-refill-{fuelRefill.fuelRefillId}-TotalMoney" class="px-2 py-3"
												>{'฿' + fuelRefill.totalMoney}</td
											>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</details>

					<!-- summary and pay -->
					<div class="flex flex-row justify-between px-5 pt-5 text-md">
						<p>รวมทั้งหมด</p>
						<p class="font-bold">฿{totalMoney}</p>
					</div>
					<div
						class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
					>
						<div
							class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
						>
							{#if !isPaying}
								{#if totalMoney == 0}
									<button
										class="flex items-center justify-center text-white bg-primary-500 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-400 cursor-not-allowed"
										disabled
									>
										จ่ายเงิน
									</button>
								{:else}
									<button
										on:click={() => {
											pay();
										}}
										class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
									>
										{#if totalMoney >= 0}
											จ่ายเงิน
										{:else}
											กองกลางจ่ายเงิน
										{/if}
									</button>
								{/if}
							{:else}
								<button
									disabled
									type="button"
									class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
								>
									<svg
										aria-hidden="true"
										role="status"
										class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="#1C64F2"
										/>
									</svg>
									Loading...
								</button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{:else}
	{errorOccurred}
{/if}
