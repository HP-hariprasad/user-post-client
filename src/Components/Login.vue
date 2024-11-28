<template>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "../Store/auth";
  
  const authStore = useAuthStore();
  const email = ref("");
  const password = ref("");
  
  const login = async () => {
    await authStore.login(email.value, password.value);
  };
  </script>
  