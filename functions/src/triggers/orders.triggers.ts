import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);
const model = genAI.getGenerativeModel({ model: "embedding-001" });

export const onCreateOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snapshot) => {
    try {
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }
      const data = snapshot.data();
      const createdAt = FieldValue.serverTimestamp();
      const orderText = JSON.stringify(data);
      const result = await model.embedContent(orderText);
      const embedding = result.embedding.values;
      const orderRef = snapshot.ref;
      await orderRef.update({ embedding, createdAt });
    } catch (error) {
      console.error("Error updating order", error);
    }
  });
