<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import flatpickr from 'flatpickr';

	interface Props {
		data: PageData;
	}

	let { data = $bindable() }: Props = $props();

	let isPaid = $state(false);
	let kilometerBeforeRefill = $state(data.latestKilometerAfterUse);
	let kilometerAfterRefill = $state(data.latestKilometerAfterUse);
	let totalMoney = $state(1);
	let fuelPrice = $derived(totalMoney / (kilometerAfterRefill - kilometerBeforeRefill));

	let defaultRefillTime = new Date();
	let year = defaultRefillTime.getFullYear();
	let month = ('0' + (defaultRefillTime.getMonth() + 1)).slice(-2);
	let date = ('0' + defaultRefillTime.getDate()).slice(-2);
	let hour = ('0' + defaultRefillTime.getHours()).slice(-2);
	let minute = ('0' + defaultRefillTime.getMinutes()).slice(-2);
	let second = ('0' + defaultRefillTime.getSeconds()).slice(-2);

	let refillTime = $state(`${year}-${month}-${date}T${hour}:${minute}:${second}+07:00`);
	let refillTimeInputElement = $state<HTMLElement>();

	onMount(() => {
		if (refillTimeInputElement) {
			flatpickr(refillTimeInputElement, {
				disableMobile: true,
				allowInput: true,
				clickOpens: true,
				enableTime: true,
				dateFormat: 'Y-m-dTH:i:S+07:00',
				altInput: true,
				altFormat: 'j F Y h:i:S K',
				enableSeconds: true,
				defaultDate: defaultRefillTime,
				onValueUpdate: (selectedDates, dateStr, instance) => {
					refillTime = dateStr;
				}
			});
		}
	});

	let refillBy = $state(data.currentUserId);
</script>

<section class="bg-white dark:bg-gray-900">
	<div class="py-2 px-4 mx-auto max-w-2xl lg:py-16">
		<form method="POST">
			<h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">
				เพิ่มรายการเติมน้ำมัน
			</h2>
			<div class="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
				<div>
					<label
						for="refillTime"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วันที่</label
					>
					<input
						name="refillTime"
						id="refillTime"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						bind:value={refillTime}
						bind:this={refillTimeInputElement}
						required
					/>
				</div>
				<div>
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="fuelUserIds">สถานะการจ่ายเงินจากกองกลาง</label
					>
					<div class="flex items-center space-x-4">
						<div class="flex items-center pt-3">
							<input
								id="isPaid"
								type="checkbox"
								name="isPaid"
								bind:checked={isPaid}
								class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
							<label
								for="inline-checkbox"
								class="ml-2 text-sm font-sm text-gray-900 dark:text-gray-300">กองกลางจ่ายแล้ว</label
							>
						</div>
					</div>
				</div>
				<div>
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="paidFuelUserIds"
					>
						คนที่เติมน้ำมัน
					</label>
					<div class="flex items-center space-x-4">
						{#each data.allUsers as user}
							<div class="flex items-center">
								<input
									id="inline-radio"
									type="radio"
									name="refillBy"
									value={user.id}
									bind:group={refillBy}
									class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
								/>
								<label
									for="inline-radio"
									class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
									>{user.nickname}</label
								>
							</div>
						{/each}
					</div>
				</div>
				<div>
					<label
						for="kilometerBeforeRefill"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>กม.ก่อนเติมน้ำมัน</label
					>
					<input
						type="number"
						name="kilometerBeforeRefill"
						id="kilometerBeforeRefill"
						bind:value={kilometerBeforeRefill}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label
						for="kilometerAfterRefill"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>กม.หลังเติมน้ำมัน</label
					>
					<input
						type="number"
						name="kilometerAfterRefill"
						id="kilometerAfterRefill"
						bind:value={kilometerAfterRefill}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label
						for="totalMoney"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>จ่ายเงินเติมน้ำมันไป</label
					>
					<input
						type="number"
						name="totalMoney"
						id="totalMoney"
						bind:value={totalMoney}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
				<div>
					<label
						for="fuelPrice"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>ราคาน้ำมันต่อกม.</label
					>
					<input
						type="number"
						name="fuelPrice"
						id="fuelPrice"
						value={fuelPrice}
						class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						readonly
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
			</div>
			<button
				type="submit"
				formaction="?/createFuelRefill"
				class="inline-flex items-center px-5 py-2.5 text-md font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
			>
				เพิ่มการเติมน้ำมัน
			</button>
		</form>
	</div>
</section>
