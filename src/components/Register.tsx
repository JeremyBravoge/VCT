import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!values.username) newErrors.username = "Username is required";
    if (!values.password) newErrors.password = "Password is required";
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "", // placeholder
          username: values.username,
          email: "", // placeholder
          password: values.password,
          role: "student", // default
          branch_id: null, // placeholder
          phone: "", // placeholder
          profile_image: null, // placeholder
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User registered successfully!");
        navigate("/login"); // redirect after success
      } else {
        setServerError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with image */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/IMG_0095.JPG"
          alt="School Portal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-6xl font-bold drop-shadow-lg">
          COHAT
        </h1>
      </div>

      {/* Right side with form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 shadow-lg">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.JPG"
              alt="School Logo"
              className="h-16 w-16 object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Fill in the details to register
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <p className="text-red-500 text-center text-sm">{serverError}</p>
            )}

            {/* Username */}
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-300"
                placeholder="ADMIN/STUDENT/ACC"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-300"
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-300"
                placeholder="Confirm your Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* Redirect to Login */}
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-yellow-600 hover:underline">
                Login
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-gray-600 text-xs text-center mt-6 pb-4">
            © 2025 Softwares International
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
