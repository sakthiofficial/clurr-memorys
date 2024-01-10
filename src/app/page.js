"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
// card icons
import TotalLeads from "../../public/LeadsCard/totalLeads.svg";
import RegisterLeads from "../../public/LeadsCard/registerLeads.svg";
import WarmLeads from "../../public/LeadsCard/warmLeads.svg";
import SiteVisit from "../../public/LeadsCard/siteVisit.svg";
import SiteVisitDone from "../../public/LeadsCard/siteVisitDone.svg";
import BookedLeads from "../../public/LeadsCard/bookLeads.svg";

// card details
const users = [
  { name: "TotalLeads", icon: TotalLeads, total: "123" },
  { name: "RegisterLeads", icon: RegisterLeads, total: "123" },
  { name: "WarmLeads", icon: WarmLeads, total: "123" },
  { name: "Site Visit Scheduled", icon: SiteVisit, total: "123" },
  { name: "Site Visit Done Leads", icon: SiteVisitDone, total: "123" },
  { name: "Booked leads", icon: BookedLeads, total: "123" },
];

export default function Home() {
  // background color card
  const getBackgroundColor = (name) => {
    switch (name) {
      case "WarmLeads":
        return "rgba(255, 92, 0, 0.08)";
      case "Site Visit Scheduled":
        return "rgba(205, 172, 0, 0.08)";
      case "Site Visit Done Leads":
        return "rgba(219, 0, 255, 0.08)";
      default:
        return "rgba(0, 133, 255, 0.08)";
    }
  };

  return (
    <Grid sx={{ width: "100%", height: "100vh" }}>
      <Grid
        sx={{
          height: "8vh",
          // border: "1px solid black",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          Dashbaord
        </Typography>
      </Grid>
      <Grid
        sx={{
          minHeight: "30vh",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexWrap: "wrap",
          // border: "1px solid black",
          marginTop: "5px",
          gap: "15px",
        }}
      >
        {users?.map((item) => (
          <Grid
            key={item?.name}
            sx={{
              width: "165px",
              height: "150px",
              boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.10)",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              border: "0.5px solid #BDBDBD",
              borderRadius: "13px",
            }}
          >
            <Grid
              sx={{
                // border: "1px solid black",
                height: "80%",
                width: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Grid
                sx={{
                  width: "51px",
                  height: "51px",
                  borderRadius: "9px",
                  backgroundColor: getBackgroundColor(item?.name),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  alt={item?.name}
                  src={item?.icon}
                  width={26}
                  height={26}
                />
              </Grid>
              <Typography
                sx={{ color: "#454545", fontSize: "14px", fontWeight: "400" }}
              >
                {item?.name}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 1)",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {item?.total}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
