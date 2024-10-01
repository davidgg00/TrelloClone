<script setup lang="ts">
import { defineProps } from 'vue';
import Project from './Project.vue';
import { Board } from '../interfaces/Board';

const props = defineProps<{
    boards: Board[];
}>();
</script>

<template>
    <div class="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Project v-for="board in props.boards" :key="board.id" :board="board" />
    </div>
</template>
