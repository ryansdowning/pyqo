import { useEffect } from "react";

import { useRouter } from "next/router";

import { Title } from "@mantine/core";

import { PyqoLayout } from "../components/PyqoLayout";

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/codes");
  }, []);

  return (
    <PyqoLayout>
      <Title order={1}>Welcome to Pyqo!</Title>
    </PyqoLayout>
  );
}
