// Utilities
import { defineStore } from "pinia";
import GeminiService from "../services/GeminiService";
import { useNotificationStore } from "./notification";
import { useStorage } from "@vueuse/core";
import CardService from "@/services/CardService";

export interface Card {
  id?: string;
  question: string;
  answers: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

export interface Topic {
  id?: string;
  name: string;
  cards: Card[];
  corpus_id?: number;
  documents?: { id?: number; name: string; file?: File }[];
}

export const useCardStore = defineStore("card", {
  state: () => ({
    topics: [] as Topic[],
    cards: [] as Card[],
    status: "idle" as "idle" | "pending" | "succeeded" | "failed",
    statusDocuments: "idle" as "idle" | "pending" | "succeeded" | "failed",
  }),
  actions: {
    async generateCardsFromTopicName(
      certification: string,
      numberOfCards: number
    ) {
      this.status = "pending";
      try {
        // const response = await GeminiService.generateTrueFalseCards(
        //   certification,
        //   numberOfCards
        // );
        const response = await GeminiService.generateMultipleChoiceCards(
          certification,
          numberOfCards
        );
        console.log(response);
        try {
          this.cards = response;
          this.status = "succeeded";
          return response;
        } catch (error) {
          console.log(error);
        }
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async generateCardsFromOneFile(file: File, numberOfCards: number) {
      this.status = "pending";
      try {
        const response = await GeminiService.generateCardsFromFile(
          file,
          numberOfCards
        );
        console.log(response);
        try {
          this.cards = response;
          this.status = "succeeded";
          return response;
        } catch (error) {
          console.log(error);
        }
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async generateCardsFromCorpus(corpus_id: number, numberOfCards: number) {
      this.status = "pending";
      try {
        const response = await GeminiService.generateCardsFromCorpus(
          corpus_id,
          numberOfCards
        );
        console.log(response);
        try {
          this.cards = response;
          this.status = "succeeded";
          return response;
        } catch (error) {
          console.log(error);
        }
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async getTopics() {
      this.status = "pending";
      try {
        this.topics = await CardService.getTopics();
        this.topics.sort((a, b) => a.name.localeCompare(b.name));
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async getTopicDocuments(topicId: string) {
      this.statusDocuments = "pending";
      try {
        const topic = this.topics.find((t) => t.id === topicId);
        if (topic) {
          const documents = await CardService.getTopicDocuments(topicId);
          topic.documents = documents.map(
            (d: { id: number; name: string }) => ({
              id: d.id,
              name: d.name.split(".pdf.")[0] + ".pdf",
            })
          );
          this.statusDocuments = "succeeded";
          return topic.documents;
        }
        this.statusDocuments = "succeeded";
      } catch (error) {
        console.log(error);
        this.statusDocuments = "failed";
      }
    },
    async saveTopic(topic: Topic) {
      this.status = "pending";
      try {
        const { topicId, corpus_id } = await CardService.saveTopic(topic);
        //update the topics
        let isUpdate = false;
        this.topics = this.topics.map((t) => {
          if (t.id === topicId) {
            isUpdate = true;
            return { ...topic, id: topicId, corpus_id };
          }
          return t;
        });
        if (!isUpdate) {
          this.topics.push({ ...topic, id: topicId, corpus_id: corpus_id });
        }
        this.status = "succeeded";
        return topicId;
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },

    async deleteTopic(topicId: string) {
      this.status = "pending";
      try {
        await CardService.deleteTopic(topicId);
        this.topics = this.topics.filter((t) => t.id !== topicId);
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
  },
  getters: {},
});
