import { PropsWithChildren } from "react";

import { useLocalStorage } from "usehooks-ts";

import { AppShell, Burger, Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout } from "@tabler/icons-react";

import AuthenticatedProvider from "./AuthenticatedProvider";

export function PyqoLayout({ children }: PropsWithChildren) {
  const [, setToken] = useLocalStorage("token", "");
  const [opened, { toggle }] = useDisclosure();

  return (
    <AuthenticatedProvider>
      <AppShell
        header={{ height: { sm: 60, base: 60, md: 0 } }}
        navbar={{
          width: { base: 200, sm: 220, md: 240 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        {/* Only shows header on small screens (mobile) */}
        <AppShell.Header hiddenFrom="sm">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar pt="sm">
          <Stack justify="space-between" h="100%">
            <Stack gap="xs" w="100%">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Button
                    key={index}
                    h={28}
                    variant="transparent"
                    w="100%"
                    justify="flex-start"
                    styles={(theme) => ({
                      root: {
                        "&:hover": {
                          backgroundColor: theme.colors.gray[1],
                          color: theme.colors.blue[7],
                        },
                        "&:active": {
                          backgroundColor: theme.colors.blue[0],
                          color: theme.colors.blue[9],
                        },
                      },
                    })}
                  >
                    Button {index + 1}
                  </Button>
                ))}
            </Stack>
            <Button
              variant="transparent"
              justify="flex-start"
              w="100%"
              onClick={() => setToken("")}
              leftSection={<IconLogout />}
            >
              Logout
            </Button>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </AuthenticatedProvider>
  );
}
