import moment from "moment";

export const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const formatRelativeTime = (timestamp: string): string => {
  const parsed = moment(timestamp);

  if (!parsed.isValid()) {
    return timestamp;
  }

  return parsed.fromNow();
};

export default (timestamp: string, format?: string) => {
  const result = moment(timestamp).format(format || DEFAULT_TIME_FORMAT);

  if (result === "Invalid date") {
    return timestamp;
  }

  return result;
};
