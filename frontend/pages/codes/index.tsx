import { useState } from "react";

import ItemsTable from "../../components/ItemsTable";
import { PyqoLayout } from "../../components/PyqoLayout";
import { PAGE_SIZE, useGetItems } from "../../utils/backend";

export default function CodesPage() {
  const [page, setPage] = useState(1);
  const { data: itemsPage, fetching } = useGetItems({ query: { page } });
  const totalItems = itemsPage?.count ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <PyqoLayout>
      <ItemsTable items={itemsPage?.results ?? []} />
    </PyqoLayout>
  );
}
