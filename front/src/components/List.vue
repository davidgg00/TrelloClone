<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { List } from '../interfaces/List';
import Task from './Task.vue';
import TaskInput from './TaskInput.vue';
import { useModal } from 'vue-final-modal';
import ConfirmModal from './ConfirmModal.vue';

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
    createNewTask: (listIndex: number, title: string) => void;
}>();

const emit = defineEmits(['listDeleted', 'editList']);

const newTaskTitle = ref<string>('');
const isAddingTask = ref(false);
const isMenuOpen = ref(false);

const addTask = () => {
    isAddingTask.value = true;
    newTaskTitle.value = '';
};

const saveTask = (listIndex: number) => {
    if (!newTaskTitle.value) {
        isAddingTask.value = false;
        return;
    }
    props.createNewTask(listIndex, newTaskTitle.value);
    isAddingTask.value = false;
};

const cancelTask = () => {
    isAddingTask.value = false;
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const deleteListAction = async () => {

    const { open, close } = useModal({
        component: ConfirmModal,
        attrs: {
            message: "Are you sure you want to delete this item?",
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            onConfirm() {
                const listId = props.list.id;
                emit('listDeleted', listId);
                close();
            },
            onCancel() {
                close();
            }
        },
    });

    open();
};

const editList = () => {
    emit('editList', props.list);
    isMenuOpen.value = false;
};
</script>

<template>
    <div class="bg-gray-100 p-4 rounded-lg shadow-md list flex flex-col" @dragover.prevent="onDragOver(listIndex)"
        @drop="onListDrop(listIndex)" :class="{ 'hovered': hoveredTask && hoveredTask.listIndex === listIndex }">

        <div class="flex items-center justify-between mb-4 border-b-2 border-gray-200">
            <h2 class="text-xl font-bold  pb-2 cursor-pointer flex-grow" @dragstart="onListDragStart(listIndex)"
                draggable="true" @dragover.prevent="onDragOver(listIndex, 0)" @drop="onDrop(listIndex, 0)">
                {{ list.title }}
            </h2>
            <div class="relative -mt-2.5">
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none" @click="toggleMenu">
                    ⚙️
                </button>

                <!-- Dropdown Menu -->
                <div v-if="isMenuOpen"
                    class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button @click="editList"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                    </button>
                    <button @click="deleteListAction"
                        class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100">
                        Delete
                    </button>
                </div>
            </div>

        </div>

        <!-- Rest of the list -->
        <div v-if="!list.tasks || !list.tasks.length" class="empty-list-drop-area flex-grow"
            @dragover.prevent="onDragOver(listIndex)" @drop="onDrop(listIndex, -1)">
            <div class="task-container" v-if="isAddingTask">
                <div class="task" draggable="true">
                    <TaskInput @save="saveTask(listIndex)" @cancel="cancelTask" v-model="newTaskTitle" />
                </div>
            </div>
            <p class="text-gray-500" v-else>Drag tasks here</p>
        </div>

        <div v-else class="flex-grow flex flex-col">
            <div v-for="(task, taskIndex) in list.tasks" :key="task.id" class="task-container"
                @dragover.prevent="onDragOver(listIndex, taskIndex)" @drop="onDrop(listIndex, taskIndex)">
                <Task :task="task" :key="task.id" :taskIndex="taskIndex" :listIndex="listIndex" draggable="true"
                    @dragstart="onDragStart(listIndex, taskIndex)" @dragend="onDragEnd" />

                <div v-if="hoveredTask && hoveredTask.listIndex === listIndex && hoveredTask.taskIndex === taskIndex"
                    class="drop-line"></div>
            </div>

            <div class="task-container" v-if="isAddingTask">
                <div class="task" draggable="true">
                    <TaskInput @save="saveTask(listIndex)" @cancel="cancelTask" v-model="newTaskTitle" />
                </div>
            </div>
            <div class="final-drop-area" @dragover.prevent="onDragOver(listIndex, list.tasks.length)"
                @drop="onDrop(listIndex, list.tasks.length)">
            </div>
        </div>

        <div class="add-task-section mt-4">
            <button v-if="!isAddingTask" @click="addTask"
                class="add-task-button bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                + Add Task
            </button>
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

.add-task-button {
    width: 100%;
}

.new-task-input {
    width: 100%;
}
</style>
