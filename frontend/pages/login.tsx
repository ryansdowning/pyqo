import { useState } from "react";

import { useRouter } from "next/router";

import { Box, Button, Stack, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import AuthenticatedProvider from "../components/AuthenticatedProvider";
import { client } from "../utils/backend";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setToken] = useLocalStorage({ key: "token" });

  const handleLogin = async () => {
    setLoading(true);
    const result = await client.POST("/token/", {
      body: { username, password, token: "" },
    });
    if (result.error) {
      notifications.show({
        title: "Failed to login",
        message: "Login was not successful. Please try again.",
        color: "red",
      });
    } else {
      const token = result.data.token;
      if (token) {
        setToken(token);
        router.push("/");
      }
    }

    setLoading(false);
  };

  return (
    <AuthenticatedProvider>
      <Box
        w="100vw"
        h="100vh"
        style={{ alignContent: "center", justifyItems: "center" }}
      >
        <Stack
          align="center"
          style={{
            padding: "2rem",
            minWidth: "400px",
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title order={2} style={{ textAlign: "center" }}>
            Welcome to
            <br />
            pyqo
          </Title>
          <Stack gap="xs">
            <TextInput
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              placeholder="Enter your username"
              label="Username"
              required
            />
            <TextInput
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
              label="Password"
              type="password"
              required
            />
            <Button
              onClick={handleLogin}
              loading={loading}
              fullWidth
              style={{ marginTop: "1rem" }}
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Box>
    </AuthenticatedProvider>
  );
}
