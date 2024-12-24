import { useState } from "react";

import {
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Pagination,
  Select,
  Stack,
  Switch,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import ItemsTable from "../../components/ItemsTable";
import { PyqoLayout } from "../../components/PyqoLayout";
import { api, PAGE_SIZE } from "../../utils/backend";
import { getItemQRCodeValue, printQRCodes } from "../../utils/qr-codes";

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
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const [groupSize, setGroupSize] = useState<
    "1" | "5" | "10" | "25" | "50" | "100" | "custom"
  >("10");
  const [customAmount, setCustomAmount] = useState<number>(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const bulkCreateCodes = api.useMutation("post", "/app/bulk-create-items/", {
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "QR codes created successfully!",
        color: "green",
      });
      setCreateOpen(false);
      setGroupSize("10");
      setCustomAmount(10);
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to create QR codes. Please try again.",
        color: "red",
      });
    },
  });

  const handleCreateCodes = () => {
    const amount = groupSize === "custom" ? customAmount : Number(groupSize);
    bulkCreateCodes.mutate({ body: { count: amount, private: isPrivate } });
  };

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
            <Stack gap="sm">
              <Select
                radius="md"
                label="# of codes"
                value={groupSize}
                // @ts-expect-error
                onChange={setGroupSize}
                data={[
                  { value: "1", label: "1 code" },
                  { value: "5", label: "5 codes" },
                  { value: "10", label: "10 codes" },
                  { value: "25", label: "25 codes" },
                  { value: "50", label: "50 codes" },
                  { value: "100", label: "100 codes" },
                  { value: "custom", label: "Custom amount" },
                ]}
              />

              {groupSize === "custom" && (
                <NumberInput
                  label="Custom amount"
                  min={1}
                  max={1000} // Adjust as needed
                  value={customAmount}
                  onChange={(value) =>
                    setCustomAmount(parseInt(value.toString()) || 1)
                  }
                />
              )}

              <Switch
                label="Private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.currentTarget.checked)}
              />

              <Group justify="right" mt="md">
                <Button
                  radius="md"
                  onClick={handleCreateCodes}
                  loading={bulkCreateCodes.isPending}
                >
                  Create
                </Button>
              </Group>
            </Stack>
          </Modal>
          <Stack gap="sm" m="lg">
            <div className="flex gap-2">
              <Button
                w="fit-content"
                radius="md"
                onClick={() => setCreateOpen(true)}
              >
                Create codes
              </Button>
              {selectedItemIds.length > 0 && (
                <>
                  <Button
                    radius="md"
                    variant="outline"
                    onClick={() =>
                      printQRCodes(
                        selectedItemIds.map((id) =>
                          getItemQRCodeValue(
                            itemsPage?.results.find((item) => item.id === id)!
                          )
                        )
                      )
                    }
                  >
                    Print {selectedItemIds.length} code
                    {selectedItemIds.length > 1 ? "s" : ""}
                  </Button>
                  <Button
                    radius="md"
                    variant="transparent"
                    onClick={() => {
                      if (
                        selectedItemIds.length === itemsPage?.results.length
                      ) {
                        setSelectedItemIds([]);
                      } else {
                        setSelectedItemIds(
                          itemsPage?.results.map((i) => i.id) ?? []
                        );
                      }
                    }}
                  >
                    {selectedItemIds.length === itemsPage?.results.length
                      ? "Unselect all"
                      : "Select all"}
                  </Button>
                </>
              )}
            </div>
            <ItemsTable
              items={itemsPage?.results ?? []}
              withColumnBorders
              trackSelectedItems={{
                onSelectItem: (checked, item) => {
                  if (checked) {
                    setSelectedItemIds([...selectedItemIds, item.id]);
                  } else {
                    setSelectedItemIds(
                      selectedItemIds.filter((i) => i !== item.id)
                    );
                  }
                },
                selectedItemIds,
              }}
            />
            <Pagination
              radius="md"
              total={Math.ceil(totalItems / PAGE_SIZE)}
              value={page}
              onChange={setPage}
            />
          </Stack>
        </>
      )}
    </PyqoLayout>
  );
}
