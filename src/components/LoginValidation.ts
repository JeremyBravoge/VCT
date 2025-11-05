interface LoginFormErrors {
  username?: string;
  password?: string;
}

export const validateLogin = (values: { username: string; password: string }): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!values.username || values.username.trim() === "") {
    errors.username = "Username is required";
  }

  if (!values.password || values.password.trim() === "") {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
