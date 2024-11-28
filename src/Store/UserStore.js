import { defineStore } from "pinia";
import { gql } from "@apollo/client/core";
import client from "../apollo"; // Import Apollo Client

export const useUserStore = defineStore("userStore", {
  state: () => ({
    users: [], // All users
    followedUsers: [], // List of IDs for followed users
  }),

  actions: {
    async fetchUsers() {
      const USERS_QUERY = gql`
        query {
          users {
            id
            name
            email
          }
        }
      `;
      try {
        const response = await client.query({ query: USERS_QUERY });
        this.users = response.data.users;

        // Fetch followed users for the logged-in user
        await this.fetchFollowedUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    async fetchFollowedUsers() {
      const FOLLOWED_USERS_QUERY = gql`
        query {
          followedUsers {
            id
          }
        }
      `;
      try {
        const response = await client.query({ query: FOLLOWED_USERS_QUERY });
        this.followedUsers = response.data.followedUsers.map((user) => user.id);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    },

    async followUser(userId) {
      const FOLLOW_USER_MUTATION = gql`
        mutation FollowUser($userId: ID!) {
          followUser(userId: $userId)
        }
      `;
      try {
        await client.mutate({
          mutation: FOLLOW_USER_MUTATION,
          variables: { userId },
        });
        this.followedUsers.push(userId); // Update state after successful mutation
      } catch (error) {
        console.error("Error following user:", error);
      }
    },

    async unfollowUser(userId) {
      const UNFOLLOW_USER_MUTATION = gql`
        mutation UnfollowUser($userId: ID!) {
          unfollowUser(userId: $userId)
        }
      `;
      try {
        await client.mutate({
          mutation: UNFOLLOW_USER_MUTATION,
          variables: { userId },
        });
        this.followedUsers = this.followedUsers.filter((id) => id !== userId); // Update state
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    },
  },
});
