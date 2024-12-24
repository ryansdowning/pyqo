import { useState } from "react";

import {
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import PropertiesTable from "../components/PropertiesTable";
import { PyqoLayout } from "../components/PyqoLayout";
import { components } from "../schema";
import { api, PAGE_SIZE } from "../utils/backend";

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { data: propertiesPage, isLoading } = api.useQuery(
    "get",
    "/app/properties/",
    {
      query: { page },
    }
  );
  const totalProperties = propertiesPage?.count ?? 0;

  const [createPropertyData, setCreatePropertyData] = useState<
    Pick<components["schemas"]["Property"], "label">
  >({ label: "" });
  const createProperty = api.useMutation("post", "/app/properties/", {
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Property created successfully!",
        color: "green",
      });
      setCreateOpen(false);
      setCreatePropertyData({ label: "" });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to create property. Please try again.",
        color: "red",
      });
    },
  });

  return (
    <PyqoLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Modal
            opened={createOpen}
            onClose={() => setCreateOpen(false)}
            centered
            title="Create property"
            radius="md"
          >
            <Stack gap="sm">
              <TextInput
                radius="md"
                label="Label"
                placeholder="Property label"
                value={createPropertyData.label}
                onChange={(e) =>
                  setCreatePropertyData({
                    ...createPropertyData,
                    label: e.currentTarget.value,
                  })
                }
              />
              <Group justify="end" mt="md">
                <Button
                  radius="md"
                  onClick={() =>
                    createProperty.mutate({ body: createPropertyData })
                  }
                  loading={createProperty.isPending}
                >
                  Create
                </Button>
              </Group>
            </Stack>
          </Modal>
          <Stack gap="sm" m="lg">
            <Button
              w="fit-content"
              radius="md"
              onClick={() => setCreateOpen(true)}
            >
              Create property
            </Button>
            <PropertiesTable
              properties={propertiesPage?.results ?? []}
              withColumnBorders
            />
            <Pagination
              radius="md"
              total={Math.ceil(totalProperties / PAGE_SIZE)}
              value={page}
              onChange={setPage}
            />
          </Stack>
        </>
      )}
    </PyqoLayout>
  );
}
