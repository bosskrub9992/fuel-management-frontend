<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let isPaid = false;
	let kilometerBeforeRefill = data.latestKilometerAfterUse;
	let kilometerAfterRefill = data.latestKilometerAfterUse;
	let totalMoney = 1;
	$: total = totalMoney / (kilometerAfterRefill - kilometerBeforeRefill);

	let now = new Date();
	let year = now.getFullYear();
	let month = ('0' + (now.getMonth() + 1)).slice(-2);
	let date = ('0' + now.getDate()).slice(-2);
	let hour = ('0' + now.getHours()).slice(-2);
	let minute = ('0' + now.getMinutes()).slice(-2);
	let nowBind = `${year}-${month}-${date}T${hour}:${minute}`;

	let userIdToNickname = new Map<number, string>();
	for (const user of data.allUsers) {
		userIdToNickname.set(user.id, user.nickname);
	}
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
						type="datetime-local"
						name="refillTime"
						id="refillTime"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						bind:value={nowBind}
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
								bind:value={isPaid}
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
						bind:value={total}
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
