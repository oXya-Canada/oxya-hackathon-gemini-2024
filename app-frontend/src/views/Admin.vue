<template>
  <v-main>
    <v-container>
      <v-card elevation="12">
        <v-form ref="form" @submit.prevent="saveQuestions">
          <v-container>
            <v-select
              v-model="selectedTopicId"
              :items="[
                ...[{ name: 'Create New Topic', id: 'new', cards: [] }],
                ...cardStore.topics,
              ]"
              item-title="name"
              item-value="id"
              label="Select a topic"
              variant="outlined"
              hide-details
            >
              <template v-slot:item="{ index, item, props }">
                <div v-if="item.value != 'new'">
                  <v-list-item v-bind="props">
                    <!-- <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content> -->
                  </v-list-item>
                </div>
                <div v-if="item.value == 'new'">
                  <v-list-item prepend-icon="mdi-pencil" v-bind="props">
                    <!-- <v-list-item-content>
                      <v-list-item-title>Create New Topic</v-list-item-title>
                    </v-list-item-content> -->
                  </v-list-item>
                  <v-divider class="mt-2 mb-2"></v-divider>
                </div>
              </template>
            </v-select>
            <div class="mt-8" v-if="selectedTopicId != ''">
              <v-text-field
                v-model="selectedTopicObject.name"
                label="Topic name"
                hide-details
              />
              <div v-for="(card, i) in selectedTopicObject.cards">
                <EditableCard
                  :question="card"
                  :index="i"
                  @delete="removeQuestion"
                ></EditableCard>
              </div>
              <v-row align="center" justify="center" class="mt-4">
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-plus"
                    size="x-large"
                    :loading="cardStore.status == 'pending'"
                    v-if="selectedTopicId != ''"
                  >
                  </v-btn>
                  <v-dialog activator="parent" max-width="500">
                    <template v-slot:default="{ isActive }">
                      <v-card
                        prepend-icon="mdi-help-box-multiple-outline"
                        title="Adding question(s)"
                      >
                        <v-card-text
                          class="d-flex justify-space-around align-center"
                          ><div class="mr-4">
                            <v-file-input
                              accept=".pdf"
                              label="PDF input"
                              prepend-icon="mdi-file-pdf-box"
                              hide-details
                              clearable
                              @change="selectFile"
                            ></v-file-input>
                            <v-number-input
                              v-model="numberOfCards"
                              :reverse="false"
                              controlVariant="default"
                              label="Number of cards"
                              :hideInput="false"
                              hide-details
                              inset
                              :max="20"
                            ></v-number-input>
                          </div>
                          <div class="ml-4">
                            <v-btn
                              prepend-icon="mdi-note-edit"
                              block
                              @click="
                                () => {
                                  addNewQuestion();
                                  isActive.value = false;
                                }
                              "
                              >Manual</v-btn
                            >
                            <v-divider class="mt-4 mb-4"></v-divider>
                            <v-btn
                              prepend-icon="mdi-chip"
                              block
                              type="submit"
                              :loading="cardStore.status == 'pending'"
                              @click="
                                () => {
                                  generateCards();
                                  isActive.value = false;
                                }
                              "
                            >
                              Generate
                            </v-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
              </v-row>
            </div>

            <v-card-actions v-if="selectedTopicId != ''">
              <v-spacer></v-spacer>
              <v-btn color="error" @click="deleteTopic"> Delete Topic </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="resetQuestions()"
              >
                Reset
              </v-btn>
              <v-btn color="primary" type="submit">Save</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-container>
    <BackToTop />
  </v-main>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { useCardStore } from "@/store/card";
import EditableCard from "@/components/EditableCard.vue";
import { watch } from "vue";
import type { Topic } from "@/store/card";
import BackToTop from "@/components/BackToTop.vue";

const cardStore = useCardStore();
cardStore.getTopics();

const selectedTopicId = ref("");
const numberOfCards = ref(1);
const selectedTopicObject = ref({ id: "", name: "", cards: [] } as Topic);
const selectedFile: Ref<File | null> = ref(null);

watch(selectedTopicId, (newVal) => {
  if (newVal == "new") {
    selectedTopicObject.value = { name: "", cards: [] };
    return;
  }
  if (newVal != "") {
    selectedTopicObject.value = JSON.parse(
      JSON.stringify(cardStore.topics.find((topic) => topic.id == newVal))
    );
  }
});

const selectFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFile.value = target.files[0];
  }
};

const createNewTopic = () => {
  selectedTopicId.value = "new";
};

const deleteTopic = async () => {
  if (selectedTopicId.value != "") {
    await cardStore.deleteTopic(selectedTopicId.value);
    selectedTopicId.value = "";
  }
};

const saveQuestions = async () => {
  console.log("saveQuestions");

  const topicId = await cardStore.saveTopic(selectedTopicObject.value);
  if (topicId) {
    selectedTopicId.value = topicId;
  }
};

const resetQuestions = () => {
  selectedTopicObject.value.cards = JSON.parse(
    JSON.stringify(
      cardStore.topics.find((topic) => topic.id == selectedTopicId.value)!.cards
    )
  );
};

const removeQuestion = (index: number) => {
  selectedTopicObject.value.cards.splice(index, 1);
};

const addNewQuestion = () => {
  selectedTopicObject.value.cards.push({
    question: "",
    answers: [{ text: "", correct: false, explanation: "" }],
  });
};

const generateCards = async () => {
  if (selectedFile.value) {
    const cards = await cardStore.generateCardsFromFile(
      selectedFile.value,
      numberOfCards.value
    );
    for (const card of cards) {
      selectedTopicObject.value.cards.push(card);
    }
    return;
  } else {
    const cards = await cardStore.generateCards(
      selectedTopicObject.value.name,
      numberOfCards.value
    );
    console.log(cards);
    for (const card of cards) {
      selectedTopicObject.value.cards.push(card);
    }
  }
};
</script>
