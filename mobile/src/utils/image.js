export const resolveImageSource = (value) => {
  if (!value) {
    return undefined;
  }

  return typeof value === "string" ? { uri: value } : value;
};
