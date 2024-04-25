import axios from "axios";
import { SERVER_URL } from "@/utils/constants";

class CardService {
  async getTopics() {
    return await (
      await axios.get(`${SERVER_URL}/api/topics`)
    ).data.data;
  }

  async saveTopic(topic: any) {
    return await (
      await axios.put(`${SERVER_URL}/api/topics`, topic)
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
}

export default new CardService();
