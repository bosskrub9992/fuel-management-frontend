import {
    PUBLIC_BASE_URL,
    PUBLIC_USERS_ENDPOINT,
} from '$env/static/public'

export type getUserFuelUsagesResponse = {
    userFuelUsages: userFuelUsage[]
}

export type userFuelUsage = {
    car: {
        id: number
        name: string
    }
    fuelUsages: {
        fuelUsageId: number
        fuelUsageUserId: number
        fuelUseTime: string
        payEach: string
        description: string
        fuelUsers: string
    }[]
}

export async function getUserUnpaidFuelUsages(userId: number) {
    let urlGetUserUnpaidFuelUsages = `${PUBLIC_BASE_URL}${PUBLIC_USERS_ENDPOINT}/${userId}/fuel-usages?isPaid=false`

    console.log(`GET ${urlGetUserUnpaidFuelUsages}`)

    const res = await fetch(urlGetUserUnpaidFuelUsages)
    if (res.ok) {
        const userUnpaidFuelUsages = (await res.json()) as getUserFuelUsagesResponse
        return userUnpaidFuelUsages
    } else {
        const { code, message, data } = await res.json()
        throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
    }
}

export type patchUserFuelUsagesPaymentStatusRequest = {
    userFuelUsages: fuelUsageUser[]
}

export type fuelUsageUser = {
    id: number
    isPaid: boolean
}

export async function patchUserFuelUsagesPaymentStatus(userId: number, request: patchUserFuelUsagesPaymentStatusRequest) {
    let urlPatchUserFuelUsagesPaymentStatus = `${PUBLIC_BASE_URL}${PUBLIC_USERS_ENDPOINT}/${userId}/fuel-usages/payment-status`

    console.log(`PATCH ${urlPatchUserFuelUsagesPaymentStatus}`)

    const res = await fetch(urlPatchUserFuelUsagesPaymentStatus, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })
    if (!res.ok) {
        const { code, message, data } = await res.json()
        throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
    }
}