import axios from "axios";

import { env } from "./env";

export const httpClient = axios.create({
  baseURL: env.mockApiBaseUrl,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
