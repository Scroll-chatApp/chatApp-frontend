import React from "react";
import "./downloadPDF.css"; // Import a CSS file for styling

export default function DownloadPDF({ pdfUrl }) {
  return (
    <div className="download-pdf-container">
      <a href={pdfUrl} download target="_blank" rel="noreferrer" className="download-pdf-link">
        Download PDF
      </a>
    </div>
  );
}
