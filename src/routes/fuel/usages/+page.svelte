<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from "svelte";
	import type { CarFuelUsageDatum } from "./+page.ts";

	export let data: PageData;

	onMount(async () => {
		const { initFlowbite } = await import('flowbite');
		initFlowbite();
	});

	$: to = Math.min(
		data.pageIndex * data.pageSize, 
		data.fuelUsageData.totalRecord,
	)

	$: showing = (data.pageIndex - 1) * data.pageSize + 1
	
	let carFuelUsageData :CarFuelUsageDatum[] = []
	$: {
		if (data.fuelUsageData.data) {
			carFuelUsageData = data.fuelUsageData.data
		}
	}
	
	let nextPage = data.pageIndex + 1
	if (data.pageIndex >= data.fuelUsageData.totalPage) {
		nextPage = data.fuelUsageData.totalPage
	}

	let previousPage = data.pageIndex - 1
	if (data.pageIndex <= 1) {
		previousPage = 1
	}
</script>

<header class="flex flex-col antialiased">
	<nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900 order-1">
		<div class="flex justify-between items-center">
			<div class="flex justify-start items-center">
				<button id="dropdownUserCarButton" data-dropdown-toggle="dropdownUserCar" class="flex justify-between items-center p-2 rounded-lg dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-50 dark:hover-bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700" type="button">
					<span class="sr-only">Open user car</span>
					<div class="flex items-center">
						<div class="text-left">   
							<div class="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">{data.currentCar.name}</div>
						</div>
					</div>
					<svg class="w-3 h-3 text-gray-500 dark:text-gray-400 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
					  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5m0 6 4 4 4-4"/>
					</svg>
				</button>
				<!-- Dropdown menu -->
				<div id="dropdownUserCar" class="hidden z-10 w-auto bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" data-popper-placement="bottom">
					{#each data.allCars as car}
						<a href="{`/fuel/usages?currentUserId=${data.currentUser.id}&currentCarId=${car.id}&pageIndex=1&pageSize=8`}" class="flex items-center py-3 px-4 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
							<div class="text-left">   
								<div class="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">{car.name}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
			<div class="flex justify-between items-center lg:order-2">
				<a href="/" class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"> 
					<span class="sr-only">Open user menu</span> 
					<img class="w-8 h-8 rounded-full" src={data.currentUser.profileImageUrl} alt="user profile" />
				</a>
			</div>

		</div>
	</nav>
</header>

 <!-- table -->
 <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-0 antialiased">
	<div class="mx-auto max-w-screen-xl px-0 lg:px-12">
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
				<div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
					<a href="/fuel/usages/create"
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
						{#each carFuelUsageData as fuelUsageDatum }
						<tr class="border-b dark:border-gray-700">
							<td id="td-{fuelUsageDatum.id}-FuelUseDate" class="px-2 py-3"> {fuelUsageDatum.fuelUseTime}</td>
							<td id="td-{fuelUsageDatum.id}-FuelUsers" class="px-2 py-3 whitespace-nowrap">{fuelUsageDatum.fuelUsers}</td>
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
					<!-- Help text -->
					<span class="text-sm text-gray-700 dark:text-gray-400">
						Showing 
						<span class="font-semibold text-gray-900 dark:text-white">{showing}</span>
						 to 
						<span class="font-semibold text-gray-900 dark:text-white">{to}</span>
						 of 
						 <span class="font-semibold text-gray-900 dark:text-white">{data.fuelUsageData.totalRecord}</span> Entries
					</span>
					<!-- Buttons -->
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

<!-- bottom navigation -->
<nav>
	<div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
		<div class="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
			<a 
				href="/fuel/refills" 
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="text-md text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">เติมน้ำมัน</span>
			</a>
			<a 
				href="{`/fuel/usages?currentUserId=${data.currentUser.id}&currentCarId=${data.currentCar.id}&pageIndex=1&pageSize=8`}" 
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="text-md text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">ใช้รถ</span>
			</a>
		</div>
	</div>
</nav>