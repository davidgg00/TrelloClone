<script setup lang="ts">
import { ref } from 'vue';
import { register } from '../api/auth.api';
import { useRouter } from 'vue-router';
import { toast, type ToastOptions } from 'vue3-toastify';

const router = useRouter();

const email = ref<string>('');
const password = ref<string>('');
const name = ref<string>('');

const handleLogin = async () => {
    try {
        const status = await register({
            name: name.value,
            email: email.value,
            password: password.value
        });

        if (status === 201) {
            router.push('/login')
        }
    } catch (error: any) {
        toast.error(error.message, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
        } as ToastOptions);
    }


};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-cover bg-center"
        style="background-image: url('/path/to/your/image.jpg')">
        <div class="flex flex-col items-center bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 max-w-xl w-full">

            <img src="../assets/Trello-logo.webp" alt="TrelloHub Logo" class="mb-8 w-48 h-auto" />

            <h2 class="text-4xl font-bold text-center mb-8 text-gray-800">Register</h2>

            <form @submit.prevent="handleLogin" class="w-full">

                <div class="mb-6">
                    <label for="name" class="block text-lg font-medium text-gray-700">Name</label>
                    <input type="text" id="name" v-model="name" required
                        class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="name@example.com" />
                </div>

                <div class="mb-6">
                    <label for="email" class="block text-lg font-medium text-gray-700">Email address</label>
                    <input type="email" id="email" v-model="email" required
                        class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="name@example.com" />
                </div>

                <div class="mb-8">
                    <label for="password" class="block text-lg font-medium text-gray-700">Password</label>
                    <input type="password" id="password" v-model="password" required
                        class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="••••••••" />
                </div>

                <div class="mb-6">
                    <button type="submit"
                        class="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Register
                    </button>
                </div>
            </form>

            <p class="text-center text-lg text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-blue-600 hover:underline">Log In</router-link>
            </p>
        </div>
    </div>
</template>

<style></style>