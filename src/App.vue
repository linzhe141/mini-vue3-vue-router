<template>
  <nav>
    <!-- <div>{{ reac.path }}</div> -->
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}
</style>
<script lang="ts">
import { computed, ref, reactive } from 'vue';
export default {
  setup() {
    const refValue = ref({ path: '/test' });
    // const reac = reactive(computed(() => refValue.value.path));
    // reactive({value: proxy({path: '/test'})})
    const reac = reactive(refValue);
    setTimeout(() => (refValue.value = { path: 'FDASFDAS' }), 3000);
    const count = ref(1);
    const obj = reactive(count);
    // @ts-ignore
    window.__count = count;
    // @ts-ignore
    window.__obj = obj;
    return {
      reac
    };
  }
};
</script>
