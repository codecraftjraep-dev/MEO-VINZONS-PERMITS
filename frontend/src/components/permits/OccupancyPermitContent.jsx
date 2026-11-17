export default function OccupancyPermitContent({ data }) {
  const formattedDate = data.dateIssued
    ? new Date(data.dateIssued)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        .toUpperCase()
    : "________________";

  const classifications = data.classifications || [];

  return (
    <>
      {/* Certificate of Occupancy Content */}
      <div className="occupancy-permit-content">
        <p className="building-permit-legal-text">
          This is to certify that the building/structure which has been designed
          and constructed conforms to the issued Building Permit No.{" "}
          <strong className="occupancy-permit-underline">
            {data.permitNo || "________________"}
          </strong>{" "}
          dated{" "}
          <strong className="occupancy-permit-underline">
            {formattedDate}
          </strong>
          .
        </p>

        {/* Project and Owner Details */}
        <div className="building-permit-details building-permit-details-inset">
          <div className="building-permit-detail-row">
            <strong>Name of Owner:</strong>

            <div className="building-permit-owner-list">
              {data.owners?.length > 0 ? (
                data.owners.map((owner, index) => {
                  const careOfNames =
                    owner.careOf?.filter((name) => name.trim()) || [];

                  return (
                    <div key={index} className="building-permit-owner">
                      {data.owners.length > 1 ? `${index + 1}. ` : ""}
                      {owner.name}

                      {careOfNames.length > 0 && (
                        <>
                          {" c/o "}
                          {careOfNames.join(" & ")}
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <span>________________</span>
              )}
            </div>
          </div>

          <div className="building-permit-detail-row">
            <strong>Name of Project:</strong>
            <span>{data.projectName || "________________"}</span>
          </div>

          <div className="building-permit-detail-row">
            <strong>Project Location:</strong>
            <span>{data.projectLocation || "________________"}</span>
          </div>

          {/* Date of Completion */}
          <div className="building-permit-detail-row">
            <strong>Date of Completion:</strong>
            <span>{data.dateOfCompletion || "________________"}</span>
          </div>

          {/* Occupancy and Classification */}
          <div className="building-permit-occupancy-section">
            <div className="occupancy-field">
              <strong>Use or Character of Occupancy:</strong>
              <span>{data.occupancy || "________________"}</span>
            </div>

            <div className="building-permit-classification">
              <div className="classification-column">
                {classifications.length > 0 ? (
                  classifications.map((item, index) => (
                    <div className="classification-entry" key={index}>
                      <strong>Group:</strong>
                      <span>{item.group || "—"}</span>
                    </div>
                  ))
                ) : (
                  <div className="classification-entry">
                    <strong>Group:</strong>
                    <span>________________</span>
                  </div>
                )}
              </div>

              <div className="classification-column">
                {classifications.length > 0 ? (
                  classifications.map((item, index) => (
                    <div className="classification-entry" key={index}>
                      <strong>Div:</strong>
                      <span>{item.division || "—"}</span>
                    </div>
                  ))
                ) : (
                  <div className="classification-entry">
                    <strong>Div:</strong>
                    <span>________________</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="occupancy-permit-legal-text">
          The Owner shall properly maintain the building/structure to enchance
          its architectural well-being, structural stability, electrical,
          mechanical, sanitation, plumbing, electronics, interior design and
          fire-protective properties and shall not be occupied or used for
          purposed other than its intended use as stated above.
        </p>

        <p className="occupancy-permit-legal-text">
          This <strong>Certificate of Occupancy</strong> is hereby issued
          pursuant to Section 309 of the National Building Code of the
          Philippines (PD 1096), its Revised IRR, other Referral Codes.
        </p>

        {/* Certification and Signatory */}
        <div className="occupancy-permit-certification-section">
          {/* Certification - Left Side */}
          <div className="occupancy-permit-certification">
            <p className="occupancy-permit-legal-text">
              <strong>
                A certified copy hereof shall be posted within the premises of
                the building/structure and shall not be removed without the
                authority from the Building Official.
              </strong>
            </p>
          </div>

          {/* Signatory - Right Side */}
          <div className="building-permit-signatory">
            <div className="building-permit-signature-line">
              <strong>
                {data.buildingOfficialName || "MARK ANTHONY A. REMOROZA"}
              </strong>
              <span>BUILDING OFFICIAL</span>
            </div>

            <div className="building-permit-signatory-date">
              <span>Date:</span>
              <strong>
                {data.buildingOfficialDate || "____________________"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
