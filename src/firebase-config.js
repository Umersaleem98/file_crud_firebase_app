import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBkPpTkzd_nNxIIQA8PbYSt1d_tIs5ikvI",
    authDomain: "fir-tutorial-fc138.firebaseapp.com",
    projectId: "fir-tutorial-fc138",
    storageBucket: "fir-tutorial-fc138.appspot.com",
    messagingSenderId: "276052428087",
    appId: "1:276052428087:web:af630390ae8f81443e06b2",
    measurementId: "G-9R7X61GP8R"
  };

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app)
