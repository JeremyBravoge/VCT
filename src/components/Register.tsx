import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
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
    const newErrors: {[key: string]: string} = {};
    if (!values.username) newErrors.username = "Username is required";
    if (!values.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) newErrors.email = "Email is invalid";
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
          email: values.email,
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
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="flex w-[900px] h-[550px] bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Left Panel (Image) */}
        <div className="flex-1 bg-black">
          <img
            src="/IMG_0095.JPG"
            alt="Register Image"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        {/* Right Panel (Form) */}
        <div className="flex-1 bg-[#132b2c] text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2">REGISTER</h2>
          <p className="text-[#cfd8dc] text-sm mb-8">Create your account</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Show server error */}
            {serverError && (
              <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
            )}
            {/* Username */}
            <label htmlFor="username" className="text-[#cfd8dc] text-sm mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              className="px-3 py-2 mb-5 border-none rounded text-black placeholder-gray-500 outline-none"
              placeholder="Username"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mb-2">{errors.username}</p>
            )}
            {/* Email */}
            <label htmlFor="email" className="text-[#cfd8dc] text-sm mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="px-3 py-2 mb-5 border-none rounded text-black placeholder-gray-500 outline-none"
              placeholder="Email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}
            {/* Password */}
            <label htmlFor="password" className="text-[#cfd8dc] text-sm mb-1">Password</label>
            <div className="relative mb-5">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="px-3 py-2 w-full border-none rounded text-black placeholder-gray-500 outline-none"
                placeholder="Password"
                required
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
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
            {/* Confirm Password */}
            <label htmlFor="confirmPassword" className="text-[#cfd8dc] text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              className="px-3 py-2 mb-5 border-none rounded text-black placeholder-gray-500 outline-none"
              placeholder="Confirm Password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4caf50] text-white py-2 rounded cursor-pointer transition-colors hover:bg-[#45a049] border-none"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <Link to="/" className="text-[#cfd8dc] text-sm mt-3 no-underline hover:underline">Already have an account?</Link>
          <div className="mt-5 text-xs text-[#b0bec5] text-center">
            <Link to="#" className="text-[#b0bec5] no-underline hover:underline">Terms of use</Link>. <Link to="#" className="text-[#b0bec5] no-underline hover:underline">Privacy policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
