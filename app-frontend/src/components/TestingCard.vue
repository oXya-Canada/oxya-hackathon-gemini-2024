<template>
  <div class="text-h5 text-center" style="max-width: 400px">
    {{ questionRO.question }}
  </div>
  <div style="max-width: 500px">
    <div
      class="d-flex flex-wrap justify-center"
      v-for="(answer, j) in questionRO.answers"
    >
      <v-btn
        :key="j"
        class="mt-4 btn-wrap-text"
        block
        @click="checkAnswer(answer)"
        :color="
          answer.result == null ? '' : answer.result ? 'success' : 'error'
        "
      >
        {{ answer.text }}
      </v-btn>
      <span class="text-center" v-if="answer.result != null">
        {{ answer.explanation }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {} from "fs";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  question: {
    flipped: boolean;
    question: string;
    answers: {
      text: string;
      correct: boolean;
      explanation: string;
    }[];
  };
}>();

// const questionRO = ref(
//   {} as {
//     flipped: boolean;
//     question: string;
//     answers: {
//       text: string;
//       correct: boolean;
//       explanation: string;
//       result: boolean;
//     }[];
//   }
// );

const questionRO = ref(JSON.parse(JSON.stringify(props.question)));

// watch(
//   () => props.question,
//   (val) => {
//     console.log(val);
//     questionRO.value = val;
//   }
// );

const checkAnswer = (answer: { correct: any; result: boolean }) => {
  console.log(answer.correct);
  //reset all button colors
  questionRO.value.answers.forEach((answer: { result: null }) => {
    answer.result = null;
  });
  if (answer.correct) {
    console.log("Correct");
    //update button color to success
    answer.result = true;
  } else {
    console.log("Incorrect");
    answer.result = false;
  }
};
</script>

<style>
.btn-wrap-text {
  height: auto !important;
  padding: 10px 16px;
}
.btn-wrap-text .v-btn__content {
  white-space: normal !important;
  flex: 1 0 fit-content !important;
}
</style>
