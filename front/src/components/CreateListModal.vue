<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'


const props = defineProps<{
    titleForm?: string,
    initialValues?: { title: string }
}>()

const title = ref(props.initialValues?.title || '')

const emit = defineEmits(['submit'])

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    emit('submit', { title: title.value });
    return;
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

            <button type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Submit
            </button>
        </form>

    </VueFinalModal>
</template>
