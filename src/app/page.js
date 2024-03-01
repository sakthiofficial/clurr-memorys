"use client";

import React from "react";
import { Divider, Grid, Typography } from "@mui/material";
import NivoFunnel from "./components/NivoFunnel";
import NivoBump from "./components/Chart";
import NivoPie from "./components/NivoPie";

export default function Home() {
  const newData = [
    { id: "A", label: "Total Leads", value: 6000, color: "rgb(158, 1, 66)" },
    {
      id: "B",
      label: "Register Leads",
      value: 1000,
      color: "rgb(213, 62, 79)",
    },
    { id: "C", label: "Warm Leads", value: 1400, color: "rgb(244, 109, 67)" },
    { id: "D", label: "Booked Site", value: 1800, color: "rgb(253, 174, 97)" },
    { id: "E", label: "Site Visit", value: 3000, color: "rgb(254, 224, 139)" },
  ];

  const pie = [
    {
      id: "ruby",
      label: "Superadmin",
      value: 36,
      color: "hsl(231, 70%, 50%)",
    },
    {
      id: "python",
      label: "Admin",
      value: 305,
      color: "hsl(108, 70%, 50%)",
    },
    {
      id: "erlang",
      label: "Teal Lead",
      value: 211,
      color: "hsl(26, 70%, 50%)",
    },
    {
      id: "hack",
      label: "Branch Head",
      value: 304,
      color: "hsl(210, 70%, 50%)",
    },
    {
      id: "make",
      label: "Execute",
      value: 190,
      color: "hsl(309, 70%, 50%)",
    },
  ];

  return (
    <Grid sx={{ width: "100%", minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "8vh",
          display: "flex",
          alignItems: "center",
          padding: "0px 0px 0px 40px ",
          // border:"1px solid black"
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            color: "rgba(0, 0, 0, 1)",
            // padding: "10px",
          }}
        >
          Dashbaord
        </Typography>
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          marginTop: "10px",
          // boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.10)",
          // height: "70vh",
          display: "flex",
          padding: "20px",
        }}
      >
        <Grid
          sx={{
            // borderBottom: "1px solid lightgray",
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "20px",
            padding: "10px",
            paddingBottom: "30px",
            alignItems: "center",
          }}
        >
          <Grid
            sx={{ border: "1px solid gray", width: "150px", height: "150px" }}
          >
            1
          </Grid>
          <Divider orientation="vertical" />
          <Grid
            sx={{ border: "1px solid black", width: "150px", height: "150px" }}
          >
            1
          </Grid>
          <Divider orientation="vertical" />

          <Grid
            sx={{ border: "1px solid black", width: "150px", height: "150px" }}
          >
            1
          </Grid>
          <Divider orientation="vertical" />

          <Grid
            sx={{ border: "1px solid black", width: "150px", height: "150px" }}
          >
            1
          </Grid>
          <Divider orientation="vertical" />

          <Grid
            sx={{ border: "1px solid black", width: "150px", height: "150px" }}
          >
            1
          </Grid>
          <Divider orientation="vertical" />

          <Grid
            sx={{ border: "1px solid black", width: "150px", height: "150px" }}
          >
            1
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          // padding: "10px",
          // height: "50vh",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          paddingBottom: "30px",
        }}
      >
        <NivoFunnel data={newData} />
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          height: "50vh",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px 0px 20px 0px",
          alignItems: "center",
        }}
      >
        <Grid sx={{ border: "1px solid black", width: "45%" }}>
          <NivoPie data={pie} />
        </Grid>
        <Grid sx={{ border: "1px solid black", width: "50%", height: "40vh" }}>
          1
        </Grid>
      </Grid>
    </Grid>
  );
}
