import { defineStore } from "pinia";
import { gql } from "@apollo/client/core";
import apolloClient from "../apollo";

export const usePostStore = defineStore("postStore", {
  state: () => ({
    posts: [], // Posts from subscribed users
    newPost: null, // Most recent post via subscription
  }),

  actions: {
    async fetchSubscribedPosts() {
      const GET_SUBSCRIBED_POSTS = gql`
        query {
          postsFromSubscribedUsers {
            id
            title
            content
            createdAt
            user {
              id
              name
            }
          }
        }
      `;
      try {
        const response = await apolloClient.query({
          query: GET_SUBSCRIBED_POSTS,
        });
        this.posts = response.data.postsFromSubscribedUsers;
      } catch (error) {
        console.error("Error fetching subscribed posts:", error);
      }
    },

    async createPost(title, content) {
      const CREATE_POST_MUTATION = gql`
        mutation CreatePost($title: String!, $content: String!) {
          createPost(title: $title, content: $content) {
            id
            title
            content
            createdAt
            user {
              id
              name
            }
          }
        }
      `;
      try {
        const response = await apolloClient.mutate({
          mutation: CREATE_POST_MUTATION,
          variables: { title, content },
        });
        this.posts.unshift(response.data.createPost); // Optimistically update UI
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },

    subscribeToNewPosts() {
      const NEW_POST_SUBSCRIPTION = gql`
        subscription {
          newPost {
            id
            title
            content
            createdAt
            user {
              id
              name
            }
          }
        }
      `;
      apolloClient.subscribe({ query: NEW_POST_SUBSCRIPTION }).subscribe({
        next: ({ data }) => {
          if (data?.newPost) {
            this.posts = [data.newPost, ...this.posts];
          }
        },
        error: (error) => console.error("Subscription error:", error),
      });
    },
  },
});
