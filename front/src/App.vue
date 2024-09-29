<script setup lang="ts">
import { ref } from 'vue';

const isTransitioning = ref(false);

const startTransition = () => {
  isTransitioning.value = true;
};

const endTransition = () => {
  isTransitioning.value = false;
};
</script>

<template>
  <div id="app" :class="{ 'no-scroll': !isTransitioning }" class="min-h-screen h-full">
    <div class="page-wrap h-full">
      <router-view v-slot="{ Component }">
        <XyzTransition appear xyz="fade in-left-100% out-right-100%" mode="out-in" @before-enter="startTransition"
          @leave="endTransition" class="min-h-screen">
          <component :is="Component" />
        </XyzTransition>
      </router-view>
    </div>
  </div>
</template>

<style>
.no-scroll {
  overflow: hidden;
}
</style>
