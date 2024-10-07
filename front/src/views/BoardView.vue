<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import HeaderBoard from '../components/HeaderBoard.vue';
import { getListsAndTasks } from '../api/board.api';
import { useRouter } from 'vue-router';
import { Board } from '../interfaces/Board';
import List from '../components/List.vue';

const router = useRouter();
const board = ref<Board | null>(null);

let draggedTask: { listIndex: number; taskIndex: number } | null = null;
let draggedListIndex: number | null = null;
const hoveredTask = ref<{ listIndex: number; taskIndex: number } | null>(null);

onBeforeMount(async () => {
    const boardId: number = parseInt(router.currentRoute.value.params.id as string, 10);
    board.value = await getListsAndTasks(boardId);
});

const createNewList = () => {
    if (board.value) {
        const newList = {
            id: Date.now(),
            title: 'Nueva Lista',
            boardId: board.value?.id ?? 0,
            tasks: [],
        };
        if (board.value.lists) {
            board.value.lists.push(newList);
        }
    }
};

const onDragStart = (listIndex: number, taskIndex: number) => {
    draggedTask = { listIndex, taskIndex };
};

const onListDragStart = (listIndex: number) => {
    console.log('onListDragStart', listIndex);
    draggedListIndex = listIndex;
};

const onDragOver = (listIndex: number, taskIndex?: number) => {
    if (taskIndex !== undefined) {
        hoveredTask.value = { listIndex, taskIndex };
    } else {
        hoveredTask.value = { listIndex, taskIndex: -1 };
    }
};

const onDrop = (targetListIndex: number, targetTaskIndex?: number) => {
    if (draggedTask && board.value?.lists) {
        const { listIndex: sourceListIndex, taskIndex: sourceTaskIndex } = draggedTask;
        const sourceList = board.value.lists[sourceListIndex];
        if (sourceList?.tasks) {
            const task = sourceList.tasks.splice(sourceTaskIndex, 1)[0];
            if (task) {
                const targetList = board.value.lists[targetListIndex];
                if (targetList?.tasks) {
                    if (targetTaskIndex === undefined || targetTaskIndex === -1) {
                        targetList.tasks.push(task);
                    } else {
                        targetList.tasks.splice(targetTaskIndex, 0, task);
                    }
                }
            }
        }
        draggedTask = null;
    }
    hoveredTask.value = null;
};

const onListDrop = (targetListIndex: number) => {
    if (draggedListIndex !== null && board.value?.lists) {
        const movedList = board.value.lists.splice(draggedListIndex, 1)[0];
        if (movedList) {
            board.value.lists.splice(targetListIndex, 0, movedList);
        }
        draggedListIndex = null;
    }
};

const onDragEnd = () => {
    hoveredTask.value = null;
    draggedListIndex = null;
};
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <HeaderBoard />
        <div class="w-full flex-grow flex flex-col h-0">
            <div class="flex justify-start mb-8 p-8">
                <h3 class="text-4xl font-semibold text-gray-800 tracking-tight text-white">
                    {{ board?.title }}
                </h3>
            </div>
            <div v-if="board?.lists" class="flex gap-6 overflow-x-auto flex-grow custom-scrollbar p-8">
                <List v-for="(list, listIndex) in board.lists" :key="list.id" :list="list" :listIndex="listIndex"
                    @drag-start="onDragStart" @list-drag-start="onListDragStart" @drag-over="onDragOver"
                    @drop="onDrop(listIndex)" @list-drop="onListDrop(listIndex)" @drag-end="onDragEnd"
                    :hovered-task="hoveredTask" draggable="true" class="bg-white p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-xl transition-shadow
                    duration-300 flex-shrink-0 w-96 flex flex-col h-full" />
            </div>

            <div class="flex justify-center items-center p-8">
                <button @click="createNewList"
                    class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
                    + Create new list
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
div.flex {
    overflow-x: auto;
    white-space: nowrap;
    height: 100%;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #444444 #2b2b2b;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #444444;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background-color: #2b2b2b;
}
</style>
