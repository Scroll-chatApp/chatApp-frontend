// PDF download component 
import React from "react";

export default function DownloadPDF({ pdfUrl }) {
  return (
    <div>
      <p>Click the button below to download the PDF:</p>
      <a download href={pdfUrl}>Download PDF</a>
    </div>
  );
}
