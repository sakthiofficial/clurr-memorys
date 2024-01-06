"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import { ResponsiveBump } from "@nivo/bump";
import Select from "react-select";

function NivoBump() {
  const [colorScheme, setColorScheme] = useState("spectral");

  const schemeOptions = [
    { value: "nivo", label: "Nivo", colors: ["#ff0000", "#234535"] },
    { value: "reds", label: "Reds", colors: ["#00FF00", "#236456"] },
    { value: "blues", label: "Blues", colors: ["#00FFFF", "#572535"] },
    { value: "spectral", label: "Spectral", colors: ["#0FFFF0", "#765436"] },
    { value: "accent", label: "Accent", colors: ["#11FF22", "#124535"] },
    { value: "paired", label: "Paired", colors: ["#FF2344", "#875797"] },
  ];

  const bumpData = [
    {
      id: "Totalleads",
      data: [
        { x: "2000-01-01", y: 11 },
        { x: "2001-01-01", y: 15 },
        { x: "2002-01-01", y: 26 },
        { x: "2003-01-01", y: 12 },
        { x: "2004-01-01", y: 15 },
        { x: "2005-01-01", y: 22 },
      ],
    },
    {
      id: "registerLeads",
      data: [
        { x: "2000-01-01", y: 30 },
        { x: "2001-01-01", y: 30 },
        { x: "2002-01-01", y: 17 },
        { x: "2003-01-01", y: 25 },
        { x: "2004-01-01", y: 25 },
        { x: "2005-01-01", y: 20 },
      ],
    },
  ];

  function MyResponsiveBump({ data, colorScheme }) {
    // Calculate the maximum value in the dataset to determine the upper limit for tick values
    const maxDataValue = Math.max(
      ...data.flatMap((serie) => serie.data.map((point) => point.y))
    );
  
    // Determine the upper limit for tick values (rounded up to the nearest multiple of 500)
    const upperLimit = Math.ceil(maxDataValue / 500) * 500;
  
    // Generate an array of tick values starting from 0 up to the upper limit at intervals of 500
    const tickValues = Array.from({ length: (upperLimit / 500) + 1 }, (_, index) => index * 500);
  
    return (
      <ResponsiveBump
        data={data}
        colors={{ scheme: colorScheme }}
        lineWidth={3}
        activeLineWidth={6}
        inactiveLineWidth={3}
        inactiveOpacity={0.15}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={0}
        pointColor={{ theme: "background" }}
        pointBorderWidth={3}
        activePointBorderWidth={3}
        pointBorderColor={{ from: "serie.color" }}
        axisTop={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 1,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "ranking",
          legendPosition: "middle",
          legendOffset: 30,
          invert: true,
          tickValues, // Set custom tick values
        }}
        margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
        axisRight={null}
        width={1115}
        height={457}
      />
    );
  }
  
  

  const formatSelectOptions = ({ value, label, colors }) => (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: "80px" }}>{label}</div>
      <div style={{ alignItems: "end" }}>
        {colors.map((colorValue) => (
          <span key={colorValue} style={{ backgroundColor: colorValue }}>
            &nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );

  const handleChange = (selectedOption) => {
    setColorScheme(selectedOption.value);
  };

  function CustomSelectOptions() {
    return (
      <Select
        formatOptionLabel={formatSelectOptions}
        defaultValue={schemeOptions[0]}
        options={schemeOptions}
        onChange={handleChange}
      />
    );
  }

  return (
    <CCard>
      <CCardBody style={{ height: "600px" }}>
        <MyResponsiveBump data={bumpData} colorScheme={colorScheme} />
      </CCardBody>
    </CCard>
  );
}

export default NivoBump;
