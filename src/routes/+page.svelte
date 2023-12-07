<script lang="ts">
	import type { GetUserDatum } from './+layout.server';

	export let data;

	let users: GetUserDatum[];
	if (data.data) {
		users = data.data
	}
</script>

<div
	class="h-screen bg-gray-900 text-white text-center py-10 flex flex-col justify-center items-center">
	<h1 class="text-3xl font-bold mb-6">Who's Using?</h1>
	<div class="md:columns-2 md:gap-52 lg:columns-4">
		{#each users as user}
			<a
				href="/fuel/usages?currentUserId={user.id}&currentCarId={user.defaultCarId}&pageIndex=1&pageSize=20"
				class="m-4">
				<img
					src={user.profileImageUrl}
					alt="Profile 1"
					class="w-24 h-24 mx-auto rounded-full mb-4" />
				<h2 class="text-xl font-bold mb-2">{user.nickname}</h2>
			</a>
		{/each}
	</div>
</div>
  