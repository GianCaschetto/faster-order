import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAdmin } from "@/contexts/AdminContext";

type HistoryMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function CompanyChatAi() {
  const { orders, adminData } = useAdmin();
  const [historyChat, setHistoryChat] = useState<HistoryMessage[]>(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: `Eres la empresa con estas ordenes: ${JSON.stringify(
      orders
    )}, ten en cuenta la informacion de la empresa ${JSON.stringify(
      adminData
    )} responde todo tipo de preguntas`,
  });

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === "") return;
    setInputValue("");
    setIsLoadingAnswer(true);

    const chat = model.startChat({});

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

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setHistoryChat(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatHistory", JSON.stringify(historyChat));
  }, [historyChat]);

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
        <div ref={bottomRef}></div>
      </ul>
      <form onSubmit={handleSubmit} className="flex px-4 py-2 ">
        <input
          type="text"
          placeholder="Escribe un mensaje aquí"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow py-2 px-4 rounded-full border text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-green-600"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-send-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
            <path d="M6.5 12h14.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default CompanyChatAi;
