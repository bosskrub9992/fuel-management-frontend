import type { PageLoad } from './$types'
import {
    PUBLIC_BASE_URL,
    PUBLIC_GET_FUEL_USAGES_ENDPOINT,
} from '$env/static/public'

type GetFuelUsagesResponse = {
    fuelUsageData: FuelUsageDatum[] | null
    totalRecord: number
    totalPage: number
}

export type FuelUsageDatum = {
    id: number
    fuelUseTime: string
    fuelPrice: number
    kilometerBeforeUse: number
    kilometerAfterUse: number
    description: string
    totalMoney: number
    fuelUsers: string
}

export const load = (async ({ fetch, url }) => {
    try {
        let currentUserId = url.searchParams.get("currentUserId") as string
        let currentCarId = url.searchParams.get("currentCarId") as string
        let pageIndex = url.searchParams.get("pageIndex") as string
        let pageSize = url.searchParams.get("pageSize") as string
        const query = new URLSearchParams({ currentUserId, currentCarId, pageIndex, pageSize })
        const queryParam = "?" + query.toString()

        let urlGetFuelUsages = PUBLIC_BASE_URL + PUBLIC_GET_FUEL_USAGES_ENDPOINT + queryParam
        console.info(`GET ${urlGetFuelUsages}`)

        let response = await fetch(urlGetFuelUsages)

        if (!response.ok) {
            const { code, message, data } = await response.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        const { fuelUsageData, totalRecord, totalPage } = await response.json() as GetFuelUsagesResponse

        let showToast = "noStatus"
        let rawShowToast = url.searchParams.get("showToast")
        if (rawShowToast !== null) {
            let s = ["noStatus", "failed", "success"]
            if (s.includes(rawShowToast)) {
                showToast = rawShowToast
            }
        }

        return {
            fuelUsageData,
            totalRecord,
            totalPage,
            showToast,
        }
    } catch (error) {
        console.error("error: ", error)
        throw error
    }

}) satisfies PageLoad
