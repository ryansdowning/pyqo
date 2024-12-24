import React, { useRef } from "react";

import QRCode, { QRCodeProps } from "react-qr-code";

import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPrinter, IconShare2 } from "@tabler/icons-react";

export interface QRCodeWithPrintOverlayProps extends Omit<QRCodeProps, "ref"> {}

export default function QRCodeWithPrintOverlay({
  ...props
}: QRCodeWithPrintOverlayProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (qrCodeRef.current) {
      const qrCodeElement = qrCodeRef.current.querySelector("svg");
      if (qrCodeElement) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print QR Code</title>
                <style>
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: white;
                  }
                  .qr-code {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                </style>
              </head>
              <body>
                <div class="qr-code">${qrCodeElement.outerHTML}</div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-4">
      <div
        ref={qrCodeRef}
        className="relative flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg"
      >
        <QRCode {...props} />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-lg gap-2">
          <p className="text-white font-bold text-md leading-6">
            This QR code should be printed and physically placed on the item.
          </p>

          <div className="flex gap-2">
            <Button onClick={handlePrint} radius="md" variant="filled">
              <IconPrinter />
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(props.value as string);
                notifications.show({
                  title: "Copied to clipboard",
                  message:
                    "The QR code value has been copied to your clipboard.",
                  color: "blue",
                });
              }}
              radius="md"
              variant="white"
            >
              <IconShare2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
