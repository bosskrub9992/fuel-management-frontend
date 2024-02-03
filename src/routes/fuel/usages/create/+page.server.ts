import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import {
    PUBLIC_BASE_URL,
    PUBLIC_GET_LATEST_FUEL_INFO_ENDPOINT,
    PUBLIC_FUEL_USAGES_ENDPOINT,
} from '$env/static/public'

type GetLatestFuelInfoResponse = {
    latestFuelPrice: string
    latestKilometerAfterUse: number
}

export const load = (async ({ fetch, url }) => {
    try {
        const currentCarId = url.searchParams.get("currentCarId") as string

        const query = new URLSearchParams({ carId: currentCarId })
        const queryParam = "?" + query.toString()
        const urlGetLatestFuelInfo = PUBLIC_BASE_URL + PUBLIC_GET_LATEST_FUEL_INFO_ENDPOINT + queryParam
        console.info(`GET ${urlGetLatestFuelInfo}`)

        const response = await fetch(urlGetLatestFuelInfo)
        if (!response.ok) {
            const { code, message, data } = await response.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        const { latestFuelPrice, latestKilometerAfterUse } = await response.json() as GetLatestFuelInfoResponse

        return {
            latestFuelPrice,
            latestKilometerAfterUse
        }
    } catch (error) {
        console.error("error: ", error)
        throw error
    }
}) satisfies PageServerLoad

type CreateFuelUsageRequest = {
    currentCarId: number
    fuelUseTime: string // RFC3339 / ISO8601
    fuelPrice: number
    fuelUsers: FuelUser[]
    description: string
    kilometerBeforeUse: number
    kilometerAfterUse: number
}

type FuelUser = {
    userId: number
    isPaid: boolean
}

export const actions = {
    createFuelUsage: async ({ request, fetch }) => {
        const data = await request.formData()
        const rawFuelUseTime = data.get('fuelUseTime') as string // format 2006-01-02T15:04
        const fuelPrice = Number(data.get('fuelPrice'))
        const description = data.get('description') as string
        const kilometerBeforeUse = Number(data.get('kilometerBeforeUse'))
        const kilometerAfterUse = Number(data.get('kilometerAfterUse'))
        const rawFuelUserIds = data.getAll('fuelUserId') as string[]
        const rawPaidFuelUserIds = data.getAll('paidFuelUserId') as string[]
        const currentCarId = Number(data.get('currentCarId'))
        const currentUserId = Number(data.get('currentUserId'))

        const paidUserIds = new Map<number, boolean>()
        for (const rawPaidFuelUserId of rawPaidFuelUserIds) {
            paidUserIds.set(Number(rawPaidFuelUserId), true)
        }

        const fuelUsers: FuelUser[] = []
        for (const rawFuelUserId of rawFuelUserIds) {
            const userId = Number(rawFuelUserId)
            let isPaid: boolean = false
            if (paidUserIds.has(userId)) {
                isPaid = true
            }
            fuelUsers.push({
                userId: userId,
                isPaid: isPaid,
            })
        }

        const createFuelUsageRequest: CreateFuelUsageRequest = {
            currentCarId: currentCarId,
            fuelUseTime: rawFuelUseTime + ":00+07:00",
            fuelPrice: fuelPrice,
            fuelUsers: fuelUsers,
            description: description,
            kilometerBeforeUse: kilometerBeforeUse,
            kilometerAfterUse: kilometerAfterUse,
        }

        let redirectUrl = `/fuel/usages?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=success`

        try {
            const urlCreateFuelUsages = PUBLIC_BASE_URL + PUBLIC_FUEL_USAGES_ENDPOINT
            console.info(`POST ${urlCreateFuelUsages}, request body: ${createFuelUsageRequest}`)

            const response = await fetch(urlCreateFuelUsages, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createFuelUsageRequest)
            })

            if (!response.ok) {
                const { code, message, data } = await response.json()
                throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
            }

        } catch (error) {
            console.error("error: ", error)
            redirectUrl = `/fuel/usages?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=failed`
        }

        redirect(303, redirectUrl)
    },
} satisfies Actions