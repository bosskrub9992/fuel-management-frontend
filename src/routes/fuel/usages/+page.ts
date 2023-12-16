import type { PageLoad } from './$types';
import {
    PUBLIC_BASE_URL,
    PUBLIC_GET_FUEL_USAGES_ENDPOINT,
} from '$env/static/public'

export const load = (async ({ fetch, url }) => {
    try {
        let currentUserId = url.searchParams.get("currentUserId") as string
        let currentCarId = url.searchParams.get("currentCarId") as string
        let pageIndex = url.searchParams.get("pageIndex") as string
        let pageSize = url.searchParams.get("pageSize") as string
        const query = new URLSearchParams({ currentUserId, currentCarId, pageIndex, pageSize });
        const queryParam = "?" + query.toString();

        let urlGetFuelUsages = PUBLIC_BASE_URL + PUBLIC_GET_FUEL_USAGES_ENDPOINT + queryParam
        console.log("urlGetFuelUsages: ", urlGetFuelUsages)

        let response = await fetch(urlGetFuelUsages)

        if (!response.ok) {
            const {code, message, data} = await response.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`);
        }

        const { currentPageIndex, currentPageSize, fuelUsageData, todayDate} = await response.json() as GetCarFuelUsageData

        return {
            currentPageIndex,
            currentPageSize,
            fuelUsageData,
            todayDate,
        };
    } catch (error) {
        console.log("error: ", error)
        throw error
    }
    
}) satisfies PageLoad;

type GetCarFuelUsageData = {
    fuelUsageData: FuelUsageData
    currentPageIndex: number
    currentPageSize: number
    todayDate: string
}

export type FuelUsageData = {
    latestKilometerAfterUse: number
    latestFuelPrice: number
    allUsers: User[]
    data: CarFuelUsageDatum[] | null
    allCars: Car[]
    totalRecord: number
    totalPage: number
    currentCar: Car
    currentUser: UserWithImageURL
}

export type CarFuelUsageDatum = {
    id: number
    fuelUseTime: string
    fuelPrice: number
    kilometerBeforeUse: number
    kilometerAfterUse: number
    description: string
    totalMoney: number
    fuelUsers: string
}

export type Car = {
    id: number
    name: string
}

export type User = {
    id: number
    nickname: string
}

export type UserWithImageURL = {
    id: number
    nickname: string
    defaultCarId: number
    userImageUrl: string
}
