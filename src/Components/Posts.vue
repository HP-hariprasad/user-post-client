<template>
    <div class="post-container">
      <section class="create-post">
        <h3>Create a Post</h3>
        <form @submit.prevent="handleSubmit">
          <input v-model="title" placeholder="Title" required />
          <textarea v-model="content" placeholder="Content" required></textarea>
          <button type="submit">Post</button>
        </form>
      </section>
  
      <section class="subscribed-posts">
        <h3>Subscribed Posts</h3>
        <ul>
          <li v-for="post in posts" :key="post.id">
            <h4>{{ post.title }}</h4>
            <p>{{ post.content }}</p>
            <p><small>By {{ post.user.name }}</small></p>
          </li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { usePostStore } from '../Store/postStore';
  
  const postStore = usePostStore();
  
  const title = ref('');
  const content = ref('');
  
  // Computed property to make posts state reactive
  const posts = computed(() => postStore.posts);
  
  const handleSubmit = async () => {
    if (title.value && content.value) {
      await postStore.createPost(title.value, content.value);
      title.value = '';
      content.value = '';
    }
  };
  
  // Fetch posts and subscribe to new posts on mount
  onMounted(() => {
    postStore.fetchSubscribedPosts();
    postStore.subscribeToNewPosts();
  });
  </script>
  
  <style scoped>
  .post-container {
    display: flex;
    justify-content: space-between;
  }
  .create-post {
    width: 30%;
  }
  .subscribed-posts {
    width: 65%;
  }
  </style>
  