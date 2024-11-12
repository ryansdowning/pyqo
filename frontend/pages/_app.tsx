import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../styles/global.css";

import Head from "next/head";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { theme } from "../theme";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Head>
        <title>Mantine Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
