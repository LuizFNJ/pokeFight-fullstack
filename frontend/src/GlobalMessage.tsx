import { useEffect, useState } from "react";

interface Message {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

class GlobalMessageManager {
  private listeners: ((msg: Message) => void)[] = [];

  on(callback: (msg: Message) => void): void {
    this.listeners.push(callback);
  }

  off(callback: (msg: Message) => void): void {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  showMessage(type: "success" | "error" | "warning" | "info", text: string): void {
    this.listeners.forEach((callback) => callback({ type, text }));
  }
}

export const MessageManager = new GlobalMessageManager();

export const GlobalMessage = (): JSX.Element | null => {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const handleShowMessage = (msg: Message): void => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3500);
    };

    MessageManager.on(handleShowMessage);

    return () => {
      MessageManager.off(handleShowMessage);
    };
  }, []);

  if (!message) return null;

  const typeStyles: Record<string, string> = {
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600",
    info: "bg-blue-600 border-blue-700",
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-[bounce_0.3s_ease-out]">
      <div
        className={`${typeStyles[message.type]} text-white border px-6 py-4 rounded-lg shadow-lg animate-pulse`}
      >
        <p className="font-semibold">{message.text}</p>
      </div>
    </div>
  );
};
