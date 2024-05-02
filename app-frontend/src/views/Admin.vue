<template>
  <v-main class="svg-background">
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
            <div class="mt-4" v-if="selectedTopicId != ''">
              <v-text-field
                v-model="selectedTopicObject.name"
                label="Topic name"
                hide-details
              />
              <v-sheet
                color="grey-lighten-3"
                height="auto"
                width="auto"
                rounded="b"
              >
                <v-label
                  text="Files"
                  class="v-label v-field-label v-field-label--floating"
                  style="
                    position: unset;
                    padding: 8px 16px 4px;
                    visibility: visible;
                  "
                ></v-label>
                <div class="d-flex ml-0 pb-2">
                  <div>
                    <v-chip
                      v-if="cardStore.statusDocuments != 'pending'"
                      v-for="(file, i) in selectedTopicObject.documents"
                      class="mr-2 ml-2 ma-1"
                      close-icon="mdi-delete"
                      prepend-icon="mdi-file-pdf-box"
                      closable
                      @click:close="
                        console.log(i);
                        selectedTopicObject.documents?.splice(i, 0);
                      "
                    >
                      <template v-slot:close>
                        <v-icon>mdi-delete</v-icon>
                        <v-tooltip activator="parent"
                          >Function not working for demo</v-tooltip
                        >
                      </template>
                      {{ file.name }}
                    </v-chip>
                    <v-skeleton-loader
                      class="mr-2 ml-2 ma-1 font-weight-medium"
                      v-if="cardStore.statusDocuments == 'pending'"
                      width="150"
                      height="32"
                      color="grey-lighten-3"
                      type="chip"
                      loading
                      loading-text="Loading files"
                    ></v-skeleton-loader>
                    <v-chip
                      v-if="cardStore.statusDocuments != 'pending'"
                      class="mr-2 ml-2 ma-1 font-weight-medium"
                      append-icon="mdi-plus"
                      color="primary"
                      @click="upload?.click()"
                      :loading="true"
                    >
                      <input
                        ref="upload"
                        type="file"
                        hidden
                        @change="addFile"
                        accept=".pdf"
                      />
                      Add File
                    </v-chip>
                  </div>
                </div>
              </v-sheet>
              <v-virtual-scroll
                max-height="63vh"
                :items="selectedTopicObject.cards"
              >
                <template v-slot:default="{ item, index }">
                  <EditableCard
                    :question="item"
                    :index="index"
                    @delete="removeQuestion"
                  ></EditableCard>
                </template>
              </v-virtual-scroll>
              <v-row align="center" justify="center" class="mt-4">
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-plus"
                    size="x-large"
                    :loading="cardStore.status == 'pending'"
                    v-if="selectedTopicId != ''"
                  >
                  </v-btn>
                  <v-dialog activator="parent" max-width="1000">
                    <template v-slot:default="{ isActive }">
                      <v-card
                        prepend-icon="mdi-help-box-multiple-outline"
                        title="Adding question(s)"
                      >
                        <v-card-text>
                          <v-radio-group v-model="selectedOption">
                            <v-row
                              no-gutters
                              class="d-flex justify-space-around align-start"
                            >
                              <v-col cols="12" md="auto" class="text-center">
                                <v-radio
                                  label="Manual"
                                  value="manual"
                                ></v-radio>
                              </v-col>
                              <v-divider vertical v-if="mdAndUp"></v-divider>
                              <v-col cols="12" md="auto" class="text-center">
                                <v-radio
                                  label="From Topic Name"
                                  value="topicName"
                                ></v-radio>
                              </v-col>
                              <v-divider vertical v-if="mdAndUp"></v-divider>
                              <v-col cols="12" md="auto" class="text-center">
                                <v-radio
                                  label="From One PDF file"
                                  value="onePdf"
                                ></v-radio>
                                <v-file-input
                                  v-if="selectedOption == 'onePdf'"
                                  accept=".pdf"
                                  label="PDF input"
                                  prepend-icon="mdi-file-pdf-box"
                                  hide-details
                                  clearable
                                  @change="selectFile"
                                  style="width: 200px"
                                ></v-file-input>
                              </v-col>
                              <v-divider vertical v-if="mdAndUp"></v-divider>
                              <v-col cols="12" md="auto" class="text-center">
                                <v-radio
                                  label="From Library PDF files"
                                  value="libraryPdf"
                                ></v-radio>
                                <div
                                  class="d-flex flex-column"
                                  v-if="selectedOption == 'libraryPdf'"
                                >
                                  <v-chip
                                    v-for="(
                                      file, i
                                    ) in selectedTopicObject.documents"
                                    class="mr-2 ml-2 ma-1"
                                    prepend-icon="mdi-file-pdf-box"
                                  >
                                    {{ file.name }}
                                  </v-chip>
                                </div>
                              </v-col>
                            </v-row>
                          </v-radio-group>
                          <div class="mr-4"></div>
                          <div class="ml-4">
                            <v-divider class="mb-4"></v-divider>
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
                            <v-btn
                              color="primary"
                              :prepend-icon="
                                selectedOption == 'manual'
                                  ? 'mdi-pencil-box-outline'
                                  : 'mdi-star-four-points'
                              "
                              block
                              type="submit"
                              :loading="cardStore.status == 'pending'"
                              style="
                                border-top-left-radius: 0;
                                border-top-right-radius: 0;
                              "
                              @click="
                                () => {
                                  generateCards();
                                  isActive.value = false;
                                }
                              "
                            >
                              {{
                                selectedOption == "manual"
                                  ? "Add new question"
                                  : "Generate with Gemini"
                              }}
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
<style scoped>
.svg-background {
  background-image: url("../assets/background.svg"); /* Chemin vers votre fichier SVG */
  background-size: cover; /* Redimensionne le fond pour couvrir l'ensemble de l'élément */
  background-position: center; /* Centre le fond horizontalement et verticalement */
  background-repeat: no-repeat; /* Empêche la répétition du fond */
}
</style>
<style>
.v-skeleton-loader__chip {
  margin: unset !important;
}
</style>
<script lang="ts" setup>
import { Ref, ref } from "vue";
import { useCardStore } from "@/store/card";
import EditableCard from "@/components/EditableCard.vue";
import { watch } from "vue";
import type { Topic } from "@/store/card";
import BackToTop from "@/components/BackToTop.vue";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();

const cardStore = useCardStore();
cardStore.getTopics();

const selectedTopicId = ref("");
const selectedOption = ref("manual");
const numberOfCards = ref(1);
const selectedTopicObject = ref({
  id: "",
  name: "",
  cards: [],
  documents: [],
} as Topic);
const selectedFile: Ref<File | null> = ref(null);

watch(selectedTopicId, (newVal) => {
  if (newVal == "new") {
    selectedTopicObject.value = { name: "", cards: [], documents: [] };
    return;
  }
  if (newVal != "") {
    selectedTopicObject.value = JSON.parse(
      JSON.stringify(cardStore.topics.find((topic) => topic.id == newVal))
    );
    cardStore.getTopicDocuments(newVal).then((files) => {
      selectedTopicObject.value.documents = files;
    });
  }
});

const upload = ref(null as HTMLInputElement | null);

const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (const file of target.files as any) {
      selectedTopicObject.value.documents?.push({
        name: file.name,
        file: file,
      });
    }
  }
};

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
  switch (selectedOption.value) {
    case "manual":
      for (let i = 0; i < numberOfCards.value; i++) addNewQuestion();
      break;
    case "topicName":
      const cards = await cardStore.generateCardsFromTopicName(
        selectedTopicObject.value.name,
        numberOfCards.value
      );
      console.log(cards);
      for (const card of cards) {
        selectedTopicObject.value.cards.push(card);
      }
      break;
    case "onePdf":
      if (selectedFile.value) {
        const cards = await cardStore.generateCardsFromOneFile(
          selectedFile.value,
          numberOfCards.value
        );
        for (const card of cards) {
          selectedTopicObject.value.cards.push(card);
        }
      }
      break;
    case "libraryPdf":
      if (selectedTopicObject.value.corpus_id) {
        const cards = await cardStore.generateCardsFromCorpus(
          selectedTopicObject.value.corpus_id,
          numberOfCards.value
        );
        for (const card of cards) {
          selectedTopicObject.value.cards.push(card);
        }
      }
      break;
  }
};
</script>
