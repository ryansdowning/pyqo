import { Table, TableProps } from "@mantine/core";

import { components } from "../schema";
import { formatDate } from "../utils/format";

export interface PropertiesTableProps extends TableProps {
  properties: components["schemas"]["Property"][];
}

export default function PropertiesTable({
  properties,
  ...props
}: PropertiesTableProps) {
  const rows = properties.map((property) => (
    <Table.Tr key={property.id}>
      <Table.Td>{property.label}</Table.Td>
      <Table.Td>{property.id}</Table.Td>
      <Table.Td>{formatDate(property.created_at)}</Table.Td>
      <Table.Td>{formatDate(property.updated_at)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table {...props}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Label</Table.Th>
          <Table.Th>ID</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Last Updated</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
