
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from 'firebase/auth';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyBK7GAKgf_XAp8baA4nVD35-smu_2ZGr30",
    authDomain: "partner-up-e45e0.firebaseapp.com",
    projectId: "partner-up-e45e0",
    storageBucket: "partner-up-e45e0.appspot.com",
    messagingSenderId: "109293139585",
    appId: "1:109293139585:web:036a0777ff606bbc077f80",
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);