<template>
  <v-app-bar id="app-bar" app density="comfortable">
    <v-container fluid>
      <v-row dense>
        <v-col class="d-flex justify-start" cols="2" v-if="!xs">
          <h3 style="z-index: 9999" class="align-self-center text-center">
            FlashCard It
            <v-tooltip activator="parent" location="right"
              >Version {{ version }}</v-tooltip
            >
          </h3>
        </v-col>
        <v-col class="d-flex justify-center" cols="12" sm="8" md="8" lg="8">
          <v-tabs fixed-tabs stacked v-model="tab" style="display: contents">
            <template v-for="link in allLinks" :key="link.id">
              <v-tab
                :to="link.routeLink"
                style="max-width: 190px"
                size="default"
              >
                <v-icon>{{ link.icon }}</v-icon>
                <span v-if="mdAndUp" class="text-center">{{ link.title }}</span>
              </v-tab>
            </template>
          </v-tabs>
        </v-col>
        <v-col
          class="d-flex justify-end align-self-center"
          cols="2"
          lg="2"
          md="2"
          sm="2"
          v-if="!xs"
        >
          <SwitchTheme />
          <v-btn
            stacked
            style="z-index: 9999; padding: unset; min-width: 56px"
            density="comfortable"
            class="mr-2"
          >
            <!-- <v-progress-circular size="40" color="primary" model-value="100">
            <v-icon size="default" icon="mdi-help" color="primary"></v-icon>
            </v-progress-circular> -->
            <v-icon
              size="default"
              icon="mdi-help-circle-outline"
              color="primary"
            ></v-icon>
            <GitRequest />
          </v-btn>
          <LogoOxya v-if="!smAndDown"></LogoOxya>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
export default {
  name: "CoreAppBar",
};
</script>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import LogoOxya from "@/components/LogoOxya.vue";
import { useUserStore } from "@/store/user";
import GitRequest from "@/components/GitRequest.vue";
import SwitchTheme from "@/components/SwitchTheme.vue";

const version = import.meta.env.PACKAGE_VERSION;
const route = useRoute();
const path = computed(() => route.path);
const project = import.meta.env.VITE_PROJECT;
const azureDevopsLink = import.meta.env.VITE_AZURE_DEVOPS_LINK;
const tab = ref(null);
const { xs, smAndDown, mdAndUp } = useDisplay();
const userStore = useUserStore();
// userStore.getUser();

let allLinks = [
  // Clients
  {
    id: 0,
    title: "Trainee",
    icon: "mdi-cards-variant",
    routeLink: "/",
  },
  {
    id: 1,
    title: "Instructor",
    icon: "mdi-human-male-board-poll",
    routeLink: "/admin",
  },
];

const urlFirewall = import.meta.env.VITE_EXCEL_FIREWALL_URL;
const urlInput = import.meta.env.VITE_EXCEL_INPUT_URL;
//if urlFirewall is null, then remove the firewall route where routeLink == /excelFirewall
if (!urlFirewall) {
  allLinks = allLinks.filter((route) => {
    return route.routeLink != "/excelFirewall";
  });
}
if (!urlInput) {
  allLinks = allLinks.filter((route) => {
    return route.routeLink != "/excelInput";
  });
}
</script>
