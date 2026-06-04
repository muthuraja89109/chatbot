import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

export default function ChatBot() {

  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [awaitingName, setAwaitingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Absolute Foundation!"
    }
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const formatBotMessage = (text) => {

    let formatted = text;

    formatted = formatted.replaceAll("*", "");

    formatted = formatted.replace(
      "Absolute Foundation offers:",
      "📚 Courses Available\n"
    );

    formatted = formatted.replace(
      "11th - 12th Programs",
      "\n🎓 11th–12th Programs\n"
    );

    formatted = formatted.replace(
      "Foundation Programs",
      "\n📚 Foundation Programs\n"
    );

    formatted = formatted.replace(
      "Special Programs",
      "\n🚀 Special Programs\n"
    );

    return formatted;
  };

  const askBackend = async (question) => {

    setLoading(true);

    try {

      const response = await axios.post(
        "https://muthuraja18-chatbot-institute.hf.space/api/chat",
        {
          message: question
        }
      );

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: formatBotMessage(
            response.data.reply
          )
        }
      ]);

    } catch {

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text:
            "⚠️ Unable to connect to Absolute Foundation server."
        }
      ]);
    }

    setLoading(false);
  };

  const handleQuickQuestion = async (question) => {

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: question
      }
    ]);

    await askBackend(question);
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userText = message.trim();

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    setMessage("");

    const greetings = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening"
    ];

    if (greetings.includes(userText.toLowerCase())) {

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `👋 Good to see you!

I'm Absolute Foundation's Academic Assistant.

May I know your name?`
        }
      ]);

      setAwaitingName(true);
      return;
    }

    if (awaitingName) {

      setUserName(userText);

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `😊 Welcome, ${userText}!

How would you like me to assist you today?

━━━━━━━━━━━━━━━━━━

📚 Courses

🏆 OATH Scholarship

🏫 Branch Locations

📝 Admissions

💼 Careers

❓ Frequently Asked Questions

━━━━━━━━━━━━━━━━━━

You can click a menu option or ask a question directly.`
        }
      ]);

      setAwaitingName(false);
      return;
    }

    await askBackend(userText);
  };

  return (
    <div className="app-wrapper">

      <div className="container">

        <div className="header">
          <h1>Absolute Foundation AI</h1>
          <p>Your Academic Counselor</p>
        </div>

        {userName && (
          <div className="menu-grid">

            <button onClick={() =>
              handleQuickQuestion(
                "What courses are available?"
              )
            }>
              📚 Courses
            </button>

            <button onClick={() =>
              handleQuickQuestion(
                "What is OATH Scholarship?"
              )
            }>
              🏆 OATH
            </button>

            <button onClick={() =>
              handleQuickQuestion(
                "Where are the branches located?"
              )
            }>
              🏫 Branches
            </button>

            <button onClick={() =>
              handleQuickQuestion(
                "How can I get admission?"
              )
            }>
              📝 Admissions
            </button>

            <button onClick={() =>
              handleQuickQuestion(
                "Career opportunities"
              )
            }>
              💼 Careers
            </button>

            <button onClick={() =>
              handleQuickQuestion(
                "Frequently Asked Questions"
              )
            }>
              ❓ FAQ
            </button>

          </div>
        )}

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
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

        <div className="input-area">

          <input
            value={message}
            placeholder="Ask about courses, admissions, scholarships..."
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

    </div>
  );
}
