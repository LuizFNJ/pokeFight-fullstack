import { useEffect, useState } from "react";

class GlobalMessageManager {
  constructor() {
    this.listeners = [];
  }

  on(callback) {
    this.listeners.push(callback);
  }

  off(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  showMessage(type, text) {
    this.listeners.forEach((callback) => callback({ type, text }));
  }
}

export const MessageManager = new GlobalMessageManager();

export const GlobalMessage = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleShowMessage = (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3500);
    };

    MessageManager.on(handleShowMessage);

    return () => {
      MessageManager.off(handleShowMessage);
    };
  }, []);

  if (!message) return null;

  const typeStyles = {
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600",
    info: "bg-blue-600 border-blue-700",
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-[bounce_0.3s_ease-out]">
      <div
        className={`px-8 py-4 rounded-2xl shadow-2xl border text-white font-bold text-lg flex items-center gap-3 ${typeStyles[message.type] || "bg-gray-800"}`}
      >
        {message.type === "error" && <span>⚠️</span>}
        {message.type === "success" && <span>✅</span>}
        {message.type === "info" && <span>ℹ️</span>}

        {message.text}
      </div>
    </div>
  );
};
