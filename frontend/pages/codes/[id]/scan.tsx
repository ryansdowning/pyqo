import { useEffect } from "react";

import { useRouter } from "next/router";

import { Loader } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { components } from "../../../schema";
import { BASE_URL } from "../../../utils/backend";

export default function ScanItemPage() {
  const router = useRouter();
  const [token] = useLocalStorage({ key: "token" });
  const { id } = router.query;

  const sendScanRequest = (
    position?: NonNullable<components["schemas"]["Scan"]["position"]>
  ) => {
    fetch(`${BASE_URL}/app/items/${id}/scan/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: position ? JSON.stringify(position) : undefined,
    }).then(() => router.push({ pathname: "/codes/[id]/view", query: { id } }));
  };

  useEffect(() => {
    if (!id) return;
    navigator.geolocation.getCurrentPosition(
      (position) =>
        sendScanRequest({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => sendScanRequest(),
      { timeout: 5000 }
    );
  }, [id]);

  return <Loader />;
}
