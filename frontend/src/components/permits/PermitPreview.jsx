import { useRef, useState } from "react";
import { Printer, X, CheckCircle2, Download, ChevronDown } from "lucide-react";
import html2pdf from "html2pdf.js";

import "./PermitPreview.css";
import lguSeal from "../../assets/images/lgu-seal.png";
import bagongPilipinasLogo from "../../assets/images/bagong-pilipinas-logo.png";
import BuildingPermitContent from "./BuildingPermitContent";
import OccupancyPermitContent from "./OccupancyPermitContent";

import meoLogo from "../../assets/images/meo-logo.jpg";
export default function PermitPreview({
  data,
  onClose,
  onConfirmSave,
  isSaving = false,
}) {
  const permitRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const isBuilding = data.permitType === "building";

  const permitTitle = isBuilding
    ? "BUILDING PERMIT"
    : "CERTIFICATE OF OCCUPANCY";

  const handleDownloadPDF = async () => {
    const element = permitRef.current;

    if (!element || isDownloading) return;

    setShowPrintOptions(false);
    setIsDownloading(true);

    try {
      const permitNumber = (data.permitNo || "Permit")
        .replace(/[<>:"/\\|?*]/g, "-")
        .replace(/\s+/g, "-");

      const permitType = isBuilding
        ? "Building-Permit"
        : "Certificate-of-Occupancy";

      const options = {
        margin: 0,
        filename: `${permitNumber}-${permitType}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
          compress: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      };

      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Unable to download the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setShowPrintOptions(false);
    window.print();
  };

  return (
    <div className="permit-preview-overlay">
      {/* Preview Toolbar */}
      <div className="permit-preview-toolbar">
        <div>
          <h2 className="text-lg font-bold text-brand-900">
            Certificate Preview
          </h2>
          <p className="text-xs text-slate-500">
            Review the document before confirming the permit record.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print / Download Dropdown */}
          <div className="permit-print-dropdown">
            <button
              type="button"
              onClick={() => setShowPrintOptions((previous) => !previous)}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Printer size={15} />
              {isDownloading ? "Generating PDF..." : "Print / Download"}
              <ChevronDown size={14} />
            </button>

            {showPrintOptions && (
              <>
                <button
                  type="button"
                  className="permit-dropdown-backdrop"
                  aria-label="Close print options"
                  onClick={() => setShowPrintOptions(false)}
                />

                <div className="permit-print-dropdown-menu">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="permit-print-dropdown-item"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="permit-print-dropdown-item"
                  >
                    <Printer size={16} />
                    <span>Print Certificate</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Close Preview */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X size={15} />
            Close Preview
          </button>
        </div>
      </div>

      {/* Printable A4 Landscape Document */}
      <div className="permit-print-area">
        <div
          className="permit-document"
          ref={permitRef}
          style={{
            position: "relative",
            isolation: "isolate",
            backgroundColor: "#ffffff",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${meoLogo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100%, 80%",
          }}
        >
          <div className="permit-document-border">
            {/* Header */}
            <div className="permit-header">
              <div className="permit-logo">
                <img src={lguSeal} alt="Municipality of Vinzons Seal" />
              </div>

              <div className="permit-government-heading">
                <p>Republic of the Philippines</p>
                <p>Municipality of Vinzons</p>
                <p>Province of Camarines Norte</p>
                <h2>OFFICE OF THE BUILDING OFFICIAL</h2>
              </div>

              <div className="permit-logo">
                <img src={bagongPilipinasLogo} alt="Bagong Pilipinas Logo" />
              </div>
            </div>

            {/* Permit Title */}
            <div className="permit-title-section">
              <h1>{permitTitle}</h1>

              <div className="permit-coverage">
                <span className={data.coverage === "full" ? "selected" : ""}>
                  {data.coverage === "full" ? "☑" : "☐"} FULL
                </span>

                <span className={data.coverage === "partial" ? "selected" : ""}>
                  {data.coverage === "partial" ? "☑" : "☐"} PARTIAL
                </span>
              </div>
            </div>

            {/* Permit Number and Payment Information */}
            <div className="building-permit-top-info">
              <div className="building-permit-left-info">
                <div>
                  <strong>No.:</strong>
                  <span>{data.permitNo || "________________"}</span>
                </div>

                <div>
                  <strong>Date Issued:</strong>
                  <span>{data.dateIssued || "________________"}</span>
                </div>

                <div>
                  <strong>{isBuilding ? "FSEC No.:" : "FSIC No.:"}</strong>
                  <span>
                    {(isBuilding ? data.fsecNo : data.fsicNo) ||
                      "________________"}
                  </span>
                </div>

                <div>
                  <strong>Date Issued:</strong>
                  <span>
                    {(isBuilding ? data.fsecDateIssued : data.fsicDateIssued) ||
                      "________________"}
                  </span>
                </div>
              </div>

              <div className="building-permit-right-info">
                {!isBuilding && (
                  <div>
                    <strong>Fees Paid:</strong>
                    <span>{data.occupancyFeesPaid || "________________"}</span>
                  </div>
                )}

                <div>
                  <strong>Official Receipt No.:</strong>
                  <span>
                    {(isBuilding
                      ? data.buildingOfficialReceiptNo
                      : data.occupancyOfficialReceiptNo) || "________________"}
                  </span>
                </div>

                <div>
                  <strong>Date Paid:</strong>
                  <span>
                    {(isBuilding
                      ? data.buildingDatePaid
                      : data.occupancyDatePaid) || "________________"}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="permit-document-body">
              {isBuilding ? (
                <BuildingPermitContent data={data} />
              ) : (
                <OccupancyPermitContent data={data} />
              )}
            </div>

            {/* Footer */}
            <div className="permit-document-footer">
              <p>
                THIS CERTIFICATE MAY BE CANCELLED OR REVOKED PURSUANT TO SECTION
                309 OF THE NATIONAL BUILDING CODE OF THE PHILIPPINES (PD 1096)
                AND ITS REVISED IRR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="permit-preview-confirmation">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Have you reviewed the certificate?
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Confirm only after checking the document.
          </p>
        </div>

        <button
          type="button"
          onClick={onConfirmSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckCircle2 size={16} />
          {isSaving ? "Saving Permit..." : "Confirm Save"}
        </button>
      </div>
    </div>
  );
}
