"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MovingIcon from "@mui/icons-material/Moving";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import NivoFunnel from "./components/NivoFunnel";
import NivoPie from "./components/NivoPie";
import NivoBar from "./components/NivoBar";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { useGetLeadsByDateQuery } from "@/reduxSlice/apiSlice";
import { dateToUnixTimestamp } from "../../shared/dateCalc";

export default function Home() {
  const [selectedProject] = useState("Galleria Gardens - Balanagar");

  // Calculate last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const startDate = sevenDaysAgo.toISOString().slice(0, 10);
  const endDate = today.toISOString().slice(0, 10);
  const selectedStartDate = dateToUnixTimestamp(startDate);
  const selectedEndDate = dateToUnixTimestamp(endDate);

  // console.log(startDate);
  // console.log(startEndDate);
  // console.log(selectedProject);

  const newData = [
    {
      id: "A",
      label: "Total Leads",
      value: 6000,
      color: "#d4dffa",
      up: "yes",
    },
    {
      id: "B",
      label: "Register Leads",
      value: 4500,
      color: "#a6bff5",
      up: "yes",
    },
    {
      id: "D",
      label: "Booked",
      value: 1800,
      color: "#4f7deb",
      up: "yes",
    },
    { id: "E", label: "SV Done", value: 3000, color: "#235de6" },
  ];

  const pie = [
    {
      id: "Housing.com",
      label: "Housing.com",
      value: 300,
    },
    {
      id: "99 Acre",
      label: "99 Acre",
      value: 20,
    },
    {
      id: "No Broker",
      label: "No Broker",
      value: 60,
    },
    {
      id: "Others",
      label: "Others",
      value: 10,
    },
  ];

  const [cardData, setCardData] = useState([
    {
      name: "Lead Ratio",
      value: "26 %",
      formula: "Total leads by Register leads",
      up: "yes",
    },
    {
      name: "Register Ratio",
      value: "3 %",
      formula: "Total leads by Register leads",
    },
    {
      name: "Warm Ratio",
      value: "13 %",
      formula: "Total leads by Register leads",
    },
    {
      name: "Booked Ratio",
      value: "18 %",
      formula: "Total leads by Register leads",
      up: "yes",
    },
    {
      name: "Site Ratio",
      value: "9 %",
      formula: "Total leads by Register leads",
    },
  ]);

  const barDetails = [
    {
      country: "20-1-24",
      "hot dog": 12,
      "hot dogColor": "hsl(140, 70%, 20%)",
    },
    {
      country: "21-1-24",
      "hot dog": 16,
      "hot dogColor": "hsl(149, 70%, 50%)",
    },
    {
      country: "22-1-24",
      "hot dog": 20,
      "hot dogColor": "hsl(274, 70%, 50%)",
    },
    {
      country: "23-1-24",
      "hot dog": 11,
      "hot dogColor": "hsl(292, 70%, 50%)",
    },
    {
      country: "24-1-24",
      "hot dog": 24,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "25-1-24",
      "hot dog": 8,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "26-1-24",
      "hot dog": 14,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "27-1-24",
      "hot dog": 9,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "28-1-24",
      "hot dog": 10,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "29-1-24",
      "hot dog": 12,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "30-1-24",
      "hot dog": 7,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "01-1-24",
      "hot dog": 15,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "02-1-24",
      "hot dog": 10,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "03-1-24",
      "hot dog": 24,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
    {
      country: "04-1-24",
      "hot dog": 18,
      "hot dogColor": "hsl(97, 70%, 50%)",
    },
  ];

  const rows = [
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
    {
      name: "Asfer",
      calories: 8220958384,
      fat: "asfer@gmail.com",
      carbs: "Success",
    },
  ];

  const { data, isFetching, isLoading } = useGetLeadsByDateQuery({
    selectedProject,
    selectedStartDate,
    selectedEndDate,
  });

  console.log(data?.result?.length);

  return (
    <Grid sx={{ width: "100%", minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "8vh",
          display: "flex",
          alignItems: "center",
          padding: "0px 0px 0px 20px ",
          // borderBottom: "1px solid gray",
          marginBottom: "40px",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            color: "rgba(0, 0, 0, 1)",
            // paddingBottom: "30px",
          }}
        >
          Dashboard (Last 15 days)
        </Typography>
      </Grid>
      {/* <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          display: "flex",
          padding: "20px",
        }}
      >
        <Grid
          sx={{
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
          {(cardData || []).map((item, index) => (
            <>
              <Grid
                sx={{
                  width: "180px",
                  height: "100px",
                  // border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  // gap:"20px"
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "black",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: "24px", fontWeight: "400" }}>
                      {item.value}
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      // border: "1px solid lightgray",
                      width: "50px",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item?.up === "yes" ? (
                      <MovingIcon sx={{ color: "green" }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: "red" }} />
                    )}
                  </Grid>
                </Grid>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "midbold",
                  }}
                >
                  {item.formula}
                </Typography>
              </Grid>
              {index !== cardData.length - 1 && (
                <Divider orientation="vertical" />
              )}
            </>
          ))}
        </Grid>
      </Grid> */}
      <Grid
        sx={{
          // border: "1px solid black",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid lightgray",
          // paddingTop: "20px",
        }}
      >
        <Typography>Funnel Flow</Typography>
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          // paddingBottom: "40px",
        }}
      >
        <NivoFunnel data={newData} />
      </Grid>
      {/* <Grid
        sx={{
          // border: "1px solid black",
          display: "flex",
          paddingTop: "20px",
          padding: "20px 25px 0px 25px",
        }}
      >
        <Typography sx={{ width: "50%", color: "gray" }}>
          Recent 7 Days Lead Registered
        </Typography>
        <Grid
          sx={{
            width: "50%",
            color: "gray",
            display: "flex",
            justifyContent: "space-between",
            // border: "1px solid black",
            // padding:"20px"
          }}
        >
          <Typography>Last 7 Lead List</Typography>
          <Typography sx={{ color: "gary", cursor: "pointer" }}>
            <Link
              href="leads"
              style={{
                color: "gary",
                textDecoration: "none",
                "&:visited": { color: "gary" },
              }}
            >
              View All
            </Link>
          </Typography>
        </Grid>
      </Grid> */}

      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          // minHeight: "80vh",
          // display: "flex",
          justifyContent: "space-between",
          // padding: "0px 20px 0px 20px",
          alignItems: "center",
          flexWrap: "wrap",
          // flexDirection: "row",
          // width:"100%"
        }}
      >
        {/* <Grid
          sx={{
            width: "35%",
            // border: "1px solid lightgray",
            height: "55vh",
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            // flexDirection: "column",
          }}
        >
          <NivoPie data={pie} />
        </Grid> */}
        <Grid
          sx={{
            // border: "1px solid black",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Recent Leads Registration</Typography>
        </Grid>

        <Grid
          sx={{
            width: "100%",
            border: "1px solid lightgray",
            minHeight: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <NivoBar data={barDetails} />
        </Grid>
        <Grid
          style={{
            borderBottom: "1px solid lightgray",
            // height: "65vh",
          }}
        />
        <Grid
          sx={{
            // border: "1px solid black",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Last 7 Days Leads</Typography>
          <Typography>
            <Link
              href="/leads"
              style={{ color: "black", textDecoration: "none" }}
            >
              View All
            </Link>
          </Typography>
        </Grid>

        <Grid
          sx={{
            // width: "50%",
            border: "1px solid lightgray",
            height: "65vh",
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            // padding: "15px",
            marginBottom: "30px",
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 450 }}>
              <TableHead>
                <TableRow sx={{ height: "5vh" }}>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Contact</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Registration&nbsp;Status</TableCell>
                </TableRow>
              </TableHead>
              {/* {data?.result?.length === 0 ? (
                <Box
                  sx={{
                    height: "49vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "auto",
                      // border:"1px solid black",
                      // minWidth:"400px"
                    }}
                  >
                    No leads
                  </Typography>
                </Box>
              ) : ( */}
              <TableBody sx={{ height: "49vh" }}>
                {(rows || []).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.calories}</TableCell>
                    <TableCell align="center">{row.fat}</TableCell>
                    <TableCell align="center">{row.carbs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* )} */}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
