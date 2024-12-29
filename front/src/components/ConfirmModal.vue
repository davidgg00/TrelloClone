<template>
    <VueFinalModal class="flex justify-center items-center"
        content-class="flex flex-col max-w-sm mx-4 p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-6 shadow-lg"
        content-transition="vfm-slide-down">

        <p class="text-lg text-gray-700 dark:text-gray-300">{{ message }}</p>

        <div class="flex space-x-4 justify-end">
            <button @click="handleCancel"
                class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                {{ cancelText || 'Cancel' }}
            </button>
            <button @click="handleConfirm"
                class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {{ confirmText || 'Confirm' }}
            </button>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

defineProps<{
    message: string;
    confirmText?: string;
    cancelText?: string;
}>();

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
    emit('confirm');
};

const handleCancel = () => {
    emit('cancel');
};
</script>
