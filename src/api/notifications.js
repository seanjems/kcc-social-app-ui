import apiClient from "./apiClient";

const endpointGetNotificationsForUser =
  "api/Notifications/GetNotificationsForUser";
const endpointUpdateNotificationStatus =
  "api/Notifications/PutNotificationAsRead/";

const tryGetNotificationsForUser = () =>
  apiClient.get(endpointGetNotificationsForUser);
const tryUpdateNotificationStatus = (notificationId) =>
  apiClient.put(endpointUpdateNotificationStatus + notificationId);
export default {
  tryGetNotificationsForUser,
  tryUpdateNotificationStatus,
};
