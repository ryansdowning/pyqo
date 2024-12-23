import { useEffect, useRef } from "react";

import { useRouter } from "next/router";

import { PyqoLayout } from "../../../components/PyqoLayout";
import { components } from "../../../schema";
import { api } from "../../../utils/backend";
import { formatDate, getReadablePositionFromScan } from "../../../utils/format";

const MAPS_API_KEY = "AIzaSyDH0UrEbQte1ZvrRw8dErh6wvG9VTldNLE";

interface PropertyCardProps {
  property: components["schemas"]["DynamicProperty"];
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-md p-2 shadow-sm flex gap-1">
      <span className="font-semibold">{property.label}:</span>
      <span>{property.value as string}</span>
    </div>
  );
}

export default function ManageItemPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: item } = api.useQuery("get", "/app/items/{id}/", {
    // @ts-expect-error - all_properties is not in the schema.
    params: { path: { id: id as string }, query: { all_properties: true } },
    enabled: Boolean(id),
  });
  const { data: scansPage } = api.useQuery("get", "/app/scans/", {
    // @ts-expect-error - drf-spectacular not generating filter params.
    params: { query: { item: id as string } },
  });
  const scans = scansPage?.results;

  const latitude = item?.latest_scan?.position?.latitude;
  const longitude = item?.latest_scan?.position?.longitude;
  const mapUrl =
    latitude && longitude
      ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${latitude},${longitude}`
      : null;

  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapRef.current || !scans) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      // @ts-expect-error - google SDK is loaded via the script injection.
      const map = new google.maps.Map(mapRef.current!, {
        zoom: 12,
        center: scans[0]?.position
          ? {
              lat: scans[0].position.latitude,
              lng: scans[0].position.longitude,
            }
          : { lat: 0, lng: 0 },
      });

      scans?.forEach((scan: any) => {
        if (scan.position) {
          // @ts-expect-error - google SDK is loaded via the script injection.
          new google.maps.Marker({
            position: {
              lat: scan.position.latitude,
              lng: scan.position.longitude,
            },
            map,
          });
        }
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [scans]);

  return (
    <PyqoLayout>
      <div className="p-4 flex gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <h3>
            Last scanned:{" "}
            {item?.latest_scan
              ? formatDate(item?.latest_scan.created_at)
              : "Never scanned"}{" "}
            (
            {item?.latest_scan
              ? getReadablePositionFromScan(item?.latest_scan)
              : "Never scanned"}
            )
          </h3>
          <div className="bg-gray-200 rounded-md p-2 flex-flex-col space-y-2">
            {item?.properties.map((property) => (
              <PropertyCard key={property.label} property={property} />
            ))}
          </div>
        </div>

        <div className="w-1/2">
          <div
            ref={mapRef}
            className="w-full h-96 bg-gray-300"
            style={{ borderRadius: "8px" }}
          ></div>
        </div>
      </div>
    </PyqoLayout>
  );
}
