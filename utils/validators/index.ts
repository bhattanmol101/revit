export const validateEmail = (value: string) => {
  return value.length < 3 ? "Please enter a valid email" : null;
};

export const validatePassword = (value: string) => {
  return value.length < 8 ? "Please enter atleast 8 characters" : null;
};
