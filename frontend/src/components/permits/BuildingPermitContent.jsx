
export default function BuildingPermitContent({ data }) {
  const classifications = data.classifications || [];

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "________________";
    }

    return `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
     

      {/* Legal Statement */}
      <p className="building-permit-legal-text">
        This PERMIT is issued pursuant to Sections{" "}
        <strong>207, 301, 302 and 304</strong> of the{" "}
        <strong>
          National Building Code of the Philippines (PD 1096)
        </strong>
        , its <strong>Revised IRR</strong>, other{" "}
        <strong>Referral Codes</strong> and its{" "}
        <strong>Terms and Conditions</strong>.
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

        {/* Scope of Work */}
        <div className="building-permit-detail-row">
          <strong>Scope of Work:</strong>
          <span>{data.scopeOfWork || "________________"}</span>
        </div>

        {/* Total Project Cost */}
        <div className="building-permit-detail-row">
          <strong>Total Project Cost:</strong>
          <span>{formatAmount(data.totalProjectCost)}</span>
        </div>

        {/* Professional in Charge */}
        <div className="building-permit-detail-row">
          <strong>Professional in Charge of Construction:</strong>
          <span>{data.professionalInCharge || "________________"}</span>
        </div>
      </div>

      {/* Signatory */}
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
    </>
  );
}
