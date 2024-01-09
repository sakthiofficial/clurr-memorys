"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Image from "next/image";
// components
import AddLeadsBtn from "../components/AddLeadsBtn";
import ViewLeadsBtn from "../components/ViewLeadsBtn";
import ExportLeadsBtn from "../components/ExportLeadsBtn";
// card icons
import TotalLeads from "../../../public/LeadsCard/totalLeads.svg";
import RegisterLeads from "../../../public/LeadsCard/registerLeads.svg";
import WarmLeads from "../../../public/LeadsCard/warmLeads.svg";
import SiteVisit from "../../../public/LeadsCard/siteVisit.svg";
import SiteVisitDone from "../../../public/LeadsCard/siteVisitDone.svg";
import Booked from "../../../public/LeadsCard/bookLeads.svg";

// card details
const users = [
  { name: "Total Leads", icon: TotalLeads, total: "123" },
  { name: "Register Leads", icon: RegisterLeads, total: "123" },
  { name: "Warm Leads", icon: WarmLeads, total: "123" },
  { name: "Site Visit Scheduled", icon: SiteVisit, total: "123" },
  { name: "Site Visit Done Leads", icon: SiteVisitDone, total: "123" },
  { name: "Booked Leads", icon: Booked, total: "123" },
];

export default function Page() {
  // card background change
  const getBackgroundColor = (name) => {
    switch (name) {
      case "Warm Leads":
        return "rgba(255, 92, 0, 0.08)";
      case "Site Visit Scheduled":
        return "rgba(205, 172, 0, 0.08)";
      case "Site Visit Done Leads":
        return "rgba(219, 0, 255, 0.08)";
      default:
        return "rgba(0, 133, 255, 0.08)";
    }
  };

  // table details
  const rows = [
    {
      id: "1",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "2",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "3",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "4",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "5",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "6",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "7",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "8",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "9",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
    {
      id: "10",
      name: "asfer",
      contact: "1000001000",
      email: "asferali8384@gmail.com",
      project: "HG",
      status: "success",
      stage: "New",
      createdBy: "Ammer Khan - Moon Relators",
    },
  ];

  // pagination functions
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Grid style={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "8vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid sx={{ width: "60%" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "rgba(0, 0, 0, 1)",
              // border: "1px solid black",
            }}
          >
            Lead List
          </Typography>
        </Grid>
        <Grid
          sx={{
            gap: "10px",
            width: "40%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <AddLeadsBtn />
          <ExportLeadsBtn />
        </Grid>
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
        {users.map((item) => (
          <Grid
            key={item.name}
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
                  backgroundColor: getBackgroundColor(item.name),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image alt={item.name} src={item.icon} width={26} height={26} />
              </Grid>
              <Typography
                sx={{ color: "#454545", fontSize: "14px", fontWeight: "400" }}
              >
                {item.name}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 1)",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {item.total}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid>
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid lightgrey",
            borderRadius: "29px",
          }}
        >
          <Grid
            sx={{
              padding: "20px",
              // border: "1px solid black",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#021522",
              color: "white",
              height: "58px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSixe: "16px", fontWeight: "500" }}
            >
              Leads List
            </Typography>
            <TextField
              variant="outlined"
              id="filled-hidden-label-small"
              size="small"
              placeholder="search"
              sx={{
                border: "1px solid rgba(182, 190, 196, 1)",
                width: "298px",
                height: "39px",
                borderRadius: "11px",
                "& .MuiOutlinedInput-input": {
                  color: "rgba(158, 158, 158, 1)",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "11px",
                  outline: "none !important",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(158, 158, 158, 1)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Table sx={{ boxShadow: "0px 6px 32px 0px rgba(0, 0, 0, 0.15)" }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "rgba(249, 184, 0, 0.1)",
                  fontWeight: "500",
                  color: "black",
                }}
              >
                <TableCell>Lead Id#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.stage}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ViewLeadsBtn />
                      <Button
                        sx={{
                          border: "1px solid red",
                          borderRadius: "10px",
                          color: "red",
                          marginLeft: "5px",
                          width: "58px",
                          height: "28px",
                          "&:hover": {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ backgroundColor: "white" }}
          />
        </TableContainer>
      </Grid>
    </Grid>
  );
}
