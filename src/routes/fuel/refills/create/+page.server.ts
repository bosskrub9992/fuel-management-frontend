import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import {
	PUBLIC_BASE_URL,
	PUBLIC_GET_LATEST_FUEL_INFO_ENDPOINT,
	PUBLIC_FUEL_REFILLS_ENDPOINT
} from '$env/static/public';

type GetLatestFuelInfoResponse = {
	latestFuelPrice: string;
	latestKilometerAfterUse: number;
};

export const load = (async ({ fetch, url }) => {
	try {
		const currentCarId = url.searchParams.get('currentCarId') as string;

		const query = new URLSearchParams({ carId: currentCarId });
		const queryParam = '?' + query.toString();
		const urlGetLatestFuelInfo =
			PUBLIC_BASE_URL + PUBLIC_GET_LATEST_FUEL_INFO_ENDPOINT + queryParam;
		console.info(`GET ${urlGetLatestFuelInfo}`);

		const response = await fetch(urlGetLatestFuelInfo);
		if (!response.ok) {
			const { code, message, data } = await response.json();
			throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
		}

		const { latestFuelPrice, latestKilometerAfterUse } =
			(await response.json()) as GetLatestFuelInfoResponse;

		return {
			latestFuelPrice,
			latestKilometerAfterUse
		};
	} catch (error) {
		console.error('error: ', error);
		throw error;
	}
}) satisfies PageServerLoad;

type CreateFuelRefillRequest = {
	currentCarId: number;
	refillTime: string | null; // RFC3339 / ISO8601
	kilometerBeforeRefill: number;
	kilometerAfterRefill: number;
	totalMoney: number;
	isPaid: boolean;
	currentUserId: number;
};

export const actions = {
	createFuelRefill: async ({ request, fetch }) => {
		const data = await request.formData();
		const kilometerBeforeRefill = Number(data.get('kilometerBeforeRefill'));
		const kilometerAfterRefill = Number(data.get('kilometerAfterRefill'));
		const currentCarId = Number(data.get('currentCarId'));
		const currentUserId = Number(data.get('currentUserId'));
		const isPaid = Boolean(data.get('isPaid'));
		const totalMoney = Number(data.get('totalMoney'));
		const rawRefillTime = data.get('refillTime') as string;

		const createFuelRefillRequest: CreateFuelRefillRequest = {
			currentCarId: currentCarId,
			refillTime: rawRefillTime + ":00+07:00",
			kilometerBeforeRefill: kilometerBeforeRefill,
			kilometerAfterRefill: kilometerAfterRefill,
			totalMoney: totalMoney,
			isPaid: isPaid,
			currentUserId: currentUserId
		};

		let redirectUrl = `/fuel/refills?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=success`;

		try {
			const urlCreateFuelRefills = PUBLIC_BASE_URL + PUBLIC_FUEL_REFILLS_ENDPOINT;
			console.info(`POST ${urlCreateFuelRefills}, request body: ${createFuelRefillRequest}`);

			const response = await fetch(urlCreateFuelRefills, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createFuelRefillRequest)
			});

			if (!response.ok) {
				const { code, message, data } = await response.json();
				throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
			}
		} catch (error) {
			console.error('error: ', error);
			redirectUrl = `/fuel/refills?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=failed`;
		}

		redirect(303, redirectUrl);
	}
} satisfies Actions;
