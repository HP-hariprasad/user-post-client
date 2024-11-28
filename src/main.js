import { createApp, provide, h } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia"; // Import Pinia
import { ApolloClients } from "@vue/apollo-composable";
import client from "./apollo";
import router from "./router";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp({
  setup: () => {
    provide(ApolloClients, client);
  },
  render: () => h(App),
});

const pinia = createPinia(); // Create Pinia instance
app.use(pinia); // Register Pinia with the app
app.use(PrimeVue);
app.use(router);

app.mount("#app");
