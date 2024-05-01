<template>
  <v-container>
    <v-card elevation="6">
      <v-text-field
        style="
          background-color: rgb(var(--v-theme-primary)) !important;
          color: white;
          background: rgb(102, 36, 131);
          background: linear-gradient(
            90deg,
            /* rgba(102, 36, 131, 1) 0%, */ /* rgba(109, 55, 143, 1) 8%, */
              rgba(125, 99, 170, 1) 0%,
            rgba(139, 133, 192, 1) 49%,
            rgba(148, 157, 208, 1) 68%,
            rgba(154, 172, 217, 1) 86%,
            rgba(156, 178, 221, 1) 100%
          );
        "
        v-model="question.question"
        :label="'Question ' + (index + 1)"
        hide-details
        density="compact"
        append-inner-icon="mdi-delete"
        @click:append-inner="$emit('delete', props.index)"
      />
      <v-card-text>
        <div v-for="(answer, i) in question.answers">
          <v-card>
            <v-text-field
              density="compact"
              v-model="answer.text"
              :label="'Anwser ' + (i + 1)"
              hide-details
              append-inner-icon="mdi-delete"
              @click:append-inner="deleteAwser(i)"
            />
            <v-card-text>
              <!-- <div class="d-flex"> -->
              <v-textarea
                density="compact"
                v-model="answer.explanation"
                style="color: rgb(var(--v-theme-primary)) !important"
                label="Explanation"
                auto-grow
                rows="1"
                hide-details
              />
              <v-checkbox
                density="compact"
                v-model="answer.correct"
                label="Correct"
                hide-details
                :color="answer.correct ? 'success' : 'error'"
              />
              <!-- </div> -->
            </v-card-text>
          </v-card>
          <v-divider class="mb-4" />
        </div>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn icon="mdi-plus" @click="addNewAnswer" size="x-small"></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { compact } from "lodash";
import { ref } from "vue";

const props = defineProps<{
  question: {
    question: string;
    answers: { text: string; correct: boolean; explanation: string }[];
  };
  index: number;
}>();

const deleteAwser = (i: number) => {
  props.question.answers.splice(i, 1);
};

const addNewAnswer = () => {
  props.question.answers.push({
    text: "",
    correct: false,
    explanation: "",
  });
};
</script>

<style>
.v-field-label--floating {
  color: black;
  font-weight: bold;
  opacity: 1;
}
</style>
