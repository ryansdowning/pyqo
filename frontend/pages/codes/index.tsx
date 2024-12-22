import { useState } from "react";

import { Button, Loader, Modal, Pagination, Stack } from "@mantine/core";

import ItemsTable from "../../components/ItemsTable";
import { PyqoLayout } from "../../components/PyqoLayout";
import { api } from "../../utils/backend";

export default function CodesPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const {
    data: itemsPage,
    error,
    isLoading,
  } = api.useQuery("get", "/app/items/", {
    query: { page },
  });
  const totalItems = itemsPage?.count ?? 0;

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
            title="Create QR Codes"
            radius="md"
          >
            Creating codes
          </Modal>
          <Stack gap="sm" m="lg">
            <Button
              w="fit-content"
              radius="md"
              onClick={() => setCreateOpen(true)}
            >
              Create codes
            </Button>
            <ItemsTable items={itemsPage?.results ?? []} withColumnBorders />
            <Pagination
              radius="md"
              total={totalItems}
              value={page}
              onChange={setPage}
            />
          </Stack>
        </>
      )}
    </PyqoLayout>
  );
}
