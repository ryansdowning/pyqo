import { useRouter } from "next/router";

import { Table, TableProps } from "@mantine/core";

import { components } from "../schema";
import { formatDate } from "../utils/format";

export interface ItemsTableProps extends TableProps {
  items: components["schemas"]["Item"][];
}

export default function ItemsTable({ items, ...props }: ItemsTableProps) {
  const router = useRouter();
  const rows = items.map((item) => (
    <Table.Tr
      key={item.id}
      onClick={() => router.push(`/codes/${item.id}`)}
      className="hover:bg-gray-200"
    >
      <Table.Td>{item.id}</Table.Td>
      <Table.Td>{formatDate(item.created_at)}</Table.Td>
      <Table.Td>
        {item.latest_scan ? formatDate(item.latest_scan) : "Never scanned"}
      </Table.Td>
      <Table.Td>{formatDate(item.updated_at)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table {...props}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Last Scanned</Table.Th>
          <Table.Th>Last Updated</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
