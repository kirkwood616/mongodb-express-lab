import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", itemRoutes);

export const api = functions.https.onRequest(app);
