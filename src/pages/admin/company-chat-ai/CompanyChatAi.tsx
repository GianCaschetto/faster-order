import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAdmin } from "@/contexts/AdminContext";
import ReactMarkdown from "react-markdown";

type HistoryMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function CompanyChatAi() {
  const { orders } = useAdmin();
  const [historyChat, setHistoryChat] = useState<HistoryMessage[]>(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: `
      Estas son las ordenes que han llegado hasta ahora: ${JSON.stringify(orders)}
      Eres un chatbot que ayuda a las empresas a responder preguntas frecuentes de sus clientes sobre pedidos, envíos, devoluciones y productos.
      Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
      Responde solo con la información relevante y necesaria.
      No proporciones detalles adicionales que no sean solicitados.

      Ejemplos de preguntas y respuestas:

      Pregunta: ¿Cuál es el estado del pedido #12345?
      Respuesta: El pedido #12345 está en camino.

      Pregunta: ¿Quién es mi cliente más fiel?
      Respuesta: El cliente más fiel es x.

      Pregunta: ¿Cuál es el producto más vendido?
      Respuesta: El producto más vendido es x.

  

    `,
    generationConfig: {
      temperature: 1,
      topP: 0.9,
    },
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
                message.role === "user" ? "bg-green-200 ml-auto" : "bg-gray-200 "
              } text-black rounded-lg py-2 px-4 break-words inline-block max-w-80`}
            >
              <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
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
        {/* Clear chat button */}
        <button onClick={() =>{
          window.localStorage.removeItem("chatHistory");
          window
        }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-messages-off"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 3l18 18" />
          <path d="M11 11a1 1 0 0 1 -1 -1m0 -3.968v-2.032a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10l-3 -3h-3" />
          <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
        </svg>
        </button>
        <input
          type="text"
          placeholder="Escribe un mensaje aquí"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow py-2 px-4 rounded-full border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
