import axios from "axios";
import { SERVER_URL } from "@/utils/constants";

class UserService {
  async getUser() {
    return await (
      await axios.get(`${SERVER_URL}/api/user`)
    ).data;
  }
}

export default new UserService();
