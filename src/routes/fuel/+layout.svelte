<script lang="ts">
    import type { LayoutData } from './$types';
    import { onMount } from "svelte";
    
    export let data: LayoutData;

	onMount(async () => {
		const { initFlowbite } = await import('flowbite');
		initFlowbite();
	});
</script>

<!-- top navigation -->
<header class="flex flex-col antialiased">
	<nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900 order-1">
		<div class="flex justify-between items-center">
			<div class="flex justify-start items-center">
				<button id="dropdownUserCarButton" data-dropdown-toggle="dropdownUserCar" class="flex justify-between items-center p-2 rounded-lg dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-50 dark:hover-bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700" type="button">
					<span class="sr-only">Open user car</span>
					<div class="flex items-center">
						<div class="text-left">   
							<div class="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">{data.currentCar?.name}</div>
						</div>
					</div>
					<svg class="w-3 h-3 text-gray-500 dark:text-gray-400 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
					  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5m0 6 4 4 4-4"/>
					</svg>
				</button>
				<!-- Dropdown menu -->
				<div id="dropdownUserCar" class="hidden z-10 w-auto bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" data-popper-placement="bottom">
					{#each data.allCars as car}
						<a href="{`/fuel/usages?currentUserId=${data.currentUser?.id}&currentCarId=${car.id}&pageIndex=1&pageSize=8`}" class="flex items-center py-3 px-4 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
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
					<img class="w-8 h-8 rounded-full" src={data.currentUser?.profileImageUrl} alt="user profile" />
				</a>
			</div>

		</div>
	</nav>
</header>

<!-- main content -->
<slot></slot>

<!-- bottom navigation -->
<div class="h-16 bg-white"></div>
<nav>
	<div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
		<div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
			<a 
				href="{`/fuel/refills?currentUserId=${data.currentUser?.id}&currentCarId=${data.currentCar?.id}&pageIndex=1&pageSize=8`}"
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="text-md text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">เติมน้ำมัน</span>
			</a>
			<a 
				href="{`/fuel/usages?currentUserId=${data.currentUser?.id}&currentCarId=${data.currentCar?.id}&pageIndex=1&pageSize=8`}" 
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="text-md text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">ใช้รถ</span>
			</a>
			<a 
				href="{`/fuel/payments/?currentUserId=${data.currentUser?.id}&currentCarId=${data.currentCar?.id}`}" 
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
				<span class="text-md text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">จ่ายเงิน</span>
			</a>
		</div>
	</div>
</nav>