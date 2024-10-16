// src/composables/useDragDrop.ts

import { ref } from 'vue';

export function useDragDrop(board: any, socket: any, clientId: any) {
    const draggedTask = ref<{ listIndex: number; taskIndex: number } | null>(null);
    const draggedListIndex = ref<number | null>(null);
    const hoveredTask = ref<{ listIndex: number; taskIndex: number } | null>(null);

    const onDragStart = (listIndex: number, taskIndex: number) => {
        draggedTask.value = { listIndex, taskIndex };
    };

    const onListDragStart = (listIndex: number) => {
        draggedListIndex.value = listIndex;
    };

    const onDragOver = (listIndex: number, taskIndex?: number) => {
        if (taskIndex !== undefined) {
            hoveredTask.value = { listIndex, taskIndex };
        } else {
            hoveredTask.value = { listIndex, taskIndex: -1 };
        }
    };

    const onDrop = (targetListIndex: number, targetTaskIndex?: number) => {
        if (draggedTask.value && board.value?.lists) {
            const { listIndex: sourceListIndex, taskIndex: sourceTaskIndex } = draggedTask.value;
            const sourceList = board.value.lists[sourceListIndex];

            if (sourceList?.tasks) {
                const task = sourceList.tasks.splice(sourceTaskIndex, 1)[0]; // Eliminar la tarea de la lista de origen

                if (task) {
                    const targetList = board.value.lists[targetListIndex];

                    if (targetList?.tasks && socket.value) {
                        if (targetTaskIndex === undefined || targetTaskIndex === -1) {
                            // Mover tarea al final de la lista de destino
                            targetList.tasks.push(task);

                            // Emitir el evento para el socket
                            socket.value.emit('moveTask', {
                                task: task,
                                targetList,
                                sourceList,
                                clientId: clientId.value
                            });
                        } else {
                            // Insertar tarea en la posición especificada
                            targetList.tasks.splice(targetTaskIndex, 0, task);
                        }
                    }
                }
            }
            draggedTask.value = null; // Limpiar la tarea arrastrada
        }
        hoveredTask.value = null; // Limpiar la tarea que estaba siendo sobrevolada
    };

    const onListDrop = (targetListIndex: number) => {
        if (draggedListIndex.value !== null && board.value?.lists) {
            if (draggedListIndex.value === targetListIndex) {
                draggedListIndex.value = null;
                return;
            }
            const movedList = board.value.lists.splice(draggedListIndex.value, 1)[0];
            if (movedList && socket.value) {
                let targetList;
                if (targetListIndex > draggedListIndex.value) {
                    targetList = board.value.lists[targetListIndex - 1];
                } else {
                    targetList = board.value.lists[targetListIndex];
                }
                socket.value.emit('moveList', {
                    movedList,
                    targetList,
                    clientId: clientId.value
                });
                board.value.lists.splice(targetListIndex, 0, movedList);
            }
            draggedListIndex.value = null;
        }
    };

    const onDragEnd = () => {
        hoveredTask.value = null;
        draggedListIndex.value = null;
    };

    return {
        onDragStart,
        onListDragStart,
        onDragOver,
        onDrop,
        onListDrop,
        onDragEnd,
        hoveredTask,
    };
}