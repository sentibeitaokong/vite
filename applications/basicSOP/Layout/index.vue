<template>
  <div id="layout">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import {RouterView} from "vue-router";
</script>

<style scoped lang="css">
#layout{
  width: 500px;
  height: 500px;
  border: 10px solid black;
}
</style>