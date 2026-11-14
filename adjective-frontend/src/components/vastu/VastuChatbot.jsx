"use client";

import { useState, useEffect, useRef } from "react";

const VastuChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
 const [position, setPosition] = useState({
  x: 0,
  y: 0,
});
const [isDragging, setIsDragging] = useState(false);
const hasMovedRef = useRef(false);

const dragStartRef = useRef({
  mouseX: 0,
  mouseY: 0,
  startX: 0,
  startY: 0,
});
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste 🙏 I'm Adjective Vastu AI. Ask me anything about Vastu & your home.",
    },
  ]);
  const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const handleSend = () => {
  if (!message.trim()) return;

  const userQuestion = message.trim();
  const lowerQuestion = userQuestion.toLowerCase();

  // After 2 questions, show login/signup
  if (questionCount >= 2) {
    setShowAuth(true);
    setMessage("");
    return;
  }

  let botReply = "";

  // Greeting
  if (
    lowerQuestion === "hi" ||
    lowerQuestion === "hello" ||
    lowerQuestion === "hey" ||
    lowerQuestion.includes("hi there") ||
    lowerQuestion.includes("hello there")
  ) {
    botReply = "Hello! How can I help you? 🙏";
  }

  // Thank you
  else if (
    lowerQuestion === "thank you" ||
    lowerQuestion === "thanks" ||
    lowerQuestion.includes("thank you") ||
    lowerQuestion.includes("thanks")
  ) {
    botReply =
      "You're very welcome! Let me know if you need anything else. 😊";
  }

  // Normal question
  else {
    botReply =
      "Thank you for your question 🙏 I'm preparing your Vastu guidance.";
  }

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userQuestion,
    },
    {
      sender: "bot",
      text: botReply,
    },
  ]);

  // Count only actual questions
  if (
    !(
      lowerQuestion === "hi" ||
      lowerQuestion === "hello" ||
      lowerQuestion === "hey" ||
      lowerQuestion.includes("hi there") ||
      lowerQuestion.includes("hello there") ||
      lowerQuestion.includes("thank you") ||
      lowerQuestion.includes("thanks")
    )
  ) {
    setQuestionCount((prev) => prev + 1);
  }

  setMessage("");
};

const handlePointerDown = (e) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;

  hasMovedRef.current = false;

  dragStartRef.current = {
    mouseX: e.clientX,
    mouseY: e.clientY,
    startX: position.x,
    startY: position.y,
  };

  setIsDragging(true);
};

const handlePointerMove = (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - dragStartRef.current.mouseX;
  const deltaY = e.clientY - dragStartRef.current.mouseY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    hasMovedRef.current = true;
  }

  setPosition({
    x: dragStartRef.current.startX + deltaX,
    y: dragStartRef.current.startY + deltaY,
  });
};

const handlePointerUp = (e) => {
  // If user only clicked/tapped
  if (!hasMovedRef.current) {
    setIsOpen(true);
  }

  setIsDragging(false);
};
const startListening = () => {
  if (
    typeof window === "undefined" ||
    (!window.SpeechRecognition &&
      !window.webkitSpeechRecognition)
  ) {
    alert("Voice input is not supported in this browser.");
    return;
  }

  // If already listening, stop
  if (isListening && recognitionRef.current) {
    recognitionRef.current.stop();
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      transcript += event.results[i][0].transcript;
    }

    setMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognitionRef.current = recognition;

  recognition.start();
};
  return (
    <>
      {!isOpen && (
        <div
    className="vastu-floating-wrapper"
    style={{
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: isDragging ? "grabbing" : "grab",
    }}
  >
 <button
      type="button"
      className="vastu-floating-card"
      aria-label="Open Vastu Consultant"

      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}

      style={{
        touchAction: "none",
      }}
    >
    <div className="vastu-compass">
      <span className="compass-direction compass-north">N</span>
      <span className="compass-direction compass-east">E</span>
      <span className="compass-direction compass-south">S</span>
      <span className="compass-direction compass-west">W</span>

      <div className="vastu-icon-circle">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="#F1D477"
            strokeWidth="1.3"
          />

          <defs>
            <linearGradient
              id="goldGradient"
              x1="2"
              y1="2"
              x2="22"
              y2="22"
            >
              <stop offset="0%" stopColor="#FFF1A8" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A87812" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <div className="vastu-hover-text">
      <span>Vastu Consultant</span>
    </div>
    <span className="vastu-sparkle sparkle-one">✦</span>
    <span className="vastu-sparkle sparkle-two">✦</span>
    <span className="vastu-sparkle sparkle-three">✦</span>
    <span className="vastu-sparkle sparkle-four">✦</span>
  </button>
  </div>

      )}

      {isOpen && (
        <div className="vastu-chat-window">
          <div className="vastu-chat-header">
            <div>
              <strong>Adjective Vastu Consultant</strong>
              <span>Vastu Consultant</span>
            </div>

            <button
              type="button"
              className="vastu-close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="vastu-chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`vastu-message ${
                  msg.sender === "user"
                    ? "vastu-user-message"
                    : "vastu-bot-message"
                }`}
              >
                {msg.text}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

         <div className="vastu-chat-input-area">

  <div className="vastu-input-wrapper">

    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSend();
      }}
      placeholder={
        isListening
          ? "Listening..."
          : "Ask your Vastu question..."
      }
    />

    {/* MIC BUTTON */}
    <button
  type="button"
  className={`vastu-mic-button ${
    isListening ? "listening" : ""
  }`}
  onClick={startListening}
  aria-label="Voice input"
>
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="9"
      y="3"
      width="6"
      height="11"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.7"
    />

    <path
      d="M5.5 11.5C5.5 15.09 8.41 18 12 18C15.59 18 18.5 15.09 18.5 11.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <path
      d="M12 18V21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <path
      d="M9 21H15"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
</button>

  </div>

  {/* SEND BUTTON */}
  <button
    type="button"
    onClick={handleSend}
    className="vastu-send-button"
  >
    ➤
  </button>

</div>
        </div>
      )}
      {showAuth && (
  <div className="vastu-auth-overlay">
    <div className="vastu-auth-modal">

      <button
        type="button"
        className="vastu-auth-close"
        onClick={() => setShowAuth(false)}
      >
        ×
      </button>

      <div className="vastu-auth-icon">
        ✦
      </div>

      <h2>Continue Your Vastu Journey</h2>

      <p>
        you have used your 2 free Vastu questions.
        Sign in or create an account to continue.
      </p>

      <button
        type="button"
        className="vastu-signin-button"
        onClick={() => {
          window.location.href = "/signin";
        }}
      >
        Sign In
      </button>

      <button
        type="button"
        className="vastu-signup-button"
        onClick={() => {
          window.location.href = "/signup";
        }}
      >
        Create Account
      </button>

    </div>
  </div>
)}
      
    </>
  );
};

export default VastuChatbot;