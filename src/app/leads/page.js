"use client";

import React, { useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { useGetLeadsQuery, useGetProjectQuery } from "@/reduxSlice/apiSlice";

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
  const [permissions, setPermissions] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);

  const handleChangeProject = (event) => {
    const selectedProjectName = event.target.value;
    setSelectedProject(selectedProjectName);
  };
  // const resultProjectName = useGetProjectQuery();
  // console.log(resultProjectName)

  // const resultLeads = useGetLeadsQuery(selectedProject);
  // console.log(resultLeads.data);

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setPermissions(jsonData.permissions || []);
      setProjects(jsonData.projects || []);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, [localStorage.getItem("user")]);

  // useEffect(() => {
  //   // Your local storage logic

  //   // Fetch leads data when selectedProject changes
  //   if (selectedProject) {
  //     resultLeads.refetch({ project: selectedProject });
  //   }
  // }, [selectedProject]);

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
  const result = useGetLeadsQuery();
  // console.log(result.data);

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

  const slicedRows = result.data?.slice(
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
          // padding:"0px 10px"
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
        <FormControl sx={{ width: "50%" }} size="small">
          <InputLabel id="project-label">Project</InputLabel>
          <Select
            labelId="project-label"
            id="project"
            name="project"
            label="project"
            value={selectedProject}
            onChange={handleChangeProject}
            MenuProps={{ disableScrollLock: true }}
          >
            {projects?.map((proj) => (
              <MenuItem key={proj.id} value={proj.name}>
                {proj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid
          sx={{
            gap: "10px",
            width: "40%",
            display: "flex",
            justifyContent: "end",
            paddingLeft: "20px",
          }}
        >
          {permissions && permissions.includes("LM") && <AddLeadsBtn />}
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
                users
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
                <TableCell>Stage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedRows?.map((row) => (
                <TableRow key={row?.id}>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.ProspectAutoId || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.FirstName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.Phone || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.EmailAddress || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.mx_Origin_Project || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.ProspectStage || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.ProspectStage || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    {row?.CreatedOn || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ViewLeadsBtn />
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={result.data?.length || 0} // Use result.data for the count
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
