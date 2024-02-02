import React, { useCallback, useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/material";

const exportToExcel = async (
  data,
  excelHeaders,
  excelHeadersMappings,
  filename,
) => {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Set header formatting
  const headerRow = worksheet.addRow(excelHeaders || Object.keys(data[0]));
  headerRow.eachCell((cell) => {
    cell.font = { color: { argb: "000000" }, size: 12 };
    cell.alignment = {
      horizontal: "center",
      vertical: "center",
    };
  });

  // Add data rows
  data.forEach((row) => {
    const values = excelHeadersMappings
      ? (Object.values(excelHeadersMappings) || []).map((key) => row[key])
      : Object.values(row);
    const rowValues = (values || []).map((value) => {
      if (Array.isArray(value)) {
        return value.join(",");
      }
      return value;
    });

    // Add the row and set text wrapping
    const dataRow = worksheet.addRow(rowValues);
    dataRow.eachCell((cell) => {
      cell.alignment = {
        wrapText: cell.value.length > 10,
        height: 2,
        horizontal: "center",
        vertical: "top",
      };
    });
  });

  // Generate a Blob containing the Excel file
  const blob = await workbook.xlsx.writeBuffer();

  // Create a download link and trigger the download
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "exported_data.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

function ExportLead({ data, excelHeaders, excelHeadersMappings, filename }) {
  const [excelData, setExcelData] = useState(data);
  useEffect(() => {
    setExcelData(data);
  }, [data]);
  const handleExportExcel = useCallback(() => {
    exportToExcel(
      excelData,
      excelHeaders,
      excelHeadersMappings,
      filename || "exported_data.xlsx",
    );
  });

  return (
    <div>
      {/* Your Material-UI table or other UI elements here */}

      {/* Button to trigger the export */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: "rgba(249, 184, 0, 1)",
          color: "black",
          width: "154px",
          height: "43px",
          borderRadius: "13px",
          border: "none",
          fontSize: "13px",
          fontWeight: "400",
          "&:hover": {
            backgroundColor: "rgba(249, 184, 0, 1)",
            boxShadow: "none",
            border: "none",
          },
        }}
        onClick={handleExportExcel}
      >
        Export to Excel
      </Button>
    </div>
  );
}

export default ExportLead;
