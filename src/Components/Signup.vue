<template>
    <form @submit.prevent="signup">
        <input v-model="name" placeholder="Name" required />
        <input v-model="email" placeholder="Email" type="email" required />
        <input v-model="password" placeholder="Password" type="password" required />
        <button type="submit">Signup</button>
    </form>
</template>