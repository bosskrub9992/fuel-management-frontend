import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import {
    PUBLIC_BASE_URL,
    PUBLIC_FUEL_USAGES_ENDPOINT,
} from '$env/static/public'

type GetFuelUsageByIDResponse = {
    fuelUseTime: string
    fuelPrice: string
    fuelUsers: GetFuelUser[]
    description: string
    kilometerBeforeUse: number
    kilometerAfterUse: number
    totalMoney: string
    eachShouldPay: string
}

type GetFuelUser = {
    userId: number
    nickname: string
    isPaid: boolean
}

export const load = (async ({ fetch, params }) => {
    try {
        let fuelUsageId = Number(params.fuelUsageId)

        let urlGetFuelUsageById = PUBLIC_BASE_URL + PUBLIC_FUEL_USAGES_ENDPOINT + `/${fuelUsageId}`
        console.info(`GET ${urlGetFuelUsageById}`)

        let response = await fetch(urlGetFuelUsageById)
        if (!response.ok) {
            const { code, message, data } = await response.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        const getFuelUsageByIdResponse = await response.json() as GetFuelUsageByIDResponse

        return {
            getFuelUsageByIdResponse,
            fuelUsageId
        }
    } catch (error) {
        console.error("error: ", error)
        throw error
    }
}) satisfies PageServerLoad

type PutFuelUsageRequest = {
    currentCarId: number
    fuelUseTime: string // RFC3339 / ISO8601
    fuelPrice: string
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
    updateFuelUsage: async ({ request, fetch }) => {
        const data = await request.formData()
        const fuelUsageId = Number(data.get('fuelUsageId'))
        const currentCarId = Number(data.get('currentCarId'))
        const currentUserId = Number(data.get('currentUserId'))
        const rawFuelUseTime = data.get('fuelUseTime') as string // format 2006-01-02T15:04
        const fuelPrice = data.get('fuelPrice') as string
        const description = data.get('description') as string
        const kilometerBeforeUse = Number(data.get('kilometerBeforeUse'))
        const kilometerAfterUse = Number(data.get('kilometerAfterUse'))
        const rawFuelUserIds = data.getAll('fuelUserId') as string[]
        const rawPaidFuelUserIds = data.getAll('paidFuelUserId') as string[]

        let paidUserIds = new Map<number, boolean>()
        for (const rawPaidFuelUserId of rawPaidFuelUserIds) {
            paidUserIds.set(Number(rawPaidFuelUserId), true)
        }

        let fuelUsers: FuelUser[] = []
        for (const rawFuelUserId of rawFuelUserIds) {
            let userId = Number(rawFuelUserId)
            let isPaid = false
            if (paidUserIds.has(userId)) {
                isPaid = true
            }
            fuelUsers.push({
                userId: userId,
                isPaid: isPaid,
            })
        }

        const temp = new Date(rawFuelUseTime)
        const fuelUseTime = temp.toISOString()

        let putFuelUsageRequest: PutFuelUsageRequest = {
            currentCarId: currentCarId,
            fuelUseTime: fuelUseTime,
            fuelPrice: fuelPrice,
            fuelUsers: fuelUsers,
            description: description,
            kilometerBeforeUse: kilometerBeforeUse,
            kilometerAfterUse: kilometerAfterUse,
        }

        let showToast = "updateSuccess"

        try {
            let urlPutFuelUsageById = PUBLIC_BASE_URL + PUBLIC_FUEL_USAGES_ENDPOINT + `/${fuelUsageId}`
            console.info(`PUT ${urlPutFuelUsageById}, request body: ${putFuelUsageRequest}`)

            let response = await fetch(urlPutFuelUsageById, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putFuelUsageRequest)
            })
            if (!response.ok) {
                const { code, message, data } = await response.json()
                console.error(Error(`code: ${code}, message: ${message}, data: ${data}`))
                showToast = "updateFailed"
            }

        } catch (error) {
            console.error("error: ", error)
            showToast = "updateFailed"
        }

        let redirectUrl = `/fuel/usages?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=${showToast}`
        redirect(303, redirectUrl)
    },
    deleteFuelUsage: async ({ request, fetch }) => {
        const data = await request.formData()
        const fuelUsageId = Number(data.get('fuelUsageId'))
        const currentCarId = Number(data.get('currentCarId'))
        const currentUserId = Number(data.get('currentUserId'))

        let showToast = "deleteSuccess"

        try {
            let urlDeleteFuelUsage = PUBLIC_BASE_URL + PUBLIC_FUEL_USAGES_ENDPOINT + `/${fuelUsageId}`
            console.info(`DELETE ${urlDeleteFuelUsage}`)

            let response = await fetch(urlDeleteFuelUsage, {
                method: 'DELETE',
            })
            if (!response.ok) {
                const { code, message, data } = await response.json()
                console.error(`code: ${code}, message: ${message}, data: ${data}`)
                showToast = "deleteFailed"
            }
        } catch (error) {
            console.error("error: ", error)
            showToast = "deleteFailed"
        }

        let redirectUrl = `/fuel/usages?currentUserId=${currentUserId}&currentCarId=${currentCarId}&pageIndex=1&pageSize=8&showToast=${showToast}`
        redirect(303, redirectUrl)
    },
} satisfies Actions