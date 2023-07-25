import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Añadido signOut aquí

const firebaseConfig = {
    apiKey: "AIzaSyDiwwodBo-JLvlVmzP_m4N6fTu1zLjYhRQ",
    authDomain: "dinardap-c027c.firebaseapp.com",
    projectId: "dinardap-c027c",
    storageBucket: "dinardap-c027c.appspot.com",
    messagingSenderId: "694608177224",
    appId: "1:694608177224:web:237a5031433c1eb561107d",
    measurementId: "G-51ML6VPQLF"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, signOut }; // Añadido signOut aquí
