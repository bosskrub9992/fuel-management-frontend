<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { PUBLIC_BASE_URL, PUBLIC_USERS_ENDPOINT } from '$env/static/public';

	export let data: PageData;

	type getUserUnpaidFuelUsagesResponse = {
		userFuelUsages: userFuelUsage[];
	};

	type userFuelUsage = {
		car: {
			id: number;
			name: string;
		};
		fuelUsages: {
			id: number;
			fuelUsageUserId: number;
			fuelUseTime: string;
			payEach: string;
		};
	};

	let promiseUserUnpaidFuelUsage: null | Promise<getUserUnpaidFuelUsagesResponse> = null;

	onMount(async () => {
		promiseUserUnpaidFuelUsage = getUserUnpaidFuelUsages();
	});

	let urlGetUserUnpaidFuelUsages = `${PUBLIC_BASE_URL}${PUBLIC_USERS_ENDPOINT}/${data.userId}/fuel-usages?isPaid=false`;

	async function getUserUnpaidFuelUsages() {
		const res = await fetch(urlGetUserUnpaidFuelUsages);
		if (res.ok) {
			const UserUnpaidFuelUsages = (await res.json()) as getUserUnpaidFuelUsagesResponse;
			return UserUnpaidFuelUsages;
		} else {
			const { code, message, data } = await res.json();
			throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
		}
	}
</script>

<h1>รายการรอคุณจ่าย</h1>

{#if browser}
	{#await promiseUserUnpaidFuelUsage}
		<p>fetching...</p>
	{:then userUnpaidFuelUsages}
		{#if userUnpaidFuelUsages}
			{userUnpaidFuelUsages.userFuelUsages}
		{/if}
	{:catch error}
		{error}
	{/await}
{/if}
