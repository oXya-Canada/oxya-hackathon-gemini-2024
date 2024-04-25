<template>
  <v-dialog v-model="open" width="700" activator="parent">
    <v-card>
      <v-card-title style="margin-bottom: 30px" class="title">
        What is your request ?
      </v-card-title>
      <v-text-field
        v-model="titleRequest"
        label="Title"
        hide-details
        class="textField"
        style="margin-bottom: 20px"
        density="compact"
      >
      </v-text-field>
      <v-select
        :label="'Subject'"
        :items="subject"
        v-model="label"
        item-title="text"
        item-value="value"
        density="compact"
        class="textField"
        style="margin-bottom: 15px"
        persistent-hint
        :hint="foundHint()"
        ><template v-slot:item="{ item, index, props }">
          <v-list-item
            :key="(props.key as any)"
            :value="props.value"
            :title="(props.title as any)"
            :onClick="(props.onClick as any)"
          >
          </v-list-item> </template
      ></v-select>
      <v-textarea
        v-model="commentaire"
        label="Comments"
        hide-details
        class="textField"
        style="margin-bottom: 20px; height: auto"
        single-line
        density="compact"
      ></v-textarea>

      <v-card-actions class="button">
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" @click="closeIssue()">Cancel</v-btn>
        <v-btn color="blue-darken-1" @click="sendIssue()">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import IssueService from "@/services/IssueService";

const titleRequest = ref("");
const commentaire = ref("");
const label = ref("");

const open = ref(false);

const subject = [
  {
    text: "Signalement d'un bug",
    value: "bug",
  },
  {
    text: "Ajouter une nouvelle fonctionnalité",
    value: "feature",
  },
  {
    text: "Modification d'une option déjà existante",
    value: "enhancement",
  },
  {
    text: "Autre",
    value: "question",
  },
] as any;

const props = defineProps(["dialog", "closeDialog"]);

async function closeIssue() {
  titleRequest.value = "";
  commentaire.value = "";
  label.value = "";
  open.value = false;
}
async function sendIssue() {
  await IssueService.sendIssueGit(
    titleRequest.value,
    commentaire.value,
    label.value
  );
  titleRequest.value = "";
  commentaire.value = "";
  label.value = "";
  open.value = false;
}

function foundHint() {
  if (label.value == "bug") {
    return "Veuillez décrire précisement comment reproduire le bug";
  } else if (label.value == "feature") {
    return "Veuillez décrire précisement la fonctionnalité que vous souhaitez ajouter";
  } else if (label.value == "enhancement") {
    return "Veuillez décrire précisement la modification que vous souhaitez apporter";
  } else if (label.value == "question") {
    return "Veuillez décrire précisement votre demande";
  }
}
</script>

<style>
.textField {
  width: 90%;
  margin-left: 5%;
}
.button {
  margin-left: 20px;
}
.title {
  margin-left: 20px;
  margin-top: 10px;
}
</style>
