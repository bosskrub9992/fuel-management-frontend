import {
    PUBLIC_BASE_URL,
    PUBLIC_USERS_ENDPOINT,
    PUBLIC_GET_USER_CAR_ACTIVITY_ENDPOINT
} from '$env/static/public'
import { tryit } from "radash";

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

    console.log(`PATCH ${urlPatchUserFuelUsagesPaymentStatus}, request body: ${JSON.stringify(request)}`)

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

export type getUserUnpaidCarActivityResult = {
    userUnpaidCarActivity: getUserUnpaidCarActivityResponse
    selectedUnpaidFuelUsageUserIds: number[]
    selectedUnpaidFuelRefillIds: number[]
    totalMoneySelectedUnpaidFuelUsage: number
    totalMoneySelectedUnpaidFuelRefill: number
}

export type getUserUnpaidCarActivityResponse = {
    fuelUsages: {
        fuelUsageId: number
        fuelUsageUserId: number
        fuelUseTime: string
        payEach: string
        description: string
        fuelUsers: string
    }[]
    fuelRefills: {
        fuelRefillId: number
        isPaid: boolean
        refillTime: string
        totalMoney: string
    }[]
}

export async function getUserUnpaidCarActivity(userId: number, carId: number): Promise<[Error | undefined, getUserUnpaidCarActivityResult | undefined]> {
    let urlGetUserUnpaidCarActivity = `${PUBLIC_BASE_URL}${PUBLIC_GET_USER_CAR_ACTIVITY_ENDPOINT}`

    urlGetUserUnpaidCarActivity = urlGetUserUnpaidCarActivity.replace(":userId", userId.toString())
    urlGetUserUnpaidCarActivity = urlGetUserUnpaidCarActivity.replace(":carId", carId.toString())

    console.log(`GET ${urlGetUserUnpaidCarActivity}`)

    let [err, res] = await tryit(fetch)(urlGetUserUnpaidCarActivity);
    if (err) {
        console.log(`fetch error: ${err}`)
        return [err, undefined]
    }
    if (res == undefined) {
        let err = new Error("fetch urlGetUserUnpaidCarActivity response is undefined or null")
        console.log(err)
        return [err, undefined]
    }

    if (!res.ok) {
        let { code, message, data } = await res.json()
        err = new Error(`!res.ok code: ${code}, message: ${message}, data: ${data}`)
        return [err, undefined]
    }

    let resJson = await res.json() as getUserUnpaidCarActivityResponse

    let userUnpaidCarActivity = resJson
    let selectedUnpaidFuelUsageUserIds: number[] = []
    let selectedUnpaidFuelRefillIds: number[] = []
    let totalMoneySelectedUnpaidFuelUsage = 0
    let totalMoneySelectedUnpaidFuelRefill = 0

    for (const fu of userUnpaidCarActivity.fuelUsages) {
        selectedUnpaidFuelUsageUserIds.push(fu.fuelUsageUserId);
        totalMoneySelectedUnpaidFuelUsage += parseFloat(fu.payEach);
    }

    for (const fr of userUnpaidCarActivity.fuelRefills) {
        selectedUnpaidFuelRefillIds.push(fr.fuelRefillId);
        totalMoneySelectedUnpaidFuelRefill += parseFloat(fr.totalMoney);
    }

    return [undefined, {
        userUnpaidCarActivity: userUnpaidCarActivity,
        selectedUnpaidFuelUsageUserIds: selectedUnpaidFuelUsageUserIds,
        selectedUnpaidFuelRefillIds: selectedUnpaidFuelRefillIds,
        totalMoneySelectedUnpaidFuelUsage: totalMoneySelectedUnpaidFuelUsage,
        totalMoneySelectedUnpaidFuelRefill: totalMoneySelectedUnpaidFuelRefill,
    }]
}

export type patchUserUnpaidCarActivityRequest = {
    fuelUsageUserIds: number[]
    fuelRefillIds: number[]
}

export async function patchUserUnpaidCarActivity(userId: number, carId: number, reqBody: patchUserUnpaidCarActivityRequest): Promise<Error | undefined> {
    let urlPatchUserUnpaidCarActivity = `${PUBLIC_BASE_URL}${PUBLIC_GET_USER_CAR_ACTIVITY_ENDPOINT}`

    urlPatchUserUnpaidCarActivity = urlPatchUserUnpaidCarActivity.replace(":userId", userId.toString())
    urlPatchUserUnpaidCarActivity = urlPatchUserUnpaidCarActivity.replace(":carId", carId.toString())

    console.log(`GET ${urlPatchUserUnpaidCarActivity}`)

    let [err, res] = await tryit(fetch)(urlPatchUserUnpaidCarActivity, {
        method: "PATCH", headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    });
    if (err) {
        console.log(`fetch error: ${err}`)
        return err
    }
    if (res == undefined) {
        let err = new Error("fetch urlPatchUserUnpaidCarActivity response is undefined or null")
        console.log(err)
        return err
    }

    if (!res.ok) {
        let { code, message, data } = await res.json()
        err = new Error(`!res.ok code: ${code}, message: ${message}, data: ${data}`)
        return err
    }

    return undefined
}
