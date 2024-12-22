import createFetchClient, { Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";

import { notifications } from "@mantine/notifications";

import DRFErrorMessage from "../components/DRFError";
import type { paths } from "../schema"; // generated by openapi-typescript

const PyqoMiddleware: Middleware = {
  async onRequest({ request }) {
    const tokenUnclean = localStorage.getItem("token") || "";
    const token = tokenUnclean.replace(/"/g, "");
    if (token) {
      request.headers.set("Authorization", `Token ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    const responseClone = response.clone();
    const result = await responseClone.json();
    if (result.errors) {
      notifications.show({
        title: "Request failed",
        message: <DRFErrorMessage error={result} />,
        color: "Red",
      });
    }
  },
};

export const BASE_URL = "http://127.0.0.1:8000";
export const client = createFetchClient<paths>({ baseUrl: BASE_URL });
client.use(PyqoMiddleware);
export const api = createClient(client);
export const PAGE_SIZE = 25;

export interface DRFError {
  type: string;
  errors: Array<{
    code: string;
    detail: string;
    attr: string | null;
  }>;
}
