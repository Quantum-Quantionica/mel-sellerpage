import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from './firebaseConfig.json';

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
