import { useState } from "react";

import { useRouter } from "next/router";

import { components } from "../../../schema";

export default function CodePage() {
  const router = useRouter();
  const { id } = router.query;
  const [fetching, setFetching] = useState(true);
  const [item, setItem] = useState<components["schemas"]["Item"] | null>(null);

  return <div>Edit item {id}</div>;
}
