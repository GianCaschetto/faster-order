import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type HistoryMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", 
systemInstruction: "Respondeme en italiano" });

function Chat() {
  const [historyChat, setHistoryChat] = useState<HistoryMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === "") return;
    setInputValue("");
    setIsLoadingAnswer(true);

    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    setHistoryChat([
      ...historyChat,
      { role: "user", parts: [{ text: inputValue }] },
    ]);

    const result = await chat.sendMessage(inputValue);
    const response = await result.response;
    const text = response.text();

    setHistoryChat([
      ...historyChat,
      { role: "user", parts: [{ text: inputValue }] },
      { role: "model", parts: [{ text: text }] },
    ]);
    setIsLoadingAnswer(false);

    
  };

  return (
    <div className="flex flex-col h-full">
      <ul className="p-4 flex-col overflow-y-auto flex-grow">
        {historyChat.map((message, index) => (
          <li key={index} className={`mb-6 flex`}>
            <span
              className={`${
                message.role === "user" ? "bg-green-200" : "bg-gray-200 ml-auto"
              } text-black rounded-lg py-2 px-4 break-words inline-block max-w-80`}
            >
              {message.parts[0].text}
            </span>
          </li>
        ))}
        {isLoadingAnswer && (
          <li className="mb-6 flex justify-end">
            <span className="bg-blue-200 text-blue-800 rounded-lg py-2 px-4 break-words inline-block max-w-80">
              ...
            </span>
          </li>
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex px-4 py-2 ">
        <input
          type="text"
          placeholder="Type your message here"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow py-2 px-4 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-full ml-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
