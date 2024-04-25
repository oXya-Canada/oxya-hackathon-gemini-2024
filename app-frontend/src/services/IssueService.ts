import { SERVER_URL } from "@/utils/constants";
import axios from "axios";

class IssueService {
  async sendIssueGit(title: any, body: any, label: any) {
    console.log(title, label);
    return await (
      await axios.post(`${SERVER_URL}/api/issues`, {
        title,
        label,
        body,
      })
    ).data.data;
  }
}

export default new IssueService();
