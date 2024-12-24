import ReactDOMServer from "react-dom/server";
import QRCode from "react-qr-code";

import { components } from "../schema";
import { APP_URL } from "./backend";

export function getItemQRCodeValue(item: components["schemas"]["Item"]) {
  return `${APP_URL}/codes/${item.id}/scan`;
}

export function printQRCodes(values: string[]) {
  const renderQrCode = (value: string): string => {
    return ReactDOMServer.renderToString(<QRCode value={value} size={128} />);
  };

  const createPageHtml = (pageValues: string[]) =>
    `
    <div class="page">
      ${pageValues
        .map(
          (value) => `
          <div class="qr-container">
            <div class="qr-code">
              ${renderQrCode(value)}
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  const pages = [];
  for (let i = 0; i < values.length; i += 20) {
    pages.push(values.slice(i, i + 20));
  }

  const printHtml = `
    <html>
      <head>
        <title>Print QR Codes</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .page {
            page-break-after: always;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            margin: 1rem 0;
          }
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 1rem;
            width: 20%;
            box-sizing: border-box;
          }
          .qr-code {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          .qr-label {
            margin-top: 0.5rem;
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${pages.map(createPageHtml).join("")}
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.print();
  }
}
