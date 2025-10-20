import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLogin } from "./LoginValidation";
import { useAuth } from "../AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use AuthContext

  // form state
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ for spinner

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error while typing
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin(values);
    setErrors({
      username: validationErrors.username ?? "",
      password: validationErrors.password ?? "",
    });

    if (!validationErrors.username && !validationErrors.password) {
      try {
        setLoading(true);
        setServerError("");

        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(data.error || "Login failed");
        } else {
          console.log("✅ Login successful:", data);

          // 👉 Save token in AuthContext
          login(data.token);

          // 👉 Redirect only on success
          navigate("/dashboard");
        }
      } catch (error) {
        setServerError("Network error");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen flex" >
      {/* Left side with image */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/IMG_0095.JPG" // put image in public/ folder
          alt="School Portal"
          className="w-full h-50% object-cover"
        />
        {/* overlay for contrast */}
        <div className="absolute inset-0 bg-black/80"></div>
        {/* centered text */}
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-7xl font-bold drop-shadow-lg">
              COHAT
          </h1>

      </div>


      {/* Right side with login form */}
    <div className="flex flex-col justify-center items-center w-20% md:w-1/2 bg-white p-8 shadow-1g">
        <div className="w-full max-w-md bg-b shadow-lg rounded-2g p-8">
          {/* Logo */}
          <div className="flex justify-center mb-1">
            <img
              src="/logo.JPG"
              alt="School Logo"
              className="h-16 w-16 object-contain"
            />
          </div>

        <h2 className="text-2xl font-bold text-center mb-1">Hi, welcome back</h2>
        <p className="text-sm text-gray-500 mt-2 text-center ">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-9">
            {/* Show server error */}
            {serverError && (
              <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
            )}
            {/* Username */}
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white bg-red-800  py-2 rounded-lg hover:bg-yellow-600 "
            >
              Login
            </button>

            {/* Forgot Password + Signup */}
            <div className="flex justify-between text-sm mt-4">
              <Link to="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </div>
          </form>
          {/* Footer */} 
          <p className="text-gray-600 text-xs text-center mt-6 pb-4">© 2025 Softwares International</p>

        </div>
      </div>
    </div>
  );
}

export default Login;
