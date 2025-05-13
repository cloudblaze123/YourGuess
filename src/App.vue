<template>
    <div class="text-3xl text-white">Hello Tailwind</div>
    <button class="btn btn-primary">Hello DaiyUI</button>

    <header>
        <div class="wrapper">
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
