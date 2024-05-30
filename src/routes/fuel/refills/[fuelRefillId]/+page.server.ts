import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BASE_URL, PUBLIC_FUEL_REFILLS_ENDPOINT } from '$env/static/public';

type GetFuelRefillByIDResponse = {
	refillTime: string;
	kilometerBeforeRefill: number;
	kilometerAfterRefill: number;
	totalMoney: number;
	fuelPriceCalculated: number;
	isPaid: boolean;
	refillBy: number
};

export const load = (async ({ fetch, params }) => {
	try {
		const fuelRefillId = Number(params.fuelRefillId);

		const urlGetFuelRefillById =
			PUBLIC_BASE_URL + PUBLIC_FUEL_REFILLS_ENDPOINT + `/${fuelRefillId}`;
		console.info(`GET ${urlGetFuelRefillById}`);

		const response = await fetch(urlGetFuelRefillById);
		if (!response.ok) {
			const { code, message, data } = await response.json();
			throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
		}

		const getFuelRefillByIdResponse = (await response.json()) as GetFuelRefillByIDResponse;

		return {
			getFuelRefillByIdResponse,
			fuelRefillId
		};
	} catch (error) {
		console.error('error: ', error);
		throw error;
	}
}) satisfies PageServerLoad;

type PutFuelRefillRequest = {
	currentCarId: number;
	currentUserId: number;
	refillTime: string; // RFC3339 / ISO8601
	kilometerBeforeRefill: number;
	kilometerAfterRefill: number;
	totalMoney: number;
	isPaid: boolean;
	refillBy: number
};

export const actions = {
	updateFuelRefill: async ({ request, fetch }) => {
		const data = await request.formData();
		const fuelRefillId = Number(data.get('fuelRefillId'));
		const currentCarId = Number(data.get('currentCarId'));
		const currentUserId = Number(data.get('currentUserId'));
		const rawRefillTime = data.get('refillTime') as string; // format 2006-01-02T15:04
		const kilometerBeforeRefill = Number(data.get('kilometerBeforeRefill'));
		const kilometerAfterRefill = Number(data.get('kilometerAfterRefill'));
		const totalMoney = Number(data.get("totalMoney"))
		const isPaid = Boolean(data.get("isPaid"))
		const refillBy = Number(data.get("refillBy"))

		const putFuelRefillRequest: PutFuelRefillRequest = {
			currentCarId: currentCarId,
			currentUserId: currentUserId,
			refillTime: rawRefillTime + ":00+07:00",
			kilometerBeforeRefill: kilometerBeforeRefill,
			kilometerAfterRefill: kilometerAfterRefill,
			totalMoney: totalMoney,
			isPaid: isPaid,
			refillBy: refillBy,
		};

		let showToast = 'updateSuccess';

		try {
			const urlPutFuelRefillById =
				PUBLIC_BASE_URL + PUBLIC_FUEL_REFILLS_ENDPOINT + `/${fuelRefillId}`;
			console.info(`PUT ${urlPutFuelRefillById}, request body: ${JSON.stringify(putFuelRefillRequest)}`);

			const response = await fetch(urlPutFuelRefillById, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(putFuelRefillRequest)
			});
			if (!response.ok) {
				const { code, message, data } = await response.json();
				console.error(Error(`code: ${code}, message: ${message}, data: ${data}`));
				showToast = 'updateFailed';
			}
		} catch (error) {
			console.error('error: ', error);
			showToast = 'updateFailed';
		}

		const redirectUrl = `/fuel/refills?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=${showToast}`;
		redirect(303, redirectUrl);
	},
	deleteFuelRefill: async ({ request, fetch }) => {
		const data = await request.formData();
		const fuelRefillId = Number(data.get('fuelRefillId'));
		const currentCarId = Number(data.get('currentCarId'));
		const currentUserId = Number(data.get('currentUserId'));

		let showToast = 'deleteSuccess';

		try {
			const urlDeleteFuelRefill =
				PUBLIC_BASE_URL + PUBLIC_FUEL_REFILLS_ENDPOINT + `/${fuelRefillId}`;
			console.info(`DELETE ${urlDeleteFuelRefill}`);

			const response = await fetch(urlDeleteFuelRefill, {
				method: 'DELETE'
			});
			if (!response.ok) {
				const { code, message, data } = await response.json();
				console.error(`code: ${code}, message: ${message}, data: ${data}`);
				showToast = 'deleteFailed';
			}
		} catch (error) {
			console.error('error: ', error);
			showToast = 'deleteFailed';
		}

		const redirectUrl = `/fuel/refills?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=${showToast}`;
		redirect(303, redirectUrl);
	}
} satisfies Actions;
