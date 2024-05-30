import type { LayoutServerLoad } from './$types'
import { PUBLIC_BASE_URL, PUBLIC_USERS_ENDPOINT } from '$env/static/public'

interface GetUserData {
    data: GetUserDatum[]
}

export interface GetUserDatum {
    id: number
    defaultCarId: number
    nickname: string
    profileImageUrl: string
}

export const load = (async ({ fetch }) => {
    try {
        let getUsersUrl = PUBLIC_BASE_URL + PUBLIC_USERS_ENDPOINT
        console.info(`GET ${getUsersUrl}`)

        const res = await fetch(getUsersUrl)
        if (!res.ok) {
            const { code, message, data } = await res.json()
            throw new Error(`code: ${code}, message: ${message}, data: ${data}`)
        }

        const item = await res.json() as GetUserData
        return item
    } catch (error) {
        console.error("error: ", error)
        throw error
    }
}) satisfies LayoutServerLoad
