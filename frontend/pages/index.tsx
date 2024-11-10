import { Button, Group } from "@mantine/core";

import { PyqoLayout } from "../components/PyqoLayout";

export default function IndexPage() {
  return (
    <PyqoLayout>
      <Group mt={50} justify="center">
        <Button size="xl">Welcome to Mantine!</Button>
      </Group>
    </PyqoLayout>
  );
}
