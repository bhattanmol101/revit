export const validateEmail = (value: string) => {
  return value.length < 3 ? "Please enter a valid email" : null;
};

export const validatePassword = (value: string) => {
  return value.length < 8 ? "Please enter atleast 8 characters" : null;
};

export const validateEmpty = (value: string) => {
  return value.length == 0 ? "This field is required" : null;
};

export const validateContact = (value: string) => {
  return value.length != 10 ? "Please enter a valid contact" : null;
};
