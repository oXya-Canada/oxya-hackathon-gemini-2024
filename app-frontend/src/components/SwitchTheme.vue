<template>
  <v-switch
    style="flex: none"
    class="mr-2 align-self-center"
    v-model="darkMode"
    @change="toggleTheme()"
    true-icon="mdi-weather-night"
    false-icon="mdi-weather-sunny"
    color="white"
    hide-details
  >
    ></v-switch
  >
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
import { ref, provide } from "vue";
const darkMode = ref(false);
const theme = useTheme();

const initUserTheme = getTheme() || getMediaPreference();
setTheme(initUserTheme);

provide(/* key */ "theme", /* value */ theme);

const toggleTheme = () => {
  if (darkMode.value) setTheme("dark");
  else setTheme("light");
};

function setTheme(themeChoose: string) {
  darkMode.value = themeChoose === "dark";
  theme.global.name.value = themeChoose;
  localStorage.setItem("user-theme", themeChoose);
}

function getMediaPreference() {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)" // "(prefers-color-scheme: dark)"
  ).matches;
  if (hasDarkPreference) {
    return "dark"; // "dark";
  } else {
    return "light"; // "light";
  }
}

function getTheme() {
  return localStorage.getItem("user-theme");
}
</script>

<style lang="scss">
@use "@/styles/settings";
</style>
