<script setup lang="ts">
import { onMounted, ref } from 'vue';

const title = ref('');

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    inputRef.value?.focus();
});
</script>

<template>
    <input type="text" v-model="title" @keydown.enter="$emit('save', title)" @keydown.esc="$emit('cancel')"
        placeholder="New task title" ref="inputRef"
        class="task-input border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<style scoped></style>
