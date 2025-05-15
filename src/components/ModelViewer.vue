<template>
    模型查看器
    <div class="flex flex-col">
        <table class="border-collapse border-gray-300">
            <tr v-for="(row, index) in weights">
                <td v-for="(col, colIndex) in row" class="border-2 border-gray-300">
                    {{ col }}
                </td>
            </tr>
        </table>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const weights = ref([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
])
</script>
