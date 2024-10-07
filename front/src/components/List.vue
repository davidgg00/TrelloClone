<script setup lang="ts">
import { defineProps } from 'vue';
import { List } from '../interfaces/List';

const props = defineProps<{
    list: List;
    listIndex: number;
    hoveredTask: { listIndex: number, taskIndex: number } | null;
    onDragStart: (listIndex: number, taskIndex: number) => void;
    onListDragStart: (listIndex: number) => void;
    onDragOver: (listIndex: number, taskIndex?: number) => void;
    onDrop: (listIndex: number, taskIndex?: number) => void;
    onListDrop: (listIndex: number) => void;
    onDragEnd: () => void;
}>();
</script>

<template>
    <div class="bg-gray-100 p-4 rounded-lg shadow-md list flex flex-col" @dragover.prevent="onDragOver(listIndex)"
        @drop="onListDrop(listIndex)" :class="{ 'hovered': hoveredTask && hoveredTask.listIndex === listIndex }">

        <h2 class="text-xl font-bold mb-4
        border-b-2 border-gray-200 pb-2 cursor-pointer
        " @dragstart="onListDragStart(listIndex)" draggable="true" @dragover.prevent="onDragOver(listIndex, 0)"
            @drop="onDrop(listIndex, 0)">
            {{ list.title }}
        </h2>

        <div v-if="!list.tasks || !list.tasks.length" class="empty-list-drop-area flex-grow"
            @dragover.prevent="onDragOver(listIndex)" @drop="onDrop(listIndex, -1)">
            <p class="text-gray-500">Drag tasks here</p>
        </div>

        <div v-else class="flex-grow flex flex-col">
            <div v-for="(task, taskIndex) in list.tasks" :key="task.id" class="task-container"
                @dragover.prevent="onDragOver(listIndex, taskIndex)" @drop="onDrop(listIndex, taskIndex)">
                <div class="task" draggable="true" @dragstart="onDragStart(listIndex, taskIndex)" @dragend="onDragEnd">
                    {{ task.title }}
                </div>

                <div v-if="hoveredTask && hoveredTask.listIndex === listIndex && hoveredTask.taskIndex === taskIndex"
                    class="drop-line"></div>
            </div>

            <div class="final-drop-area" @dragover.prevent="onDragOver(listIndex, list.tasks.length)"
                @drop="onDrop(listIndex, list.tasks.length)">
            </div>
        </div>
    </div>
</template>

<style scoped>
.list.hovered h2 {
    background-color: #e0f7fa;
}

.list {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 300px;
}

.list.hovered {
    background-color: #e0f7fa;
}

.task-container {
    position: relative;
    margin-bottom: 10px;
}

.task {
    padding: 10px;
    background-color: white;
    border: 1px solid #ddd;
    cursor: move;
}

.drop-line {
    height: 3px;
    background-color: #007bff;
    position: absolute;
    width: 100%;
}

.final-drop-area {
    margin-top: -10px;
    padding: 10px;
    text-align: center;
    color: #888;
    background-color: #f9f9f9;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
