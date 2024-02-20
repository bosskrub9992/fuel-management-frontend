import type { PageLoad } from './$types';

export const load = (async ({url}) => {
    let userId = url.searchParams.get("currentUserId")
    return {
        userId
    };
}) satisfies PageLoad;