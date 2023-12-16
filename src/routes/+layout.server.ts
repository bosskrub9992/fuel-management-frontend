import type { LayoutServerLoad } from './$types';
import { PUBLIC_BASE_URL, PUBLIC_GET_USERS_ENDPOINT } from '$env/static/public'

export const load = (async ({ fetch }) => {
    try {
        let url = PUBLIC_BASE_URL + PUBLIC_GET_USERS_ENDPOINT
        console.log("url: ", url)
        const res = await fetch(url)
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
