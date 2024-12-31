import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as FirebaseLogEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from './firebaseConfig.json';

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const logEvent = FirebaseLogEvent;
export const db = getFirestore(app);