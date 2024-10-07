<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { getBoards } from '../api/board.api';
import { Board } from '../interfaces/Board';
import { ModalsContainer, useModal } from 'vue-final-modal'
import CreateBoardModal from '../components/CreateBoardModal.vue';
import Header from '../components/Header.vue';
import BoardList from '../components/BoardList.vue';

const boards = ref<Board[]>([]);

const { open, close } = useModal({
    component: CreateBoardModal,
    attrs: {
        titleForm: 'Create new board',
        onSubmit: async () => {
            boards.value = await getBoards();
            close();
        }
    },
});

onBeforeMount(async () => {
    boards.value = await getBoards();
});
</script>

<template>

    <div class="min-h-screen flex flex-col">
        <ModalsContainer />
        <Header />
        <div class="w-full h-full bg-gray-200 bg-opacity-90 p-4 flex-grow">
            <div class="flex justify-end mb-4">
                <button @click="open"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Create new board
                </button>
            </div>
            <BoardList :boards="boards" />
        </div>
    </div>
</template>

<style scoped></style>
