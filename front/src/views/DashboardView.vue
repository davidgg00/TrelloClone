<script setup lang="ts">
import Project from '../components/Project.vue';
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { getBoards } from '../api/board.api';
import { Board } from '../interfaces/Board';
import { useUserStore } from '../stores/user'

const router = useRouter();
const userStore = useUserStore();

const userName = userStore.getUserName;
const boards = ref<Board[]>();

const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

onBeforeMount(async () => {
    try {
        boards.value = await getBoards();
    } catch (error) {
        console.error('Failed to fetch boards:', error);
    }
});
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="w-full h-16 bg-white shadow-md">
            <div class="flex items-center justify-between h-full px-4">
                <div
                    class="flex items-center cursor-pointer text-gray-800 hover:text-gray-600 transition duration-200 ease-in-out">
                    <span class="text-2xl font-bold mr-16">Boards</span>
                </div>

                <img src="../assets/Trello-logo.png" alt="TrelloHub Logo" class="w-28 h-auto" />

                <div class="flex items-center">
                    <span class="text-gray-800 text-lg font-semibold mr-3">Hello, {{ userName }}!</span>
                    <button
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="logOut">
                        Log out
                    </button>
                </div>
            </div>
        </header>
        <div class="w-full h-full bg-gray-200 bg-opacity-90 p-4 flex-grow">
            <div class="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Project v-for="board in boards" :key="board.id" :board="board" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
