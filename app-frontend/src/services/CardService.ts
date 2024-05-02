import axios from "axios";
import { SERVER_URL } from "@/utils/constants";
import { Topic } from "@/store/card";

class CardService {
  async getTopics() {
    return await (
      await axios.get(`${SERVER_URL}/api/topics`)
    ).data.data;
  }

  async saveTopic(topic: Topic) {
    const formData = new FormData();
    console.log(topic);
    if (topic.documents) {
      for (const document of topic.documents) {
        if (document.file) formData.append("pdfs", document.file);
      }
    }
    formData.append("topic", JSON.stringify(topic));
    console.log(formData);
    return await (
      await axios.putForm(`${SERVER_URL}/api/topics`, formData)
    ).data.data;
  }

  async deleteTopic(topicId: string) {
    return await (
      await axios.delete(`${SERVER_URL}/api/topics/${topicId}`)
    ).data.data;
  }

  async getCards(topic: string) {
    return await (
      await axios.get(`${SERVER_URL}/api/topics/${topic}/cards`)
    ).data.data;
  }

  async getTopicDocuments(topicId: string) {
    return await (
      await axios.get(`${SERVER_URL}/api/topics/${topicId}/documents`)
    ).data.data;
  }
}

export default new CardService();
