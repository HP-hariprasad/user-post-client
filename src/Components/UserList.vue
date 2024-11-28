<template>
    <div>
        <h1>Users</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                <span>{{ user.name }} ({{ user.email }})</span>
                <button v-if="!isCurrentUser(user)" @click="toggleFollow(user)"
                    :class="{ following: isFollowing(user) }">
                    {{ isFollowing(user) ? "Unfollow" : "Follow" }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useUserStore } from "../Store/UserStore";
import { useAuthStore } from "../Store/auth";

const userStore = useUserStore();
const authStore = useAuthStore();

// Fetch users when the component mounts
onMounted(() => {
    userStore.fetchUsers();
});

const users = computed(() => userStore.users);

const isCurrentUser = (user) => user.id === authStore.userId;

// Helper to check if a user is followed
const isFollowing = (user) => userStore.followedUsers.includes(user.id);

// Follow or unfollow the user
const toggleFollow = async (user) => {
  if (isFollowing(user)) {
    await userStore.unfollowUser(user.id);
  } else {
    await userStore.followUser(user.id);
  }
};

</script>

<style scoped>
button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
button.following {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>