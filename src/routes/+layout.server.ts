import type { LayoutServerLoad } from './$types';
import { BASE_URL, GET_USERS_ENDPOINT } from '$env/static/private'

export const load = (async ({ fetch }) => {
    try {
        const res = await fetch(BASE_URL + GET_USERS_ENDPOINT)
        const item = await res.json() as Promise<GetUserData>
        return item
    } catch (error) {
        console.log("error: ", error)
    }
}) satisfies LayoutServerLoad;

interface GetUserData {
    data: GetUserDatum[]
}

export interface GetUserDatum {
    id: number
    defaultCarId: number
    nickname: string
    profileImageUrl: string
}
