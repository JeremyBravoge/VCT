import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLogin } from "./LoginValidation";
import { useAuth } from "../AuthContext";
import { usersApi } from "../utils/api";

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
        setServerError("");

        const response = await usersApi.login(values);

        if (!response.success) {
          setServerError(response.error || "Login failed");
        } else {
          console.log("✅ Login successful:", response);

          // 👉 Save token in AuthContext
          login((response.data as any).token);

          // 👉 Redirect only on success
          navigate("/dashboard");
        }
      } catch {
        setServerError("Network error");
      }
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-red-6" style={{
    backgroundImage: "url('')",
    backgroundBlendMode: "overlay",
    backgroundColor: "rgba(0,0,0,0.5)",
  }}>
      <div className="flex w-[900px] h-[450px] bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Left Panel (Image) */}
        <div className="flex-1 bg-black" >
          <img
            src="comp teaching (1).jpg"
            alt="Login Image"
            className="w-full h-full object-cover opacity-50"  
                      
          />
        </div>
        {/* Right Panel (Form) */}
        <div className="flex-1 text-white p-10 flex flex-col justify-center" style={{backgroundColor: "rgba(39, 38, 38, 0.87)"}}>
          <h2 className="text-2xl font-semibold mb-2">ADMIN LOGIN</h2>
          <p className="text-[#cfd8dc] text-sm mb-8">Sign into your account</p>
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
            {/* Password */}
            <label htmlFor="password" className="text-[#cfd8dc] text-sm mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="px-3 py-2 mb-5 border-none rounded text-black placeholder-gray-500 outline-none"
              placeholder="Password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
            {/* Submit */}
            <button
              type="submit"
              className="bg-[#4caf50] text-white py-2 rounded cursor-pointer transition-colors hover:bg-[#45a049] border-none"
            >
              Login
            </button>
          </form>
          <Link to="#" className="text-[#cfd8dc] text-sm mt-3 no-underline hover:underline">Forgot password?</Link>
          <Link to="/register" className="text-[#cfd8dc] text-sm mt-1 no-underline hover:underline">Create account?</Link>
          <div className="mt-5 text-xs text-[#b0bec5] text-center">
            <Link to="#" className="text-[#b0bec5] no-underline hover:underline inline-block" style={{margin: "3px 0 0 4px"}}>Terms of use</Link>. <Link to="#" className="text-[#b0bec5] no-underline hover:underline">Privacy policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
