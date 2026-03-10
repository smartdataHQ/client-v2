export const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.toLowerCase().slice(1) : "";
