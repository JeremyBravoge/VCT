import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { validateLogin } from "./LoginValidation";
import { useAuth } from "../AuthContext";
import { usersApi } from "../utils/api";

// Types
interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    token: string;
    user?: {
      id: string;
      username: string;
      email?: string;
      role?: string;
    };
  };
  token?: string;
  accessToken?: string;
  message?: string;
  error?: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Form state
  const [values, setValues] = useState<LoginFormValues>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  // Load remembered username if exists
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("remembered_username");
    if (rememberedUsername) {
      setValues((prev) => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true,
      }));
    }
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => setServerError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field
    if (errors[name as keyof LoginErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate and submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    // Client-side validation
    const validationErrors = validateLogin({
      username: values.username,
      password: values.password,
    });

    if (validationErrors.username || validationErrors.password) {
      setErrors(validationErrors as LoginErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Make login request
      const payload = {
        username: values.username,
        password: values.password,
      };

      const response = (await usersApi.login(payload)) as ApiResponse;

      // Extract token from various possible response formats
      const token =
        response?.data?.token ??
        response?.token ??
        response?.accessToken;

      // Check for errors
      if (response?.success === false || !token) {
        const errorMessage =
          response?.error ||
          response?.message ||
          "Invalid username or password";
        setServerError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Success
      setSuccessMessage("✓ Login successful! Redirecting...");

      // Handle remember me
      if (values.rememberMe) {
        localStorage.setItem("remembered_username", values.username);
      } else {
        localStorage.removeItem("remembered_username");
      }

      // Save token and redirect
      login(token as string);

      // Small delay for better UX
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from);
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection and try again."
      );
      setIsLoading(false);
    }
  };

  // Handle form keypress
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-4xl mx-4 lg:mx-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Panel - Image Section */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Image with overlay */}
            <div className="absolute inset-0">
              <img
                src="comp teaching (1).jpg"
                alt="School Teaching"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 text-center text-white px-8">
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-blue-100 text-lg mb-8">
                K-SMS School Management System
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Manage students and teachers</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Track attendance and performance</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Generate comprehensive reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="flex flex-col justify-center p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Admin Login
              </h1>
              <p className="text-slate-600">
                Sign in to access the school management system
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-sm">{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 text-sm">
                    Login Failed
                  </p>
                  <p className="text-red-700 text-sm mt-1">{serverError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                    errors.username
                      ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  } focus:outline-none focus:ring-4 bg-white text-slate-900 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
                  autoComplete="username"
                  required
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                      errors.password
                        ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    } focus:outline-none focus:ring-4 bg-white text-slate-900 placeholder:text-slate-400 pr-12 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500">
                  New to K-SMS?
                </span>
              </div>
            </div>

            {/* Register & Links */}
            <div className="space-y-3">
              <Link
                to="/register"
                className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-200 text-center block"
              >
                Create Account
              </Link>

              <div className="text-center text-xs text-slate-500 space-y-1">
                <div>
                  <Link
                    to="/terms"
                    className="text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Terms of use
                  </Link>
                  {" • "}
                  <Link
                    to="/privacy"
                    className="text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Privacy policy
                  </Link>
                </div>
                <p className="text-slate-400">
                  © 2026 -College Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;