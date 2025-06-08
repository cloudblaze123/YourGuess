<template>
    <div>
        <!-- <div class="text-lg">Model List</div> -->
        <ul v-if="modelNames.length > 0">
            <li v-for="modelName in modelNames">
                <button @click="selectModel(modelName)" class="btn btn-outline">
                    {{ modelName }}
                </button>
            </li>
        </ul>
        <div v-else class="text-center">No models</div>
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
  