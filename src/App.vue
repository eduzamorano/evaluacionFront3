<template>
  <router-view />
</template>

<script>
import './styles/global.css';
export default {
  name: 'App'
};
</script>

<style>

html, body, #app {
  font-family: 'Roboto', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-gris-medio);
  margin: 0;
  padding: 0;

}
</style>
