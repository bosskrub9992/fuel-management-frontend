import type { LayoutLoad } from './$types'
import {
    PUBLIC_BASE_URL,
    PUBLIC_USERS_ENDPOINT,
    PUBLIC_CARS_ENDPOINT,
} from '$env/static/public'

export const load = (async ({ fetch, url }) => {
    try {
        let currentUserIdString = url.searchParams.get("currentUserId") as string
        let currentCarIdString = url.searchParams.get("currentCarId") as string
        let pageIndexString = url.searchParams.get("pageIndex") as string
        let pageSizeString = url.searchParams.get("pageSize") as string

        let currentUserId: number = parseInt(currentUserIdString)
        let currentCarId: number = parseInt(currentCarIdString)
        let pageIndex: number = parseInt(pageIndexString)
        let pageSize: number = parseInt(pageSizeString)

        let getCarUrl = PUBLIC_BASE_URL + PUBLIC_CARS_ENDPOINT
        let getUserUrl = PUBLIC_BASE_URL + PUBLIC_USERS_ENDPOINT

        let getCarResponse = await fetch(getCarUrl)
        if (!getCarResponse.ok) {
            const { code, message, data } = await getCarResponse.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        let getUserResponse = await fetch(getUserUrl)
        if (!getUserResponse.ok) {
            const { code, message, data } = await getUserResponse.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        const responseGetCars = await getCarResponse.json() as ResponseGetCars
        const responseGetUsers = await getUserResponse.json() as ResponseGetUsers

        let allCars = responseGetCars.data
        let allUsers = responseGetUsers.data

        let currentUser = allUsers.find((obj) => {
            return obj.id === currentUserId
        })

        let currentCar = allCars.find((obj) => {
            return obj.id === currentCarId
        })

        return {
            allCars,
            allUsers,
            currentUserId,
            currentCarId,
            pageIndex,
            pageSize,
            currentUser,
            currentCar,
        }

    } catch (error) {
        console.error("error: ", error)
        throw error
    }
}) satisfies LayoutLoad

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
    profileImageUrl: string
}

type ResponseGetCars = {
    data: Car[]
}

type ResponseGetUsers = {
    data: UserWithImageURL[]
}