import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import {
  Button,
  Checkbox,
  Menu,
  Modal,
  ModalProps,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { components } from "../schema";
import { api } from "../utils/backend";
import { formatDate, getReadablePositionFromScan } from "../utils/format";
import { useIsAuthenticated } from "../utils/hooks";
import { getItemQRCodeValue } from "../utils/qr-codes";
import QRCodeWithPrintOverlay from "./QRCodeWithPrintOverlay";

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

interface EditablePropertyCardProps extends PropertyCardProps {
  onRemove: () => void;
  onEdit: (value: string) => void;
}

function EditablePropertyCard({
  property,
  onRemove,
  onEdit,
}: EditablePropertyCardProps) {
  return (
    <div className="bg-white rounded-md p-2 shadow-sm flex gap-1 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">{property.label}:</span>
          <TextInput
            radius="md"
            value={property.value as string}
            onChange={(e) => onEdit(e.currentTarget.value)}
          />
        </div>
        <IconX
          className="text-gray-200 hover:text-gray-900 cursor-pointer"
          onClick={onRemove}
        />
      </div>
    </div>
  );
}

interface EditItemModalProps extends Omit<ModalProps, "title"> {
  id: string;
  properties: components["schemas"]["DynamicProperty"][];
}

function EditItemModal({ id, properties, ...props }: EditItemModalProps) {
  const [draftProperties, setDraftProperties] = useState(properties);
  const { data: propertiesData, isLoading } = api.useQuery(
    "get",
    "/app/properties/"
  );
  const propertiesPage = propertiesData?.results ?? [];

  return (
    <Modal title="Editing item" {...props}>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded-md p-2 flex-flex-col space-y-2">
          {draftProperties.length > 0
            ? draftProperties.map((property, i) => (
                <EditablePropertyCard
                  key={property.label}
                  property={property}
                  onEdit={(value) =>
                    setDraftProperties([
                      ...draftProperties.slice(0, i),
                      {
                        ...property,
                        value,
                      },
                      ...draftProperties.slice(i + 1),
                    ])
                  }
                  onRemove={() =>
                    setDraftProperties((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                />
              ))
            : "No properties"}
        </div>
        <div className="flex gap-2">
          <Button radius="md">Save</Button>
          <Menu radius="md">
            <Menu.Target>
              <Button radius="md" variant="outline">
                Add property
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {propertiesPage.map((property) => (
                <Menu.Item
                  key={property.id}
                  rightSection={
                    <Checkbox
                      checked={draftProperties.some(
                        ({ id }) => id === property.id
                      )}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        if (checked) {
                          setDraftProperties((prev) => [
                            ...prev,
                            {
                              id: property.id,
                              label: property.label,
                              value: "",
                            },
                          ]);
                        } else {
                          setDraftProperties((prev) =>
                            prev.filter(({ id }) => id !== property.id)
                          );
                        }
                      }}
                    />
                  }
                >
                  {property.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </Modal>
  );
}

export interface ItemPageProps {
  item: components["schemas"]["Item"];
  scans: components["schemas"]["Scan"][];
}

export default function ItemPage({ item, scans }: ItemPageProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [editOpen, setEditOpen] = useState(false);
  const isViewPage = router.pathname === "/codes/[id]/view";

  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isAuthenticated || !mapRef.current || !scans) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      const mostRecentScanWithPosition = scans.reduce((acc, scan) => {
        if (!scan.position) return acc;
        if (!acc) return scan;
        return new Date(scan.created_at) > new Date(acc.created_at)
          ? scan
          : acc;
      }, undefined as components["schemas"]["Scan"] | undefined);
      const mostRecentPosition = mostRecentScanWithPosition
        ? mostRecentScanWithPosition.position!
        : undefined;

      // @ts-expect-error - google SDK is loaded via the script injection.
      const map = new google.maps.Map(mapRef.current!, {
        zoom: 12,
        center: mostRecentPosition
          ? {
              lat: mostRecentPosition.latitude,
              lng: mostRecentPosition.longitude,
            }
          : { lat: 0, lng: 0 },
      });

      for (const scan of scans ?? []) {
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
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [scans, isAuthenticated]);

  return (
    <>
      <EditItemModal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        id={item.id.toString()}
        properties={item.properties}
        centered
      />
      <div className="p-4 gap-4 space-y-4">
        <div className="flex flex-col gap-4">
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
          <div className="space-y-2">
            <div className="bg-gray-200 rounded-md p-2 flex-flex-col space-y-2">
              {item?.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {isAuthenticated && (
              <div className="flex gap-2">
                <Button radius="md" onClick={() => setEditOpen(true)}>
                  Edit
                </Button>
                <Button
                  radius="md"
                  variant="outline"
                  onClick={() =>
                    router.push({
                      pathname: isViewPage ? "/codes/[id]" : "/codes/[id]/view",
                      query: { id: item.id },
                    })
                  }
                >
                  {isViewPage ? "Go to app" : "View"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full shadow-md rounded-md">
          <div
            ref={mapRef}
            className="w-full h-[50vh] bg-gray-200 rounded-md text-center flex flex-col justify-center"
          >
            {isAuthenticated ? null : <span>Login to see the map</span>}
          </div>
        </div>

        {isAuthenticated && (
          <div className="w-full h-full">
            <QRCodeWithPrintOverlay
              className="rounded-md"
              value={getItemQRCodeValue(item)}
            />
          </div>
        )}
      </div>
    </>
  );
}
