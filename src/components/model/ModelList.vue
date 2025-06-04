<template>
    <div>
        <div class="text-lg">Model List</div>
        <ul class="list">
            <li v-for="modelName in modelNames" class="list-row">
                <button @click="selectModel(modelName)" class="btn btn-outline">
                    {{ modelName }}
                </button>
            </li>
        </ul>
    </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits(['selectModel']);




import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();

const modelNames = computed(() => Object.keys(modelStore.models));


function selectModel(modelName: string) {
    emits('selectModel', modelName);
}
</script>
  