// src/utils/loginValidation.ts

export interface LoginValues {
  username: string;
  password: string;
}

export interface LoginErrors {
  username?: string;
  password?: string;
}

/**
 * Validate login form values.
 * Returns an object with error messages (if any).
 */
export function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
