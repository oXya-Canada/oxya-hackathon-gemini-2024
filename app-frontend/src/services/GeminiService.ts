import axios from "axios";
import { SERVER_URL } from "@/utils/constants";
class GeminiService {
  async generateTrueFalseCards(certification: string, numberOfCards: number) {
    return await (
      await axios.get(`${SERVER_URL}/api/cards/generate`, {
        params: {
          certification,
          numberOfCards,
        },
      })
    ).data.data;
  }

  async generateMultipleChoiceCards(
    certification: string,
    numberOfCards: number
  ) {
    return await (
      await axios.get(`${SERVER_URL}/api/cards/generate`, {
        params: {
          certification,
          numberOfCards,
        },
      })
    ).data.data;
  }

  async generateCardsFromFile(file: File, numberOfCards: number) {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("numberOfCards", numberOfCards.toString());
    return await (
      await axios.post(`${SERVER_URL}/api/cards/generateFromPdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data.data;
  }
}

export default new GeminiService();
