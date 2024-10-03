import React, { useState } from "react";
import axios from "axios";

const Chatbox = () => {
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you?", sender: "bot" }]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async (text) => {
    const userMessage = { text, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/aichat/chat", // Request to your backend
        {
          message: text, // Send the user input to the backend
        }
      );

      const botMessage = {
        text: response.data.message, // The message returned by the backend
        sender: "bot",
      };

      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Oops! Something went wrong.", sender: "bot" };
      setMessages([...messages, userMessage, errorMessage]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbox-message ${message.sender}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chatbox-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbox;
