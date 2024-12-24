import { useRouter } from "next/router";

import { Checkbox, Table, TableProps } from "@mantine/core";

import { components } from "../schema";
import { formatDate, getReadablePositionFromScan } from "../utils/format";

export interface ItemsTableProps extends TableProps {
  items: components["schemas"]["Item"][];
  trackSelectedItems?: {
    onSelectItem: (
      checked: boolean,
      item: components["schemas"]["Item"]
    ) => void;
    selectedItemIds: components["schemas"]["Item"]["id"][];
  };
}

export default function ItemsTable({
  items,
  trackSelectedItems,
  ...props
}: ItemsTableProps) {
  const router = useRouter();

  const rows = items.map((item) => {
    const isSelected = trackSelectedItems?.selectedItemIds.includes(item.id);

    return (
      <Table.Tr
        key={item.id}
        onClick={() => router.push(`/codes/${item.id}`)}
        className="hover:bg-gray-200 cursor-pointer"
      >
        {trackSelectedItems && (
          <Table.Td>
            <Checkbox
              checked={isSelected}
              onChange={(e) =>
                trackSelectedItems.onSelectItem(e.currentTarget.checked, item)
              }
              onClick={(e) => e.stopPropagation()}
            />
          </Table.Td>
        )}
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{formatDate(item.created_at)}</Table.Td>
        <Table.Td>
          {item.latest_scan
            ? formatDate(item.latest_scan.created_at)
            : "Never scanned"}
        </Table.Td>
        <Table.Td>
          {item.latest_scan
            ? getReadablePositionFromScan(item.latest_scan)
            : "Never scanned"}
        </Table.Td>
        <Table.Td>{formatDate(item.updated_at)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table {...props}>
      <Table.Thead>
        <Table.Tr>
          {trackSelectedItems && <Table.Th />}
          <Table.Th>ID</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Last Scanned</Table.Th>
          <Table.Th>Last Location</Table.Th>
          <Table.Th>Last Updated</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
