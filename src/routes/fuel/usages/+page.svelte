<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ToastFailed from '$lib/components/toastFailed.svelte';
	import ToastSucceeded from '$lib/components/toastSucceeded.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	onMount(async () => {
		const { initFlowbite } = await import('flowbite');
		initFlowbite();
	});

	let to = $derived(Math.min(data.pageIndex * data.pageSize, data.totalRecord));

	let showing = $derived((data.pageIndex - 1) * data.pageSize + 1);

	let fuelUsageData = $derived.by(() => {
		if (data.fuelUsageData) {
			return data.fuelUsageData;
		}
		return [];
	});

	let nextPage = $derived.by(() => {
		if (data.pageIndex >= data.totalPage) {
			return data.totalPage;
		}
		return data.pageIndex + 1;
	});

	let previousPage = $derived.by(() => {
		if (data.pageIndex <= 1) {
			return 1;
		}
		return data.pageIndex - 1;
	});

	let toastMessage = $state(''); // case noStatus
	switch (data.showToast) {
		case 'noStatus':
			toastMessage = '';
			break;
		case 'success':
			toastMessage = 'เพิ่มการใช้รถ สำเร็จแล้ว';
			break;
		case 'updateSuccess':
			toastMessage = 'แก้ไขการใช้รถ สำเร็จแล้ว';
			break;
		case 'deleteSuccess':
			toastMessage = 'ลบการใช้รถ สำเร็จแล้ว';
			break;
		case 'failed':
			toastMessage = 'เพิ่มการใช้รถ ไม่สำเร็จ';
			break;
		case 'updateFailed':
			toastMessage = 'แก้ไขการใช้รถ ไม่สำเร็จ';
			break;
		case 'deleteFailed':
			toastMessage = 'ลบการใช้รถ ไม่สำเร็จ';
			break;
		default:
			toastMessage = 'เกิดข้อผิดพลาดบางอย่าง';
			console.error('data.showToast: ', data.showToast);
			break;
	}
</script>

<!-- toast notification -->
{#if data.showToast != null}
	{#if data.showToast === 'success' || data.showToast === 'updateSuccess' || data.showToast === 'deleteSuccess'}
		<ToastSucceeded {toastMessage} />
	{:else if data.showToast === 'failed' || data.showToast === 'updateFailed' || data.showToast === 'deleteFailed'}
		<ToastFailed {toastMessage} />
	{/if}
{/if}

<!-- table -->
<section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-0 antialiased">
	<div class="mx-auto max-w-screen-xl px-0 lg:px-12">
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
			<div
				class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
			>
				<div
					class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
				>
					<a
						href="/fuel/usages/create?currentUserId={data.currentUser?.id}&currentCarId={data
							.currentCar?.id}"
						class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
					>
						<svg
							class="h-3.5 w-3.5 mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								clip-rule="evenodd"
								fill-rule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							/>
						</svg>
						เพิ่มรายการใช้น้ำมัน
					</a>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th scope="col" class="px-2 py-3">วันที่</th>
							<th scope="col" class="px-2 py-3">คนนั่ง</th>
							<th scope="col" class="px-2 py-3">รายละเอียด</th>
							<th scope="col" class="px-2 py-3">กม. เริ่มต้น</th>
							<th scope="col" class="px-2 py-3">กม. สิ้นสุด</th>
							<th scope="col" class="px-2 py-3">เป็นเงิน (บาท)</th>
						</tr>
					</thead>
					<tbody>
						{#each fuelUsageData as fuelUsageDatum}
							<tr
								onclick={() => {
									goto(
										`/fuel/usages/${fuelUsageDatum.id}?currentUserId=${data.currentUser?.id}&currentCarId=${data.currentCar?.id}`
									);
								}}
								class="border-b dark:border-gray-700"
							>
								<td id="td-{fuelUsageDatum.id}-FuelUseDate" class="px-2 py-3">
									{fuelUsageDatum.fuelUseTime}</td
								>
								<td id="td-{fuelUsageDatum.id}-FuelUsers" class="px-2 py-3 align-middle"
									>{fuelUsageDatum.fuelUsers}</td
								>
								<td id="td-{fuelUsageDatum.id}-Description" class="px-2 py-3"
									>{fuelUsageDatum.description}</td
								>
								<td
									id="td-{fuelUsageDatum.id}-KilometerBeforeUse"
									class="px-2 py-3 max-w-[12rem] truncate">{fuelUsageDatum.kilometerBeforeUse}</td
								>
								<td id="td-{fuelUsageDatum.id}-KilometerAfterUse" class="px-2 py-3"
									>{fuelUsageDatum.kilometerAfterUse}</td
								>
								<td id="td-{fuelUsageDatum.id}-TotalMoney" class="px-2 py-3"
									>{fuelUsageDatum.totalMoney}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<nav>
				<div class="flex flex-col items-center p-3">
					<span class="text-sm text-gray-700 dark:text-gray-400">
						Showing
						<span class="font-semibold text-gray-900 dark:text-white">{showing}</span>
						to
						<span class="font-semibold text-gray-900 dark:text-white">{to}</span>
						of
						<span class="font-semibold text-gray-900 dark:text-white">{data.totalRecord}</span> Entries
					</span>
					<div class="inline-flex mt-2 xs:mt-0">
						<a
							href="/fuel/usages?currentUserId={data.currentUser?.id}&currentCarId={data.currentCar
								?.id}&pageIndex={previousPage}&pageSize=8"
							class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						>
							Prev
						</a>
						<a
							href="/fuel/usages?currentUserId={data.currentUser?.id}&currentCarId={data.currentCar
								?.id}&pageIndex={nextPage}&pageSize=8"
							class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						>
							Next
						</a>
					</div>
				</div>
			</nav>
		</div>
	</div>
</section>
