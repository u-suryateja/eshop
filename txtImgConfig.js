import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBeQFs_yeG7iBvpFGzpYYwKDM5prEbvDH4",
    authDomain: "test-3b5ad.firebaseapp.com",
    projectId: "test-3b5ad",
    storageBucket: "test-3b5ad.appspot.com",
    messagingSenderId: "1007534312462",
    appId: "1:1007534312462:web:d528f0927b4662de1a405f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB,txtDB};