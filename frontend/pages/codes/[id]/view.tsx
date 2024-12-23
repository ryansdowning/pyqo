import { useRouter } from "next/router";

export default function ViewItemPage() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Viewing item {id}</div>;
}
