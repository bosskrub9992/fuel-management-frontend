import type { PageLoad } from './$types';

type GetFuelRefillResponse = {
    fuelUsageData: FuelRefillDatum[] | null
    totalRecord: number
    totalPage: number
}

export type FuelRefillDatum = {
    id: number
    refillTime: Date
    kilometerBeforeRefill: number
    kilometerAfterRefill: number
    totalMoney: string
    fuelPriceCalculated: number
    isPaid: boolean
}

export type FuelRefill = {
    fuelRefillData: FuelRefillDatum[]
    showToast: string
    totalRecord: number
    totalPage: number
}

const allStatus = [
    "noStatus",
    "failed",
    "success",
    "updateSuccess",
    "updateFailed",
    "deleteSuccess",
    "deleteFailed",
]

export const load = (async ({ fetch, url }) => {
    try {
        let currentUserId = url.searchParams.get("currentUserId") as string
        let currentCarId = url.searchParams.get("currentCarId") as string
        let pageIndex = '1'
        let pageSize = '10'

        let fuelRefillData: FuelRefillDatum[] = [
            {
                id: 1,
                refillTime: new Date('2023-12-12'),
                kilometerBeforeRefill: 100,
                kilometerAfterRefill: 100,
                totalMoney: '100',
                fuelPriceCalculated: 100,
                isPaid: false,
            },
            {
                id: 2,
                refillTime: new Date('2023-11-11'),
                kilometerBeforeRefill: 200,
                kilometerAfterRefill: 200,
                totalMoney: '200',
                fuelPriceCalculated: 200,
                isPaid: false,
            }
        ]
        let showToast = "noStatus"
        let rawShowToast = url.searchParams.get("showToast")
        if (rawShowToast !== null) {
            if (allStatus.includes(rawShowToast)) {
                showToast = rawShowToast
            }
        }

        let fuelRefill: FuelRefill = {
            fuelRefillData: fuelRefillData,
            showToast: showToast,
            totalPage: 5,
            totalRecord: 2,
        }
        return {
            fuelRefill
        }
    } catch (error) {
        console.error("error: ", error)
        throw error
    }
}) satisfies PageLoad;