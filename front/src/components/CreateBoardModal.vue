<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { createBoard } from '../api/board.api';
import { toast, type ToastOptions } from 'vue3-toastify';

const title = ref('')
const isPublic = ref(false)

defineProps<{
    titleForm?: string
}>()

const emit = defineEmits(['submit'])

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
        const resp = await createBoard({ title: title.value, is_public: isPublic.value });
        if (resp.id) {
            toast.success('Board created successfully', { duration: 3000 } as ToastOptions);
            emit('submit');
        }
    } catch (error) {
        console.error('Failed to submit form:', error);
    }
}
</script>

<template>
    <VueFinalModal class="flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-6 shadow-lg"
        content-transition="vfm-slide-down">

        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-300">{{ titleForm || 'Form' }}</h1>

        <form @submit="handleSubmit" class="flex flex-col space-y-4 w-full">
            <div>
                <label for="title"
                    class="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" id="title" v-model="title"
                    class="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    placeholder="Enter title" required />
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="isPublic" v-model="isPublic"
                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500" />
                <label for="isPublic" class="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-300">Is
                    Public</label>
            </div>

            <button type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Submit
            </button>
        </form>

    </VueFinalModal>
</template>
