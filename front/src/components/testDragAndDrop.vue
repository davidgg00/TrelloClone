<template>
    <div class="container">
        <div v-for="(list, listIndex) in lists" :key="list.id"
            :class="['list', { 'hovered': hoveredTask && hoveredTask.listIndex === listIndex }]"
            @dragover.prevent="onDragOver(listIndex)" @drop="onDrop(listIndex)">

            <div class="prueba" draggable="true" @dragstart="onListDragStart(listIndex)" @dragover.prevent
                @drop="onListDrop(listIndex)">
                <h3>{{ list.title }}</h3>
            </div>
            <div v-for="(task, taskIndex) in list.tasks" :key="task.id" class="task-container"
                @dragover.prevent="onDragOver(listIndex, taskIndex)" @drop="onDrop(listIndex, taskIndex)">

                <div class="task" draggable="true" @dragstart="onDragStart(listIndex, taskIndex)" @dragend="onDragEnd">
                    {{ task.title }}
                </div>


                <div v-if="hoveredTask && hoveredTask.listIndex === listIndex && hoveredTask.taskIndex === taskIndex"
                    class="drop-line" :style="{ top: '100%' }"></div>
            </div>

            <div v-if="hoveredTask && hoveredTask.listIndex === listIndex && hoveredTask.taskIndex === list.tasks.length"
                class="drop-line bottom"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Task {
    id: number
    title: string
}

interface List {
    id: number
    title: string
    tasks: Task[]
}

const lists = ref<List[]>([
    {
        id: 1, title: 'To Do', tasks: [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' },
            { id: 3, title: 'Task 3' }
        ]
    },
    {
        id: 2, title: 'In Progress', tasks: [
            { id: 4, title: 'Task 4' },
            { id: 5, title: 'Task 5' },
            { id: 6, title: 'Task 6' }
        ]
    }
])

let draggedTask: { listIndex: number, taskIndex: number } | null = null
let draggedListIndex: number | null = null
const hoveredTask = ref<{ listIndex: number, taskIndex: number } | null>(null)

const onDragStart = (listIndex: number, taskIndex: number) => {
    draggedTask = { listIndex, taskIndex }
}

const onListDragStart = (listIndex: number) => {
    draggedListIndex = listIndex
}

const onDragOver = (listIndex: number, taskIndex?: number) => {
    if (taskIndex != undefined) {
        hoveredTask.value = { listIndex, taskIndex }
    }
}

const onDrop = (targetListIndex: number, targetTaskIndex?: number) => {
    if (draggedTask) {
        const { listIndex: sourceListIndex, taskIndex: sourceTaskIndex } = draggedTask
        const task = lists.value[sourceListIndex].tasks.splice(sourceTaskIndex, 1)[0]

        if (targetTaskIndex === undefined || targetTaskIndex === -1) {
            lists.value[targetListIndex].tasks.push(task)
        } else {
            lists.value[targetListIndex].tasks.splice(targetTaskIndex, 0, task)
        }

        draggedTask = null
    }
    hoveredTask.value = null
}

const onListDrop = (targetListIndex: number) => {
    if (draggedListIndex !== null && draggedListIndex !== targetListIndex) {
        const movedList = lists.value.splice(draggedListIndex, 1)[0]
        lists.value.splice(targetListIndex, 0, movedList)
        draggedListIndex = null
    }
}

const onDragEnd = () => {
    hoveredTask.value = null
    draggedListIndex = null
}
</script>

<style>
.container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;
}

.list {
    width: 45%;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #f4f4f4;
    border-radius: 5px;
    position: relative;
}

.list h3 {
    margin-top: 0;
}

.task-container {
    position: relative;
}

.task {
    margin: 50px 0;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    cursor: move;
    user-select: none;
}

.task:active {
    cursor: grabbing;
}

.drop-line {
    height: 3px;
    background-color: #007bff;
    position: absolute;
    width: 100%;
}

.drop-line.bottom {
    bottom: 0;
}

.task-container:last-child .drop-line {
    bottom: -3px;
}

.list.hovered {
    background-color: #e0f7fa;
}

.prueba {
    border: 1px solid black;
}
</style>
