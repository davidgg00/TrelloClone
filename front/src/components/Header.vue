<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';


const router = useRouter();
const userStore = useUserStore();
const userName = userStore.getUserName;


const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
    <header class="w-full h-16 bg-white shadow-md">
        <div class="flex items-center justify-between h-full px-4">
            <div
                class="flex items-center cursor-pointer text-gray-800 hover:text-gray-600 transition duration-200 ease-in-out">
                <span class="text-2xl font-bold mr-16">Boards</span>
            </div>

            <img src="../assets/Trello-logo.webp" alt="TrelloHub Logo" class="w-28 h-auto" />

            <div class="flex items-center">
                <span class="text-gray-800 text-lg font-semibold mr-3">Hello, {{ userName }}!</span>
                <button class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors
                        duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="logOut">
                    Log out
                </button>
            </div>
        </div>
    </header>

</template>