// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { AdminData, CustomerInfo } from "@/types/types";
import { toast } from "react-toastify";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPTkk08nMYvfCiebnPyEpJEWCxuCscVAY",
  authDomain: "faster-order-945ea.firebaseapp.com",
  projectId: "faster-order-945ea",
  storageBucket: "faster-order-945ea.appspot.com",
  messagingSenderId: "956239478411",
  appId: "1:956239478411:web:b0b0bcd4aef2f05ea15e8e",
  measurementId: "G-YH6TDR7W08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

const forgotPassword = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success("Se ha enviado un correo para restablecer tu contraseña!");
    })
    .catch((error) => {
      toast.error("Error al enviar el correo!");
      console.error(error);
    });
};

const signInAnonymous = (data: CustomerInfo) => {
  signInAnonymously(auth)
    .then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: data.name,
            phone: data.phone,
            address: data.address ?? "",
            neighborhood: data.neighborhood ?? null,
          });
        } else {
          toast.error("Error al iniciar sesión!");
          console.log("No user is signed in.");
        }
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const signInAdmin = async ({ email, password }) => {
  const user = await signInWithEmailAndPassword(auth, email, password);
  if (!user) return null;
  return user;
};

const signInUserPhone = async ({ phone }) => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "next", {
      size: "invisible",
    });
    let user;
    signInWithPhoneNumber(auth, `+58${phone}`, recaptchaVerifier).then(
      (confirmationResult) => {
        const code = window.prompt("Ingrese el código de verificación");
        confirmationResult
          .confirm(code ?? "")
          .then((result) => {
            toast.success("Número verificado correctamente");
            user = result.user;
            recaptchaVerifier.clear()
          })
          .catch((error) => {
            toast.error("Error al verificar el número");
            console.error(error);
          });
      }
    );
    return user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
  }
};

const logOut = () => {
  signOut(auth).then(() => {
    toast.success("Sesión cerrada correctamente");
  });
};

const saveAdminData = (data: AdminData) => {
  const adminDataRef = doc(db, "admin", "data");
  setDoc(adminDataRef, data, { merge: true })
    .then(() => {
      toast.success("Datos guardados correctamente");
    })
    .catch((error) => {
      toast.error("Error al guardar los datos");
      console.error(error);
    });
};

export {
  auth,
  analytics,
  db,
  storage,
  signInAnonymous,
  signInAdmin,
  logOut,
  saveAdminData,
  forgotPassword,
  signInUserPhone,
};
