<script setup lang="ts">
import Project from '../components/Project.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
    <div>
        <header class="w-full h-16 bg-white shadow-md">
            <div class="flex items-center justify-between h-full px-4">
                <div
                    class="flex items-center cursor-pointer text-gray-800 hover:text-gray-600 transition duration-200 ease-in-out">
                    <span class="text-2xl font-bold">Boards</span>
                </div>

                <img src="../assets/Trello-logo.png" alt="TrelloHub Logo" class="w-28 h-auto" />

                <div class="flex items-center">
                    <span class="text-gray-800 text-lg font-semibold">Hello, User!</span>
                    <button
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="logOut">
                        Log out
                    </button>
                </div>
            </div>
        </header>
        <div class="w-full h-full bg-gray-200 bg-opacity-90 p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
            </div>
        </div>

    </div>
</template>

<style scoped></style>
