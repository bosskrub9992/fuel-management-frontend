import type { PageServerLoad } from './$types';
import { BASE_URL, GET_FUEL_USAGES_ENDPOINT } from '$env/static/private'

export const load = (async ({ fetch, url }) => {
    try {
        let currentUserId = url.searchParams.get("currentUserId") as string
        let currentCarId = url.searchParams.get("currentCarId") as string
        let pageIndex = url.searchParams.get("pageIndex") as string
        let pageSize = url.searchParams.get("pageSize") as string
        const query = new URLSearchParams({ currentUserId, currentCarId, pageIndex, pageSize });
        const queryParam = "?" + query.toString();

        const res = await fetch(BASE_URL + GET_FUEL_USAGES_ENDPOINT + queryParam)
        const item = await res.json() as Promise<GetCarFuelUsageData>

        let data: Data = {
            fuelUsageData: item,
            currentPageIndex: parseInt(pageIndex),
            currentPageSize: parseInt(pageSize),
        }

        return data

    } catch (error) {
        console.log("error: ", error)
        throw error
    }

}) satisfies PageServerLoad;

type Data = {
    fuelUsageData: Promise<GetCarFuelUsageData>
    currentPageIndex: number
    currentPageSize: number
}

type GetCarFuelUsageData = {
    todayDate: string
    latestKilometerAfterUse: number
    latestFuelPrice: number
    allUsers: User[]
    data: CarFuelUsageDatum[]
    allCars: Car[]
    totalRecord: number
    currentCar: Car
    currentUser: UserWithImageURL
}

export type CarFuelUsageDatum = {
    id: number
    fuelUseDate: string
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

type UserWithImageURL = {
    id: number
    nickname: string
    userImageUrl: string
}
