// Utilities
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import LogService from "@/services/LogService";
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: "WAITING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  steps: Step[];
  percent: number;
  author: string;
  seen: boolean;
}

interface Step {
  id: string;
  title: string;
  message: {
    disk?: string;
    snapshot?: string;
    instance?: string;
    restore?: boolean;
    message?: string;
  };
  type: string;
  status: "WAITING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: useStorage("notifications", [] as Notification[]),
    notificationIdOpened: 0,
    status: "idle",
    // notifications: [] as Notification[],
  }),
  actions: {
    async addNotification(notification: Notification) {
      // push notification to notifications if not already in notifications else update notification
      const index = this.notifications.findIndex(
        (notif) => notif.id == notification.id
      );
      if (index == -1) {
        notification.seen = false;
        this.notifications.push(notification);
      } else {
        const seen = this.notifications[index].seen || false;
        this.notifications[index] = notification;
        this.notifications[index].seen = seen;
      }
    },
    async setNotificationIdOpened(notificationIdOpened: number) {
      this.notificationIdOpened = notificationIdOpened;
    },
    async getAll() {
      this.status = "pending";
      try {
        const notifications = await LogService.getNotifications();
        for (let notification of notifications) {
          this.addNotification(notification);
        }
        //remove notifications older than 12 month
        const date = new Date();
        date.setMonth(date.getMonth() - 12);
        const notificationsToRemove = this.notifications.filter(
          (notification) => new Date(notification.createdAt) < date
        );
        for (let notification of notificationsToRemove) {
          const index = this.notifications.findIndex(
            (notif) => notif.id == notification.id
          );
          if (index != -1) {
            this.notifications.splice(index, 1);
          }
        }
        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
    setAllNotificationsSeen() {
      for (let notification of this.notifications) {
        notification.seen = true;
      }
    },
  },
  getters: {
    getOpenedNotificationId(): number {
      return this.notificationIdOpened;
    },
    getNotificationsReverseChronological(): Notification[] {
      return this.notifications.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        else if (a.createdAt < b.createdAt) return 1;
        else return 0;
      });
    },
    getNotificationById(): (id: number) => Notification | undefined {
      return (id: number) => this.notifications.find((notif) => notif.id == id);
    },

    getLastStepsRestoreSeperatedFromDiskByNotificationId(): (
      id: number
    ) => { disk: string; steps: Step[] }[] | undefined {
      return (id: number) => {
        const notification = this.getNotificationById(id);
        if (notification == undefined) return undefined;
        if (!notification.steps) return undefined;
        if (notification.steps?.length == 0) return undefined;
        const stepsSeperatedFromDisk = [] as { disk: string; steps: Step[] }[];
        for (let step of notification.steps) {
          if (typeof step.message != "string" && step.message.disk == undefined)
            continue;
          if (typeof step.message != "string" && step.message.restore == false)
            continue;
          const index = stepsSeperatedFromDisk.findIndex(
            (stepSeperatedFromDisk) =>
              stepSeperatedFromDisk.disk == step.message.disk
          );
          if (index == -1 && step.message.disk != undefined) {
            stepsSeperatedFromDisk.push({
              disk: step.message.disk,
              steps: [step],
            });
          } else {
            stepsSeperatedFromDisk[index].steps.push(step);
          }
        }
        return stepsSeperatedFromDisk;
      };
    },
    getLastStepsNonRestoreSeperatedFromDiskByNotificationId(): (
      id: number
    ) => { disk: string; steps: Step[] }[] | undefined {
      return (id: number) => {
        const notification = this.getNotificationById(id);
        if (notification == undefined) return undefined;
        if (!notification.steps) return undefined;
        if (notification.steps?.length == 0) return undefined;
        const stepsSeperatedFromDisk = [] as {
          disk: string;
          steps: Step[];
        }[];
        for (let step of notification.steps) {
          if (step.message.disk == undefined) continue;
          if (step.message.restore == undefined || step.message.restore == true)
            continue;
          const index = stepsSeperatedFromDisk.findIndex(
            (stepSeperatedFromDisk) =>
              stepSeperatedFromDisk.disk == step.message.disk
          );
          if (index == -1) {
            stepsSeperatedFromDisk.push({
              disk: step.message.disk,
              steps: [step],
            });
          } else {
            stepsSeperatedFromDisk[index].steps.push(step);
          }
        }
        return stepsSeperatedFromDisk;
      };
    },
    // getStepsRestoreFromDiskByNotificationId(id: number): Step[] | undefined {
    //   const notification = this.getNotificationById(id);
    //   if (notification == undefined) return undefined;
    //   const steps = notification.steps.filter(
    //     (step) =>
    //       typeof step.message != "string" && step.message.restore == true
    //   );
    //   return steps;
    // },
    // getStepsNonRestoreFromDiskByNotificationId(id: number): Step[] | undefined {
    //   const notification = this.getNotificationById(id);
    //   if (notification == undefined) return undefined;
    //   const steps = notification.steps.filter(
    //     (step) =>
    //       typeof step.message != "string" && step.message.restore == false
    //   );
    //   return steps;
    // },
    getLastNotification(): Notification | undefined {
      return this.getNotificationsReverseChronological[0];
    },
    getLastStepFromLastNotification(): Step | undefined {
      if (this.notifications.length == 0) return undefined;
      const lastNotification =
        this.notifications[this.notifications.length - 1];
      if (lastNotification.steps.length == 0) return undefined;
      return lastNotification.steps[lastNotification.steps.length - 1];
    },
    getLastStepsFromLastNotification(): Step[] | undefined {
      if (this.notifications.length == 0) return undefined;
      const lastNotification =
        this.notifications[this.notifications.length - 1];
      if (lastNotification.steps.length == 0) return undefined;
      return lastNotification.steps;
    },
    getLastStepsRestoreSeperatedFromDisk():
      | { disk: string; steps: Step[] }[]
      | undefined {
      if (this.notifications.length == 0) return undefined;
      const lastNotification =
        this.notifications[this.notifications.length - 1];
      if (lastNotification.steps.length == 0) return undefined;
      const stepsSeperatedFromDisk = [] as { disk: string; steps: Step[] }[];
      for (let step of lastNotification.steps) {
        if (typeof step.message != "string" && step.message.disk == undefined)
          continue;
        if (typeof step.message != "string" && step.message.restore == false)
          continue;
        const index = stepsSeperatedFromDisk.findIndex(
          (stepSeperatedFromDisk) =>
            stepSeperatedFromDisk.disk == step.message.disk
        );
        if (index == -1 && step.message.disk != undefined) {
          stepsSeperatedFromDisk.push({
            disk: step.message.disk,
            steps: [step],
          });
        } else {
          stepsSeperatedFromDisk[index].steps.push(step);
        }
      }
      return stepsSeperatedFromDisk;
    },
    getLastStepsNonRestoreSeperatedFromDisk():
      | { disk: string; steps: Step[] }[]
      | undefined {
      if (this.notifications.length == 0) return undefined;
      const lastNotification =
        this.notifications[this.notifications.length - 1];
      if (lastNotification.steps.length == 0) return undefined;
      const stepsSeperatedFromDisk = [] as { disk: string; steps: Step[] }[];
      for (let step of lastNotification.steps) {
        if (step.message.disk == undefined) continue;
        if (step.message.restore == undefined || step.message.restore == true)
          continue;
        const index = stepsSeperatedFromDisk.findIndex(
          (stepSeperatedFromDisk) =>
            stepSeperatedFromDisk.disk == step.message.disk
        );
        if (index == -1) {
          stepsSeperatedFromDisk.push({
            disk: step.message.disk,
            steps: [step],
          });
        } else {
          stepsSeperatedFromDisk[index].steps.push(step);
        }
      }
      return stepsSeperatedFromDisk;
    },
    getNumberOfUnseenNotifications(): number {
      console.log("getNumberOfUnseenNotifications");
      return this.notifications.filter((notif) => notif.seen == false).length;
    },
    // getRunningNotifications(): Notification[] {
    //   return this.notifications.filter(
    //     (notification) => notification.status == "RUNNING"
    //   );
    // },
  },
});
