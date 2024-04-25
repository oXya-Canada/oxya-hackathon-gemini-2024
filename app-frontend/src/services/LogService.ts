import axios from "axios";
import { SERVER_URL } from "@/utils/constants";

class LogService {
  async getNotifications() {
    return await (
      await axios.get(`${SERVER_URL}/api/logs/notifications`)
    ).data.data;
  }
}

export default new LogService();
