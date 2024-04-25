<template>
  <v-container>
    <v-card elevation="6">
      <v-text-field
        style="background-color: #007fff; color: white"
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
                style="color: #007fff"
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
                :style="answer.correct ? 'color: #40a829' : 'color: #e01010'"
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
