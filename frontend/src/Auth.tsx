import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageManager } from "./GlobalMessage";

interface LoginResponse {
  token: string;
}

export default function Auth(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post<LoginResponse>(
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

        const loginResponse = await axios.post<LoginResponse>(
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
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Pokédex connection error";
      MessageManager.showMessage("error", errorMsg);
    }
  };

  const toggleAuthMode = (): void => {
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your secret password..."
              className="w-full p-3 sm:p-4 pr-12 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 outline-none transition-colors text-sm sm:text-base"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12c2.126 5.228 7.343 9 13.066 9 .993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c5.722 0 10.939 3.772 13.063 9a10.477 10.477 0 01-2.045 3.777M15.75 9.75L9.75 15.75M7.5 7.5L15 15"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5C7.30558 4.5 3.73101 7.61344 2.45779 12c1.27322 4.38656 4.84779 7.5 9.54221 7.5 4.6944 0 8.269 -3.11344 9.5422 -7.5C20.269 7.61344 16.6944 4.5 12 4.5ZM12 16.5c-2.49264 0 -4.5 -2.00736 -4.5 -4.5c0 -2.49264 2.00736 -4.5 4.5 -4.5c2.4926 0 4.5 2.00736 4.5 4.5C16.5 14.4926 14.4926 16.5 12 16.5Z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 sm:p-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm sm:text-base"
          >
            {isLogin ? "Enter Pokédex" : "Become a Researcher"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm sm:text-base">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleAuthMode}
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              {isLogin ? "Sign up here" : "Log in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
