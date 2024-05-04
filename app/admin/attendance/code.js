"use client";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useEffect, useState } from "react";
import styles from "./newCode.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg } from "html-to-image";
import { toast } from "react-toastify";

export const Codes = ({ code, setViewCode }) => {
  const svgRef = useRef(null);

  const [downloadQR, setDownloadQR] = useState(false);

  useEffect(() => {
    // Trigger download when the component mounts
    const downloadQRCode = async () => {
      const svgElement = svgRef.current;
      if (!svgElement) {
        console.error("Error: SVG element not found");
        return;
      }

      try {
        const dataUrl = await htmlToImage.toPng(svgElement);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error converting SVG to PNG:", error);
      }
    };

    if (downloadQR) {
      downloadQRCode();
      setDownloadQR(false);
    }
  }, [downloadQR]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Attendance Code Copied!");
  };

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-end mb-5">
          {/* <h1 className="font-semibold"> Code </h1> */}
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setViewCode(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <div className="grid grid-cols-2">
          <div>
            <h3 className="mb-2 font-bold text-lg">QR Code</h3>
            <div ref={svgRef}>
              <QRCodeSVG value={code} />
            </div>
            <div className="mt-5">
              <button
                onClick={() => setDownloadQR(true)}
                className="p-2 rounded bg-black text-white"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download QR Code
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-lg">Attendance Code</h3>
            <p className="text-4xl">{code}</p>
            <button
              onClick={copyToClipboard}
              className="p-2 mt-2 rounded bg-black text-white"
            >
              <FontAwesomeIcon icon={faCopy} className="mr-2" />
              Copy Attendance Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
