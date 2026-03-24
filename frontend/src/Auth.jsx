import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageManager } from "./GlobalMessage";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email,
            password,
          },
        );

        localStorage.setItem("token", response.data.token);
        MessageManager.showMessage("success", "Welcome back, Researcher!");
        navigate("/");
      } else {
        await axios.post("http://localhost:3000/api/auth/register", {
          email,
          password,
        });

        const loginResponse = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email,
            password,
          },
        );

        localStorage.setItem("token", loginResponse.data.token);
        MessageManager.showMessage(
          "success",
          "Account created successfully! You are now logged in.",
        );
        navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Pokédex connection error";
      MessageManager.showMessage("error", errorMsg);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-2 sm:p-4">
      <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl sm:text-4xl font-black text-red-500 text-center mb-6 sm:mb-8 drop-shadow-md">
          Poke<span className="text-white">Collector</span>
        </h2>
        <h3 className="text-lg sm:text-xl text-white font-bold mb-6 text-center">
          {isLogin ? "Access your Pokédex" : "Become a Researcher"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          <input
            type="email"
            placeholder="Your best email..."
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 outline-none transition-colors text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your secret password..."
              className="w-full p-3 sm:p-4 pr-12 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 outline-none transition-colors text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="bg-red-600 text-white font-bold p-3 sm:p-4 rounded-xl hover:bg-red-700 transition-colors mt-2 text-base sm:text-lg shadow-md active:scale-95"
          >
            {isLogin ? "Sign In" : "Sign Up and Sign In"}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
          {isLogin ? "Don't have an account yet? " : "Already have an account? "}
          <button
            onClick={toggleAuthMode}
            className="text-red-400 font-bold hover:text-red-300 hover:underline transition-colors"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
