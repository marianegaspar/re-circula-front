import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../src/services/firebase";

export async function generateUniqueValidationCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const number = Math.floor(1000 + Math.random() * 9000);
    const validationCode = `RC-${number}`;
    const existingDelivery = await getDocs(
      query(
        collection(db, "schedules"),
        where("validationCode", "==", validationCode),
        limit(1),
      ),
    );

    if (existingDelivery.empty) {
      return validationCode;
    }
  }

  return `RC-${Date.now().toString().slice(-8)}`;
}
