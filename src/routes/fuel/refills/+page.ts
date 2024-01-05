import type { PageLoad } from './$types';
import { PUBLIC_BASE_URL, PUBLIC_FUEL_REFILLS_ENDPOINT } from '$env/static/public';

export type FuelRefillDatum = {
	id: number;
	refillTime: string;
	kilometerBeforeRefill: number;
	kilometerAfterRefill: number;
	totalMoney: string;
	fuelPriceCalculated: number;
	isPaid: boolean;
};

type GetFuelRefillsResponse = {
	fuelRefillData: FuelRefillDatum[] | null;
	totalRecord: number;
	totalPage: number;
};

export type FuelRefill = {
	fuelRefillData: FuelRefillDatum[] | null;
	showToast: string;
	totalRecord: number;
	totalPage: number;
};

const allStatus = [
	'noStatus',
	'failed',
	'success',
	'updateSuccess',
	'updateFailed',
	'deleteSuccess',
	'deleteFailed'
];

export const load = (async ({ fetch, url }) => {
	try {
		const currentUserId = url.searchParams.get('currentUserId') as string;
		const currentCarId = url.searchParams.get('currentCarId') as string;
		const pageIndex = url.searchParams.get('pageIndex') as string;
		const pageSize = url.searchParams.get('pageSize') as string;
		const query = new URLSearchParams({ currentUserId, currentCarId, pageIndex, pageSize });
		const queryParam = '?' + query.toString();

		const urlGetFuelRefills = PUBLIC_BASE_URL + PUBLIC_FUEL_REFILLS_ENDPOINT + queryParam;
		const response = await fetch(urlGetFuelRefills);

		if (!response.ok) {
			const { code, message, data } = await response.json();
			throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
		}

		const { fuelRefillData, totalRecord, totalPage } =
			(await response.json()) as GetFuelRefillsResponse;
		let showToast = 'noStatus';
		const rawShowToast = url.searchParams.get('showToast');
		if (rawShowToast !== null) {
			if (allStatus.includes(rawShowToast)) {
				showToast = rawShowToast;
			}
		}

		const fuelRefill: FuelRefill = {
			fuelRefillData: fuelRefillData,
			showToast: showToast,
			totalPage: totalPage,
			totalRecord: totalRecord
		};
		return {
			fuelRefill
		};
	} catch (error) {
		console.error('error: ', error);
		throw error;
	}
}) satisfies PageLoad;
