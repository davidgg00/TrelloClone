<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeaderBoard from '../components/HeaderBoard.vue';
import { getListsAndTasks } from '../api/board.api';
import { useRouter } from 'vue-router';
import { Board } from '../interfaces/Board';
import List from '../components/List.vue';
import { useSocket } from '../composables/useSocket';
import { useDragDrop } from '../composables/useDragAndDrop';
import { ModalsContainer, useModal } from 'vue-final-modal'
import CreateListModal from '../components/CreateListModal.vue';

const router = useRouter();
const board = ref<Board | null>(null);

const { socket, clientId, connect } = useSocket();

const { onDragStart, onListDragStart, onDragOver, onDrop, onListDrop, onDragEnd, hoveredTask } = useDragDrop(board, socket, clientId);

onMounted(async () => {
    const boardId: number = parseInt(router.currentRoute.value.params.id as string, 10);
    try {
        board.value = await getListsAndTasks(boardId);
    } catch (error) {
        console.error(error);
        router.push('/');
    }
    connect(import.meta.env.VITE_SOCKET_URL, boardId.toString());

    socket.value?.on('listMoved', (data) => {
        if (data.clientId === clientId.value) {
            return;
        }

        if (!board.value || !board.value.lists) {
            return;
        }

        const movedListIndex = board.value.lists.findIndex(list => list.id === data.movedList.id);
        const targetListIndex = board.value.lists.findIndex(list => list.id === data.targetList.id);

        if (movedListIndex !== -1 && targetListIndex !== -1) {
            board.value.lists.splice(movedListIndex, 1);
            board.value.lists.splice(targetListIndex, 0, data.movedList);

            // Update the position of the lists
            board.value.lists.forEach((list, index) => {
                list.position = index + 1;
            });
        } else {
            console.error('Source and target lists not found');
        }
    });

    socket.value?.on('taskMoved', (data) => {
        if (data.clientId === clientId.value) {
            return;
        }

        if (!board.value || !board.value.lists) {
            return;
        }

        const sourceList = board.value.lists.find(list => list.id === data.sourceList.id);
        const targetList = board.value.lists.find(list => list.id === data.targetList.id);

        if (sourceList && targetList && sourceList.tasks && targetList.tasks) {
            targetList.tasks.push(data.task);

            const taskIndex = sourceList.tasks.findIndex(task => task.id === data.task.id);
            if (taskIndex !== -1) {
                sourceList.tasks.splice(taskIndex, 1);
            }
        } else {
            console.error('Source and target lists not found');
        }
    });


    socket.value?.on('listCreated', (data) => {
        data.tasks = [];
        if (board.value && board.value.lists) {
            board.value.lists.push(data);
        }
    });

    socket.value?.on('listDeleted', (data) => {
        if (!board.value || !board.value.lists) {
            return;
        }
        const listIndex = board.value.lists.findIndex(list => list.id === data);
        if (listIndex !== -1) {
            board.value.lists.splice(listIndex, 1);
        }
    });

    socket.value?.on('taskCreated', (data) => {
        if (!board.value || !board.value.lists) {
            return;
        }
        const listIndex = board.value?.lists.findIndex(list => list.id === data.list.id);
        if (listIndex !== -1) {
            if (board.value && board.value.lists && board.value.lists[listIndex].tasks) {
                board.value.lists[listIndex].tasks.push(data);
            }
        } else {
            console.error('List not found');
        }
    });

    socket.value?.on('listUpdated', (data) => {
        if (!board.value || !board.value.lists) {
            return;
        }
        const listIndex = board.value.lists.findIndex(list => list.id === data.listId);
        if (listIndex !== -1) {
            board.value.lists[listIndex].title = data.title;
        }
    });
});

const createNewTask = (listIndex: number, title: string) => {
    if (!board.value?.lists) {
        return;
    }

    socket.value?.emit('createTask', {
        title,
        listId: board.value?.lists[listIndex].id,
        clientId: clientId.value,
    });
};

const { open, close } = useModal({
    component: CreateListModal,
    attrs: {
        titleForm: 'Create new list',
        onSubmit: async ({ title }) => {
            socket.value?.emit("createList", {
                title,
                boardId: board.value?.id,
                clientId: clientId.value,
            });
            const boardId: number = parseInt(router.currentRoute.value.params.id as string, 10);
            board.value = await getListsAndTasks(boardId);
            close();
        }
    },
});

const openEdit = (list: any) => {
    const { open, close } = useModal({
        component: CreateListModal,
        attrs: {
            titleForm: 'Edit list',
            initialValues: { title: list.title },
            onSubmit: async ({ title }) => {
                console.log(title);
                socket.value?.emit("updateList", {
                    title,
                    listId: list.id,
                    clientId: clientId.value,
                    boardId: board.value?.id,
                    position: list.position,
                });
                const boardId: number = parseInt(router.currentRoute.value.params.id as string, 10);
                board.value = await getListsAndTasks(boardId);
                close(); // close the edit modal
            }
        },
    })
    open();
};

const listDelete = (listId: number) => {
    if (!board.value?.lists) {
        return;
    }

    const listIndex = board.value.lists.findIndex(list => list.id === listId);
    if (listIndex !== -1) {
        board.value.lists.splice(listIndex, 1);
    }

    socket.value?.emit('deleteList', {
        listId,
        clientId: clientId.value,
        boardId: board.value.id,
    });

};
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <ModalsContainer />
        <HeaderBoard />
        <div class="w-full flex-grow flex flex-col h-0">
            <div class="flex justify-start mb-8 p-8">
                <h3 class="text-4xl font-semibold text-gray-800 tracking-tight text-white">
                    {{ board?.title }}
                </h3>
            </div>
            <div v-if="board?.lists" class="flex gap-6 overflow-x-auto flex-grow custom-scrollbar p-8">
                <List v-for="(list, listIndex) in board.lists" :key="list?.id" :list="list" :listIndex="listIndex"
                    @drag-start="onDragStart" @list-drag-start="onListDragStart" @drag-over="onDragOver"
                    @drop="onDrop(listIndex)" @list-drop="onListDrop(listIndex)" @drag-end="onDragEnd"
                    @list-deleted="listDelete" :create-new-task="createNewTask" :hovered-task="hoveredTask"
                    @edit-list="openEdit" draggable="true" class="bg-white p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-xl
                transition-shadow
                duration-300 flex-shrink-0 w-96 flex flex-col h-full" />
            </div>

            <div class="flex justify-center items-center p-8">
                <button @click="open"
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
