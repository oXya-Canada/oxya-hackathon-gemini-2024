<template>
  <v-switch
    style="position: absolute; top: 80px"
    :modelValue="cardMod == 'testing' ? true : false"
    v-on:update:model-value="
      cardMod = $event ? 'testing' : 'learning';
      flipped = false;
    "
    color="primary"
    label="Testing Mod"
  ></v-switch>

  <Transition name="flip" mode="out-in" :duration="250">
    <v-card
      class="mx-auto"
      elevation="24"
      :min-width="xs ? '380px' : smAndDown ? '500px' : '800px'"
      v-bind:key="flipped ? 'a' : 'b'"
      style="position: relative"
      color="success"
      :theme="flipped ? 'dark' : 'light'"
      @keydown.space="toggleCard(questions[cardNumber])"
      @keydown.right="
        questions.length < cardNumber + 2 ? (cardNumber = 0) : cardNumber++
      "
      @keydown.left="
        cardNumber != 0 ? cardNumber-- : (cardNumber = questions.length - 1)
      "
    >
      <v-carousel
        height="500"
        progress="primary"
        hide-delimiters
        :show-arrows="xs ? false : true"
        v-model="cardNumber"
        @update:model-value="if (flipped) flipped = false;"
      >
        <v-carousel-item
          v-for="(question, i) in questions"
          :key="i"
          v-on:click="toggleCard(question)"
        >
          <v-sheet height="100%">
            <div
              class="d-flex fill-height flex-column justify-center align-center justify-space-evenly"
            >
              <LearningCard
                v-if="cardMod == 'learning'"
                :text="
                  flipped
                    ? question.answers.find((answer) => answer.correct)!.text
                    : question.question
                "
              />
              <TestingCard v-if="cardMod == 'testing'" :question="question" />
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <div class="text-center">
        {{ `${cardNumber + 1}/${cards.length}` }}
      </div>
    </v-card>
  </Transition>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from "vue";
import LearningCard from "./LearningCard.vue";
import TestingCard from "./TestingCard.vue";
import type { Card } from "@/store/card";
import { useDisplay } from "vuetify";

const { xs, smAndDown, mdAndUp } = useDisplay();

const cardMod = ref("learning") as Ref<"learning" | "testing">;

const cardNumber = ref(0);

const flipped = ref(false);

const props = defineProps<{
  cards: Card[];
}>();

const questions = computed(() => {
  // cardStore.cards
  return props.cards.map((card) => {
    return {
      question: card.question,
      answers: card.answers,
      flipped: false,
    };
  });
});

// const questions = ref([
//   {
//     question: "What is the capital of France?",
//     answers: [
//       { text: "Paris", correct: true },
//       { text: "New York", correct: false },
//       { text: "London", correct: false },
//       { text: "Dublin", correct: false },
//     ],
//     flipped: false,
//   },
//   {
//     question: "Who is CEO of Tesla?",
//     answers: [
//       { text: "Jeff Bezos", correct: false },
//       { text: "Elon Musk", correct: true },
//       { text: "Bill Gates", correct: false },
//       { text: "Tony Stark", correct: false },
//     ],
//     flipped: false,
//   },
//   {
//     question: "The iPhone was created by which company?",
//     answers: [
//       { text: "Apple", correct: true },
//       { text: "Intel", correct: false },
//       { text: "Amazon", correct: false },
//       { text: "Microsoft", correct: false },
//     ],
//     flipped: false,
//   },
//   {
//     question: "Which planet is known as the Red Planet?",
//     answers: [
//       { text: "Earth", correct: false },
//       { text: "Jupiter", correct: false },
//       { text: "Mars", correct: true },
//       { text: "Saturn", correct: false },
//     ],
//     flipped: false,
//   },
// ]);

const submit = () => {
  console.log("submit");
};
const toggleCard = (card: { flipped: boolean }) => {
  console.log("toggleCard");
  if (cardMod.value === "learning") {
    // card.flipped = !card.flipped;
    // if (flipped.value) {
    //   cardNumber.value++;
    // }
    flipped.value = !flipped.value;
  }
};
</script>

<style>
.flip-enter-active,
.flip-leave-active {
  transition: all 0.25s ease !important;
}

.flip-enter-from {
  transform: rotateX(180deg);
  opacity: 0;
}

.flip-enter-to {
  transform: rotateX(0deg);
  opacity: 1;
}

/* .flip-leave-from {
  transform: rotateY(0deg);
  opacity: 1;
} */

.flip-leave-to {
  transform: rotateX(180deg);
  opacity: 0;
}

.card {
  display: block;
  width: 500px;
  height: 200px;
  padding: 80px 50px;
  background-color: #51aae5;
  border-radius: 7px;
  margin: 5px;
  text-align: center;
  line-height: 27px;
  cursor: pointer;
  position: relative;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  -webkit-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  -moz-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  will-change: transform;
}
</style>
