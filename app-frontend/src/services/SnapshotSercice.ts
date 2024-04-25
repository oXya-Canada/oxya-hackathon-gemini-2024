import axios from "axios";
import { SERVER_URL } from "@/utils/constants";

class SnapshotSercice {
  async getFromDisk(sourceDisk: string) {
    return await (
      await axios.get(`${SERVER_URL}/api/snapshots`, { params: { sourceDisk } })
    ).data.data;
  }
  async getSnapshotsSchedules(region: string, projectId: string) {
    return await (
      await axios.get(`${SERVER_URL}/api/snapshots/schedules`, {
        params: { region, projectId },
      })
    ).data.data;
  }
  async getAllSnapshotsSchedules() {
    return await (
      await axios.get(`${SERVER_URL}/api/snapshots/schedules`)
    ).data.data;
  }
}

export default new SnapshotSercice();
