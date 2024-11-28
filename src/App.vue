<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/signup">Signup</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/users">Users</router-link>
      <span v-if="isLoggedIn">Welcome, {{ name }}</span>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "./Store/auth"; // Adjust path as necessary

const authStore = useAuthStore();

// Compute values from the store
const isLoggedIn = computed(() => !!authStore.token); // Check if user is logged in
const name = computed(() => authStore.userId); // Get the user's name

onMounted(() => {
  authStore.loadToken();
});
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: blue;
}

span {
  margin-left: auto;
  font-weight: bold;
}
</style>
