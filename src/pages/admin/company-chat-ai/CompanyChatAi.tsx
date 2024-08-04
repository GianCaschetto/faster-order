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
  const { orders, adminData } = useAdmin();
  const [historyChat, setHistoryChat] = useState<HistoryMessage[]>(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const adminDataInstructions = `
  Esta es la información de la empresa:
  Dirección: ${adminData?.address ?? "No disponible"}
  Categorías:
  ${
    adminData?.categories
      ? adminData.categories.map((c) => `- ${c.name} (ID: ${c.id})`).join("\n")
      : "No disponible"
  }
  Colores: ${
    adminData?.colors ? JSON.stringify(adminData.colors) : "No disponible"
  }
  Nombre de la compañía: ${adminData?.companyName ?? "No disponible"}
  Email: ${adminData?.email ?? "No disponible"}
  Agregados:
  ${
    adminData?.extras
      ? adminData?.extras
          .map(
            (e) => `
  - Título: ${e.title}
    Disponible: ${e.available}
    Items:
      ${e.items
        .map(
          (item) =>
            `- ${item.name} (Disponible: ${item.available}, Precio: ${
              item.price
            }, Descripción: ${item.description ?? "No disponible"})`
        )
        .join("\n      ")}
  `
          )
          .join("\n")
      : "No disponible"
  }
  Icono: ${adminData?.icon ?? "No disponible"}
  Logo: ${adminData?.logo ?? "No disponible"}
  Vecindarios:
  ${
    adminData?.neighborhoods
      ? adminData?.neighborhoods
          .map((n) => `- ${n.name} (ID: ${n.id}, Precio: ${n.price})`)
          .join("\n")
      : "No disponible"
  }
  Métodos de pago: ${
    adminData?.paymentMethods
      ? adminData?.paymentMethods.join(", ")
      : "No disponible"
  }
  Productos:
  ${
    adminData?.products
      ? adminData?.products
          .map(
            (p) => `
  - Nombre: ${p.name}
    ID: ${p.id}
    Precio: ${p.price}
    Categoría: ${p.categoryId}
    Descripción: ${p.description ?? "No disponible"}
    Imagen: ${p.image}
    Agregados: ${p.extras ? p.extras.join(", ") : "No disponible"}
  `
          )
          .join("\n")
      : "No disponible"
  }
  Horarios:
  ${
    adminData?.schedules
      ? adminData?.schedules
          .map(
            (s) =>
              `- Día: ${s.day} (Apertura: ${s.open}, Cierre: ${s.close}, Forzado: ${s.forced})`
          )
          .join("\n")
      : "No disponible"
  }
  WhatsApp: ${adminData?.whatsapp ?? "No disponible"}
  Mensaje de WhatsApp para Delivery: ${
    adminData?.whatsappDeliveryMessage ?? "No disponible"
  }
  Mensaje de WhatsApp para Pickup: ${
    adminData?.whatsappPickupMessage ?? "No disponible"
  }
`;

  const ordersInstructions = `
  Estas son las órdenes que han llegado hasta ahora:
  ${
    orders
      ? orders
          .map(
            (o) => `
  - ID: ${o.id}
    Cliente:
      UID: ${o.customer.uid ?? "No disponible"}
      Nombre: ${o.customer.name}
      Teléfono: ${o.customer.phone}
      Dirección: ${o.customer.address ?? "No disponible"}
      Vecindario: ${
        o.customer.neighborhood
          ? `${o.customer.neighborhood.name} (ID: ${o.customer.neighborhood.id}, Precio: ${o.customer.neighborhood.price})`
          : "No disponible"
      }
    Tipo de orden: ${o.orderType}
    Items:
      ${o.items
        .map(
          (item) => `
      - Producto: ${item.product.name}
        ID: ${item.product.id}
        Precio: ${item.price}
        Cantidad: ${item.quantity}
        Agregados: ${
          item.extras
            ? item.extras
                .map(
                  (extra) =>
                    `- ${extra.name} (ID: ${extra.id}, Disponible: ${
                      extra.available
                    }, Precio: ${extra.price}, Descripción: ${
                      extra.description ?? "No disponible"
                    })`
                )
                .join("\n        ")
            : "No disponible"
        }
      `
        )
        .join("\n      ")}
    Subtotal: ${o.subtotal}
    Estado: ${o.status}
    Precio de entrega: ${o.delivertyPrice ?? "No disponible"}
    Método de pago: ${o.paymentMethod}
    Número de orden: ${o.orderNumber ?? "No disponible"}
    Total: ${o.total}
    Fecha de creación: ${o.createdAt.toDate().toLocaleString()}
  `
          )
          .join("\n")
      : "No disponible"
  }
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: `
  ${adminDataInstructions}
  ${ordersInstructions}
  Eres un chatbot que ayuda a las empresas a responder preguntas frecuentes de sus clientes sobre pedidos, envíos, devoluciones y productos.
  Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
  Responde solo con la información relevante y necesaria.
  Puedes responder estrategias logísticas y administrativas.
  No proporciones detalles adicionales que no sean solicitados.

  Ejemplos de preguntas y respuestas:

  Pregunta: ¿Cuál es el estado del pedido #12345?
  Respuesta: El pedido #12345 está en camino.

  Pregunta: ¿Quién es mi cliente más fiel?
  Respuesta: El cliente más fiel es x.

  Pregunta: ¿Cuál es el producto más vendido?
  Respuesta: El producto más vendido es x.

  No puedes responder preguntas que no tengan nada que ver con la empresa y sus ordenes.
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
                message.role === "user"
                  ? "bg-green-200 ml-auto"
                  : "bg-gray-200 "
              } text-black rounded-lg py-2 px-4 break-words inline-block max-w-80`}
            >
              <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
            </span>
          </li>
        ))}
        {isLoadingAnswer && (
          <li className="mb-6 flex justify-start">
            <span className="bg-blue-200 text-blue-800 rounded-lg py-2 px-4 break-words inline-block max-w-80 flex items-center">
              <div className="loader-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </span>
          </li>
        )}
        <div ref={bottomRef}></div>
      </ul>
      <form onSubmit={handleSubmit} className="flex px-4 py-2 ">
        {/* Clear chat button */}
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("chatHistory");
            window.location.reload();
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-messages-off mr-4"
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
      <style>{`
        .loader-dots {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 1.5rem;
          height: 1.5rem;
        }

        .loader-dots div {
          width: 0.4rem;
          height: 0.4rem;
          background-color: #1e3a8a; /* Color azul oscuro */
          border-radius: 50%;
          animation: loader-dots 0.8s infinite ease-in-out both;
        }

        .loader-dots div:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loader-dots div:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes loader-dots {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default CompanyChatAi;
