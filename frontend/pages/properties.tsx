import { useEffect, useState } from "react";

import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { PyqoLayout } from "../components/PyqoLayout";
import { components } from "../schema";
import { client } from "../utils/backend";

export default function PropertiesPage() {
  const [fetching, setFetching] = useState(true);
  const [properties, setProperties] = useState<
    components["schemas"]["Property"][]
  >([]);
  const [token] = useLocalStorage({ key: "token", defaultValue: "" });

  useEffect(() => {
    client
      .GET("/app/properties/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((result) => {
        if (result.error) {
          notifications.show({
            title: "Failed to load codes",
            message: "Something went wrong.",
            color: "red",
          });
          return;
        } else {
          // @ts-expect-error
          setProperties(result.data);
        }
        setFetching(false);
      });
  }, []);

  return <PyqoLayout>Properties</PyqoLayout>;
}
