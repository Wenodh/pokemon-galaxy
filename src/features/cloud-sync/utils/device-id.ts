const DEVICE_ID_KEY = "pokemon-galaxy-device-id";

export const getDeviceId = (): string => {
  if (typeof window === "undefined") return "server";

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
};
