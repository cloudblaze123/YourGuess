<template>
    <div>
        <div class="text-lg">Model List</div>
        <ul class="list">
            <li v-for="modelName in modelNames" class="list-row">
                {{ modelName }}
            </li>
        </ul>
    </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();

const modelNames = computed(() => Object.keys(modelStore.models));
</script>
  