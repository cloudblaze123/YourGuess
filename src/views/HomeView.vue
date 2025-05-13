<template>
    <!-- name of each tab group should be unique -->
    <div class="tabs tabs-border">
        <input type="radio" name="my_tabs_2" class="tab" aria-label="Game" checked="checked"/>
        <div class="tab-content border-base-300 bg-base-100 p-10">
            <GameView />
        </div>

        <input type="radio" name="my_tabs_2" class="tab" aria-label="Train" />
        <div class="tab-content border-base-300 bg-base-100 p-10">
            <TrainView />
        </div>

        <input type="radio" name="my_tabs_2" class="tab" aria-label="Statistics" />
        <div class="tab-content border-base-300 bg-base-100 p-10">
            <StatisticsView />
        </div>
    </div>
</template>


<script setup lang="ts">
import GameView from './GameView.vue';
import TrainView from './TrainView.vue';
import StatisticsView from './StatisticsView.vue';
</script>
