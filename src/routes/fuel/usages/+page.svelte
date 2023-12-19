<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from "svelte";
	import type { FuelUsageDatum } from "./+page.ts";

	export let data: PageData;

	onMount(async () => {
		const { initFlowbite } = await import('flowbite');
		initFlowbite();
	});

	$: to = Math.min(
		data.pageIndex * data.pageSize, 
		data.totalRecord,
	)

	$: showing = (data.pageIndex - 1) * data.pageSize + 1
	
	let fuelUsageData :FuelUsageDatum[] = []
	$: {
		if (data.fuelUsageData) {
			fuelUsageData = data.fuelUsageData
		}
	}
	
	$: nextPage = data.pageIndex + 1
	$: {
		if (data.pageIndex >= data.totalPage) {
			nextPage = data.totalPage
		}
	}

	$: previousPage = data.pageIndex - 1
	$: {
		if (data.pageIndex <= 1) {
			previousPage = 1
		}
	}
</script>

<!-- toast notification -->
{#if data.showToast === "success"}
	<div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 mx-auto" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
			</svg>
			<span class="sr-only">Check icon</span>
		</div>
		<div class="ms-3 text-sm font-normal">เพิ่มการใช้รถสำเร็จแล้ว</div>
		<button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
			<span class="sr-only">Close</span>
			<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
			</svg>
		</button>
	</div>
{:else if  data.showToast === "failed"}
	<div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
			</svg>
			<span class="sr-only">Error icon</span>
		</div>
		<div class="ms-3 text-sm font-normal">เพิ่มการใช้รถไม่สำเร็จ</div>
		<button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
			<span class="sr-only">Close</span>
			<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
			</svg>
		</button>
	</div>
{/if}

 <!-- table -->
 <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-0 antialiased">
	<div class="mx-auto max-w-screen-xl px-0 lg:px-12">
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
				<div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
					<a href="/fuel/usages/create?currentUserId={data.currentUser.id}&currentCarId={data.currentCar.id}"
						class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                        <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
						เพิ่มรายการใช้น้ำมัน
					</a>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
						{#each fuelUsageData as fuelUsageDatum }
						<tr class="border-b dark:border-gray-700">
							<td id="td-{fuelUsageDatum.id}-FuelUseDate" class="px-2 py-3"> {fuelUsageDatum.fuelUseTime}</td>
							<td id="td-{fuelUsageDatum.id}-FuelUsers" class="px-2 py-3 align-middle">{fuelUsageDatum.fuelUsers}</td>
							<td id="td-{fuelUsageDatum.id}-Description" class="px-2 py-3">{fuelUsageDatum.description}</td>
							<td id="td-{fuelUsageDatum.id}-KilometerBeforeUse" class="px-2 py-3 max-w-[12rem] truncate">{fuelUsageDatum.kilometerBeforeUse}</td>
							<td id="td-{fuelUsageDatum.id}-KilometerAfterUse" class="px-2 py-3">{fuelUsageDatum.kilometerAfterUse}</td>
							<td id="td-{fuelUsageDatum.id}-TotalMoney" class="px-2 py-3">{fuelUsageDatum.totalMoney}</td>
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
						<a href="/fuel/usages?currentUserId={data.currentUser.id}&currentCarId={data.currentCar.id}&pageIndex={previousPage}&pageSize=8" class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Prev
						</a>
						<a href="/fuel/usages?currentUserId={data.currentUser.id}&currentCarId={data.currentCar.id}&pageIndex={nextPage}&pageSize=8" class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Next
						</a>
					</div>
				</div>
			</nav>
		</div>
	</div>
</section>
