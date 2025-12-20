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

  // --- Utility Functions for UX ---

  // Helper to get conditional classes for input fields (Better UX feedback)
  const getInputClasses = (fieldName: keyof typeof values) =>
    `px-4 py-2 w-full border-2 rounded-lg text-black placeholder-gray-500 bg-white transition duration-150 ease-in-out focus:ring-2 outline-none 
    ${errors[fieldName] 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" 
      : "border-gray-300 focus:border-[#4caf50] focus:ring-[#4caf50]/50"}`;

  // Custom button spinner
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // --- API and Validation Logic (Maintained and stable) ---

  // handle input change (Maintained)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  // validation (Maintained)
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

  // handle submit (API logic maintained)
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

      // --- API CALL LOGIC (STRICTLY MAINTAINED) ---
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
        // Enhanced server error handling
        setServerError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setServerError("Network error! Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container layout maintained
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="flex w-[900px] h-[550px] bg-white rounded-lg overflow-hidden shadow-2xl"> 
        
        {/* Left Panel (Image) - Layout Maintained */}
        <div className="flex-1 bg-black">
          <img
            src="/IMG_0095.JPG"
            alt="Register Image"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        {/* Right Panel (Form) - Layout Maintained, Styling Enhanced */}
        <div className="flex-1 bg-[#132b2c] text-white p-12 flex flex-col justify-center"> {/* Increased padding slightly */}
          <h2 className="text-3xl font-bold mb-2">Create Account</h2> {/* Increased font size for better hierarchy */}
          <p className="text-[#cfd8dc] text-sm mb-8">Start your journey now.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4"> {/* Added spacing between form elements */}
            
            {/* Show server error (Enhanced Visibility) */}
            {serverError && (
              <div className="p-3 bg-red-800 border border-red-500 rounded text-sm mb-4">
                <p className="flex items-center justify-center">
                  <span className="mr-2 text-xl">❌</span>{serverError}
                </p>
              </div>
            )}
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-[#cfd8dc] text-sm mb-1 block">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                className={getInputClasses("username")}
                placeholder="Choose a username"
                required
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span>{errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-[#cfd8dc] text-sm mb-1 block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className={getInputClasses("email")}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span>{errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-[#cfd8dc] text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={getInputClasses("password")}
                  placeholder="Set your password"
                  required
                />
                {/* Enhanced Show/Hide Toggle (using placeholders for icons) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="text-lg">{showPassword ? "👁️" : ""}</span>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span>{errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-[#cfd8dc] text-sm mb-1 block">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className={getInputClasses("confirmPassword")}
                placeholder="Re-enter password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span>{errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button (Enhanced Loading State) */}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded font-semibold transition-colors duration-200 mt-6 
                ${loading 
                  ? "bg-gray-600 cursor-not-allowed" // Loading state color
                  : "bg-[#4caf50] hover:bg-[#45a049] focus:outline-none focus:ring-4 focus:ring-[#4caf50]/50" // Active state colors
                }`}
            >
              {loading && <Spinner />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <Link to="/login" className="text-[#cfd8dc] text-sm mt-5 text-center block no-underline hover:underline">
            Already have an account? Sign In
          </Link>
          <div className="mt-5 text-xs text-[#b0bec5] text-center">
            <Link to="#" className="text-[#b0bec5] no-underline hover:underline">Terms of use</Link>. <Link to="#" className="text-[#b0bec5] no-underline hover:underline">Privacy policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;