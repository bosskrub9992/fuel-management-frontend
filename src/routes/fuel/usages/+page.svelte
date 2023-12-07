<script lang="ts">
	import type { PageData } from './$types';
	import type { Car, User, CarFuelUsageDatum } from './+page.server';

	export let data: PageData;

	let allCars: Car[];
	if (data.fuelUsageData.allCars) {
		allCars = data.fuelUsageData.allCars;
	}

	let allUsers: User[];
	if (data.fuelUsageData.allUsers) {
		allUsers = data.fuelUsageData.allUsers;
	}

	let fuelUsageRecords: CarFuelUsageDatum[]
	if (data.fuelUsageData.data) {
		fuelUsageRecords = data.fuelUsageData.data
	}

	let chooseCarDropDownClass = ""
</script>

<header class="flex flex-col antialiased">
	<nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900 order-1">
		<div class="flex justify-between items-center">
			<div class="flex justify-start items-center">
				<button id="dropdownUserCarButton" class="flex justify-between items-center p-2 rounded-lg dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-50 dark:hover-bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700" type="button">
					<span class="sr-only">Open user car</span>
					<div class="flex items-center">
						<div class="text-left">
							<div class="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">
								{data.fuelUsageData.currentCar?.name}
							</div>
						</div>
					</div>
					<svg class="w-3 h-3 text-gray-500 dark:text-gray-400 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5m0 6 4 4 4-4" />
					</svg>
				</button>
				<!-- Dropdown menu -->
				<div id="dropdownUserCar" class="hidden z-20 w-60 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
					{#each allCars as car}
						<a href={`/fuel/usages?currentUserId=${data.fuelUsageData.currentUser?.id}&carId=${car.id}&pageIndex=1&pageSize=20`} class="flex items-center py-3 px-4 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
							<div class="text-left">
								<div class="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">
									{car.name}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
			<div class="flex justify-between items-center lg:order-2">
				<a href="/" class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"> 
					<span class="sr-only">Open user menu</span> 
					<img class="w-8 h-8 rounded-full" src={data.fuelUsageData.currentUser?.userImageUrl} alt="user profile" />
				</a>
				<button type="button" id="toggleMobileMenuButton" data-collapse-toggle="toggleMobileMenu" class="items-center p-2 text-gray-500 rounded-lg md:ml-2 md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
					<span class="sr-only">Open menu</span>
					<svg class="w-[18px] h-[18px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
					</svg>
				</button>
			</div>
		</div>
	</nav>

	<!-- tab -->
	<nav id="toggleMobileMenu" class="hidden order-3 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 md:block dark:border-gray-800 md:order-2">
		<div class="px-0 lg:px-6">
			<div class="flex items-center">
				<ul class="flex flex-col mt-0 w-full text-sm font-medium md:flex-row">
					<li class="block border-b dark:border-gray-700 md:inline md:border-b-0">
						<a href="/fuel/usages" class="block py-3 px-4 border-b-2 text-primary-600 hover:text-primary-600 dark:text-primary-500 dark:border-primary-500 border-primary-600" aria-current="page">ใช้น้ำมัน</a>
					</li>
					<li class="block border-b dark:border-gray-700 md:inline md:border-b-0">
						<a href="/fuel/refills" class="block py-3 px-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 hover:border-b-2 dark:hover:text-primary-500 dark:hover:border-primary-500 hover:border-primary-600" >เติมน้ำมัน</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>

 <!-- table -->
 <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-0 antialiased">
	<div class="mx-auto max-w-screen-xl px-0 lg:px-12">
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
				<div class="w-full md:w-1/2">
					<button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
						<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-1.5 -ml-1 text-gray-400"  fill="currentColor">
							<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
						</svg>
						Filter options
						<svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor"  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
						</svg>
					</button>
				</div>
				<div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
					<button type="button" id="createProductModalButton" data-modal-show="createProductModal" data-modal-toggle="createProductModal" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
						<svg class="h-3.5 w-3.5 mr-2" fill="currentColor"  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
						</svg>
						เพิ่มรายการใช้น้ำมัน
					</button>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-2 py-3">วันที่ใช้รถ</th>
							<th scope="col" class="px-2 py-3">คนหาร</th>
							<th scope="col" class="px-2 py-3">รายละเอียด</th>
							<th scope="col" class="px-2 py-3">น้ำมันเริ่มต้น (กม.)</th>
							<th scope="col" class="px-2 py-3">น้ำมันสิ้นสุด (กม.)</th>
							<th scope="col" class="px-2 py-3">เป็นเงิน (บาท)</th>
							<th scope="col" class="px-1 py-3">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each fuelUsageRecords as fuelUsageRecord }
						<tr id="tr-{fuelUsageRecord.id}" class="border-b dark:border-gray-700">
							<td id="td-{fuelUsageRecord.id}-FuelUseDate" class="px-2 py-3"> {fuelUsageRecord.fuelUseDate}</td>
							<td id="td-{fuelUsageRecord.id}-FuelUsers" class="px-2 py-3">{fuelUsageRecord.fuelUsers}</td>
							<td id="td-{fuelUsageRecord.id}-Description" class="px-2 py-3">{fuelUsageRecord.description}</td>
							<td id="td-{fuelUsageRecord.id}-KilometerBeforeUse" class="px-2 py-3 max-w-[12rem] truncate">{fuelUsageRecord.kilometerBeforeUse}</td>
							<td id="td-{fuelUsageRecord.id}-KilometerAfterUse" class="px-2 py-3">{fuelUsageRecord.kilometerAfterUse}</td>
							<td id="td-{fuelUsageRecord.id}-TotalMoney" class="px-2 py-3">{fuelUsageRecord.totalMoney}</td>
							<td class="px-1 py-3 flex items-center justify-end">
								<button id="{fuelUsageRecord.id}-dropdown-button" data-dropdown-toggle="{fuelUsageRecord.id}-dropdown" class="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
									<svg class="w-5 h-5" aria-hidden="true" fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
										<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
									</svg>
								</button>
								<div id="{fuelUsageRecord.id}-dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
									<ul class="py-1 text-sm" aria-labelledby="{fuelUsageRecord.id}-dropdown-button">
										<li>
											<!-- data-modal-toggle="updateProductModal-{{.ID}}" -->
											<button id="buttonToggleUpdateModal" type="button" data-modal-target="updateProductModal"  class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
												<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"  fill="currentColor" aria-hidden="true">
													<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
													<path fill-rule="evenodd" clip-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
												</svg>
												Edit
											</button>
										</li>
										<li>
											<button type="button" data-modal-target="deleteModal" data-modal-toggle="deleteModal" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400">
												<svg class="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
													<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
												</svg>
												Delete
											</button>
										</li>
									</ul>
								</div>
							</td>
						</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<nav>
				<div class="flex flex-col items-center">
					<!-- Help text -->
					<span class="text-sm text-gray-700 dark:text-gray-400">
						Showing <span class="font-semibold text-gray-900 dark:text-white">1</span> to <span class="font-semibold text-gray-900 dark:text-white">10</span> of <span class="font-semibold text-gray-900 dark:text-white">{data.fuelUsageData.totalRecord}</span> Entries
					</span>
					<!-- Buttons -->
					<div class="inline-flex mt-2 xs:mt-0">
						<button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Prev
						</button>
						<button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Next
						</button>
					</div>
				</div>
				<div class="flex flex-col items-center">
					<!-- Help text -->
					<span class="text-sm text-gray-700 dark:text-gray-400">
						Showing <span class="font-semibold text-gray-900 dark:text-white">1</span> to <span class="font-semibold text-gray-900 dark:text-white">10</span> of <span class="font-semibold text-gray-900 dark:text-white">100</span> Entries
					</span>
					<!-- Buttons -->
					<div class="inline-flex mt-2 xs:mt-0">
						<button class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Prev
						</button>
						<button class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							Next
						</button>
					</div>
				</div>
			</nav>
			<!-- <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
				<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
					Showing
					<span class="font-semibold text-gray-900 dark:text-white">1-10</span>
					of
					<span class="font-semibold text-gray-900 dark:text-white">1000</span>
				</span>
				<ul class="inline-flex items-stretch -space-x-px">
					<li>
						<a href="#" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							<span class="sr-only">Previous</span>
							<svg class="w-5 h-5" aria-hidden="true" fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</a>
					</li>
					<li>
						<a href="#" aria-current="page" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
					</li>
					<li>
						<a href="/fuel/usages?currentUserId={data.fuelUsageData.currentUser?.id}&currentCarId={data.fuelUsageData.currentCar?.id}&pageIndex=2&pageSize=20" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
					</li>
					<li>
						<a href="/fuel/usages?currentUserId={data.fuelUsageData.currentUser?.id}&currentCarId={data.fuelUsageData.currentCar?.id}&pageIndex=3&pageSize=20" class="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
					</li>
					<li>
						<a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
					</li>
					<li>
						<a href="/fuel/usages?currentUserId={data.fuelUsageData.currentUser?.id}&currentCarId={data.fuelUsageData.currentCar?.id}&pageIndex=100&pageSize=20" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
					</li>
					<li>
						<a href="#" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
							<span class="sr-only">Next</span>
							<svg class="w-5 h-5" aria-hidden="true" fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
							</svg>
						</a>
					</li>
				</ul>
			</nav> -->
		</div>
	</div>
</section>
