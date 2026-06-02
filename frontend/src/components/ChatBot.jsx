import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

export default function ChatBot() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Absolute Foundation! Ask me about courses, admissions, scholarships, branches, IIT-JEE, NEET, and Foundation programs."
    }
  ]);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userText = message;

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    setMessage("");
    setLoading(true);

    try {

      const response = await axios.post(
        "https://muthuraja18-chatbot-institute.hf.space/api/chat",
        {
          message: userText
        }
      );

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply
        }
      ]);

    } catch {

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to server."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="container">

      <div className="header">
        <h1>Absolute Foundation AI</h1>
        <p>Your Official Institute Assistant</p>
      </div>

      <div className="chat-area">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.sender === "user"
                ? "user-msg"
                : "bot-msg"
            }
          >
            {msg.text}
          </div>

        ))}

        {loading && (
          <div className="bot-msg">
            Typing...
          </div>
        )}

        <div ref={bottomRef}></div>

      </div>

      <div className="input-area">

        <input
          value={message}
          placeholder="Ask about admissions, courses, scholarships..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}