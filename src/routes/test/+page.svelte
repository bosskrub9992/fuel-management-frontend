<script lang="ts">
    let timeRaw: string

</script>

<div class="w-56">
    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
    <input type="datetime-local" step="1" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" bind:value={timeRaw} required>
</div>

{timeRaw}