// Utilities
import { defineStore } from "pinia";
import SnapshotSercice from "../services/SnapshotSercice";

export const useSnapshotStore = defineStore("snapshot", {
  state: () => ({
    snapshots: [] as any[],
    snapshotSchedules: [] as any[],
    status: "idle",
  }),
  actions: {
    async getFromDisk(sourceDisk: string) {
      this.status = "pending";
      try {
        const responseSnapshots = await SnapshotSercice.getFromDisk(sourceDisk);
        // push responseSnapshots to snapshots if not already in snapshots
        for (let snapshot of responseSnapshots) {
          if (
            this.snapshots.findIndex((snap) => snap.id == snapshot.id) == -1
          ) {
            this.snapshots.push(snapshot);
          }
        }
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async getAllSnapshotsSchedules() {
      this.status = "pending";
      try {
        this.snapshotSchedules =
          await SnapshotSercice.getAllSnapshotsSchedules();
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    async getSnapshotsSchedules(region: string, projectId: string) {
      this.status = "pending";
      try {
        this.snapshotSchedules = await SnapshotSercice.getSnapshotsSchedules(
          region,
          projectId
        );
        this.snapshotSchedules.unshift({ name: "None", selfLink: null });
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
  },
});
