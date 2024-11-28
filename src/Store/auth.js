import { defineStore } from "pinia";
import { provideApolloClient } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { jwtDecode } from "jwt-decode"; // Correct import for Vite // Import jwt-decode
import apolloClient from "../apollo";
import router from "../router";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null,
    userId: null,
    name: null,
    email: null,
  }),
  actions: {
    async login(email, password) {
      // Provide the Apollo Client for this operation
      provideApolloClient(apolloClient);

      const LOGIN_MUTATION = gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `;

      const { mutate } = useMutation(LOGIN_MUTATION);

      try {
        const { data } = await mutate({ email, password });
        if (data?.login) {
          this.token = data.login;

          // Save token to localStorage
          localStorage.setItem("authToken", this.token);

          // Decode the token to extract user details
          this.decodeAndSetUserDetails(this.token);

          // Redirect to dashboard
          router.push("/");
        } else {
          throw new Error("Login failed: No token received");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert(error.message || "Login failed.");
      }
    },

    decodeAndSetUserDetails(token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT
        console.log("decoded data", decoded);
        this.userId = decoded.userId || null;
      } catch (error) {
        console.error("Failed to decode token:", error);
        this.clearAuth(); // Clear auth if decoding fails
      }
    },

    saveToken(token) {
      this.token = token;
      localStorage.setItem("authToken", token);
      this.decodeAndSetUserDetails(token); // Decode and set user details
    },

    clearAuth() {
      this.token = null;
      this.userId = null;
      this.name = null;
      this.email = null;
      localStorage.removeItem("authToken");
    },

    loadToken() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.token = token;
        this.decodeAndSetUserDetails(token); // Decode and set user details on load
      }
    },
  },
});
