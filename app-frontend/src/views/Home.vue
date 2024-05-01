<script setup lang="ts">
import { ref, onMounted, computed, watch, mergeProps, onUnmounted } from "vue";
import Cards from "@/components/Cards.vue";
import _ from "lodash";
import { useCardStore } from "@/store/card";
import type { Card } from "@/store/card";
import { useDisplay } from "vuetify";

const cardStore = useCardStore();
cardStore.getTopics();

const cards = ref([] as Card[]);
const selectedTopicId = ref("");

watch(selectedTopicId, (newVal) => {
  if (newVal != "") {
    // cardStore.cards = JSON.parse(
    //   JSON.stringify(cardStore.topics.find((topic) => topic.id == newVal))
    // ).cards;
    cards.value =
      cardStore.topics.find((topic) => topic.id == newVal)?.cards || [];
    console.log("cards", cards.value);
  }
});

const numberOfCards = ref(5);
const certification = ref("");

const submit = async () => {
  console.log("submit");
  cards.value = await cardStore.generateCardsFromTopicName(
    certification.value,
    numberOfCards.value
  );
};

const reset = () => {
  cards.value = [];
  selectedTopicId.value = "";
  certification.value = "";
};
</script>

<style scoped>
.svg-background {
  background-image: url("../assets/background.svg"); /* Chemin vers votre fichier SVG */
  background-size: cover; /* Redimensionne le fond pour couvrir l'ensemble de l'élément */
  background-position: center; /* Centre le fond horizontalement et verticalement */
  background-repeat: no-repeat; /* Empêche la répétition du fond */
}
</style>

<template>
  <!-- <div class="svg-background" v-html="svgContent"></div> -->
  <v-main
    class="d-flex align-center justify-center flex-column svg-background"
    style="min-height: 300px; z-index: 1"
  >
    <div v-if="!(cards.length > 0)">
      <v-card elevation="12">
        <v-card-text>
          <v-form
            style="min-width: 300px"
            @submit.prevent="submit"
            hide-details
          >
            <v-select
              v-model="selectedTopicId"
              :items="cardStore.topics"
              item-title="name"
              item-value="id"
              label="Select a topic"
              hide-details
            ></v-select>
          </v-form>
          <v-divider class="mt-4 mb-4" style="width: 300px" />
          <v-form style="min-width: 300px" @submit.prevent="submit">
            <v-text-field
              v-model="certification"
              label="Certification to learn"
              hide-details
            ></v-text-field>
            <v-number-input
              v-model="numberOfCards"
              :reverse="false"
              controlVariant="default"
              label="Number of cards"
              :hideInput="false"
              inset
              :max="10"
              hide-details
            ></v-number-input>
            <v-btn
              block
              type="submit"
              :loading="cardStore.status == 'pending'"
              color="primary"
              style="border-top-left-radius: 0; border-top-right-radius: 0"
            >
              Generate
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
    <Cards v-if="cards.length > 0" :cards="cards" />
    <v-btn
      v-if="cards.length > 0"
      class="mt-16 font-weight-black"
      @click="reset"
      >Go Back</v-btn
    >
    <!-- {{ useDisplay() }} -->
  </v-main>
</template>
