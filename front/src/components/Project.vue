<script setup lang="ts">
import { Board } from '../interfaces/Board';

const { board } = defineProps<{
    board: Board;
}>();

</script>
<template>
    <router-link :to="`/board/${board.id}`">
        <div
            class="mt-4 max-w-sm rounded overflow-hidden shadow-lg bg-white h-80 mx-auto cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl">
            <img class="w-full h-40 object-cover" src="../assets/exampleImageProject.jpg" alt="Project Image">
            <div class="px-4 py-2">
                <div class="font-bold text-xl mb-1">{{ board.title }}</div>
                <p class="text-gray-700 text-sm overflow-hidden h-14">
                    This is a brief description of the project. It provides an overview of what the project is about.
                </p>
            </div>
        </div>
    </router-link>
</template>

<style scoped></style>
