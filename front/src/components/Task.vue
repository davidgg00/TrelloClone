<script setup lang="ts">
import { defineProps } from 'vue';
import { Task } from '../interfaces/Task';

defineProps<{ task: Task }>();
</script>

<template>
    <div class="task">
        {{ task.title }}
    </div>
</template>

<style scoped>
.task {
    padding: 10px;
    background-color: white;
    border: 1px solid #ddd;
    cursor: move;
}
</style>
