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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import Link from "next/link";
import { DateRangePicker } from "rsuite";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import AddLeadsBtn from "../components/AddLeadsBtn";
import ExportLeadsBtn from "../components/ExportLeadsBtn";
// import TotalLeads from "../../../public/LeadsCard/totalLeads.svg";
// import RegisterLeads from "../../../public/LeadsCard/registerLeads.svg";
// import WarmLeads from "../../../public/LeadsCard/warmLeads.svg";
// import SiteVisit from "../../../public/LeadsCard/siteVisit.svg";
// import SiteVisitDone from "../../../public/LeadsCard/siteVisitDone.svg";
// import Booked from "../../../public/LeadsCard/bookLeads.svg";
import { permissionKeyNames } from "../../../shared/cpNamings";
import { dateToUnixTimestamp } from "../../../shared/dateCalc";
import "rsuite/dist/rsuite.min.css";
import {
  useGetLeadsByDateQuery,
  useGetProjectWithPermissionQuery,
} from "@/reduxSlice/apiSlice";

// card details
// const users = [
//   { name: "Total Leads", icon: TotalLeads, total: "123" },
//   { name: "Register Leads", icon: RegisterLeads, total: "123" },
//   { name: "Warm Leads", icon: WarmLeads, total: "123" },
//   { name: "Site Visit Scheduled", icon: SiteVisit, total: "123" },
//   { name: "Site Visit Done Leads", icon: SiteVisitDone, total: "123" },
//   { name: "Booked Leads", icon: Booked, total: "123" },
// ];

// predefined dates
const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date("2023-09-15"), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];

      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: "default",
  },
  {
    label: "Next week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];

      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: "default",
  },
];

export default function Page() {
  const [permissions, setPermissions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const resultProject = useGetProjectWithPermissionQuery();
  const projectloader = resultProject.isFetching;
  // console.log(projectloader);
  // project change and set intial project functions

  const handleChangeProject = async (event) => {
    const selectedProjectName = event.target.value;
    setSelectedProject(selectedProjectName);

    const selectProject = resultProject?.data?.result?.find(
      (project) => project.name === selectedProjectName,
    );

    setSelectedProjectId(selectProject?._id || null);

    // console.log(selectedProject);
  };

  // console.log(selectedProjectId);
  // useEffect(() => {
  //   if (projects && projects.length > 0) {
  //     setSelectedProject(projects[0]);
  //   }
  // }, [projects]);

  useEffect(() => {
    if (resultProject?.data?.result && resultProject.data.result.length > 0) {
      const initialSelectedProject = resultProject.data.result[0];
      setSelectedProjectId(initialSelectedProject?._id || null);
    }
  }, [resultProject]);

  // permissions and project set for login user
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setPermissions(jsonData.permissions || []);
      setProjects(jsonData.projects || []);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);

  // console.log(resultProject?.data?.result);

  // date range functions

  const { combine, before, afterToday } = DateRangePicker;
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 6);
  const defaultFilterValue = [new Date("2024-01-01"), new Date()];

  const Calendar = {
    sunday: "Su",
    monday: "Mo",
    tuesday: "Tu",
    wednesday: "We",
    thursday: "Th",
    friday: "Fr",
    saturday: "Sa",
    ok: "Apply",
    today: "Today",
    yesterday: "Yesterday",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    formattedMonthPattern: "MMM yyyy",
    formattedDayPattern: "dd MMM yyyy",
  };
  const locale = {
    DateRangePicker: {
      ...Calendar,
      last7Days: "Last 7 Days",
    },
  };

  const intialStartDate = dateToUnixTimestamp(defaultFilterValue[0]);
  const intialEndDate = dateToUnixTimestamp(defaultFilterValue[1]);

  const [selectedStartDate, SetSelectedStartDate] = useState(intialStartDate);
  const [selectedEndDate, SetSelectedEndDate] = useState(intialEndDate);

  // console.log(data);

  const handleDateRangeFilter = (newValue) => {
    if (newValue[0] !== null && newValue[1] !== null) {
      const startSelectDate = dateToUnixTimestamp(newValue[0]);
      SetSelectedStartDate(startSelectDate);
      const endSelectDate = dateToUnixTimestamp(newValue[1]);
      SetSelectedEndDate(endSelectDate);
    }
  };

  const { data, isFetching, isLoading } = useGetLeadsByDateQuery({
    selectedProject,
    selectedStartDate,
    selectedEndDate,
  });

  // useEffect(() => {
  //   if (
  //     selectedDateRangeFilter[0] === null &&
  //     selectedDateRangeFilter[1] === null
  //   ) {
  //     SetSelectedStartDate(predefinedRanges[0].value[0]);
  //     SetSelectedEndDate(predefinedRanges[0].value[1]);
  //   } else {
  //     const [startDate, endDate] = selectedDateRangeFilter;

  //     SetSelectedStartDate(startDate);
  //     SetSelectedEndDate(endDate);
  //   }
  // }, [selectedDateRangeFilter]);

  // table functions

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const leadsDatas = data?.result || data || [];
  const slicedRows =
    leadsDatas.length > 1
      ? leadsDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];

  // const rowlength = slicedRows.length;
  // console.log(rowlength);
  // card details
  // const getBackgroundColor = (name) => {
  //   switch (name) {
  //     case "Warm Leads":
  //       return "rgba(255, 92, 0, 0.08)";
  //     case "Site Visit Scheduled":
  //       return "rgba(205, 172, 0, 0.08)";
  //     case "Site Visit Done Leads":
  //       return "rgba(219, 0, 255, 0.08)";
  //     default:
  //       return "rgba(0, 133, 255, 0.08)";
  //   }
  // };
  // console.log(data.result);
  return (
    <Grid style={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "8vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // padding:"0px 10px"
          // border: "1px solid black",
        }}
      >
        <Grid
          sx={{
            minWidth: "120px",
            paddingRight: "30px",
            // border: "1px solid black",
          }}
        >
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
        <Grid sx={{ minWidth: "600px", display: "flex" }}>
          <FormControl
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "13px",
              },
            }}
            size="small"
          >
            <DateRangePicker
              defaultValue={defaultFilterValue}
              ranges={predefinedRanges}
              placeholder="Fitler By Date"
              disabledDate={combine(before("08/10/2023"), afterToday())}
              locale={locale}
              style={{ width: 250 }}
              onOk={(value) => handleDateRangeFilter(value)}
              onChange={(value) => handleDateRangeFilter(value)}
            />
          </FormControl>
          <FormControl
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "13px",
              },
            }}
            size="small"
          >
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
              <MenuItem value="All">All</MenuItem>
              {resultProject?.data?.result?.map((proj) => (
                <MenuItem key={proj.name} value={proj.name}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          sx={{
            gap: "10px",
            minWidth: "300px",
            display: "flex",
            justifyContent: "end",
            paddingLeft: "20px",
            // border: "1px solid black",
          }}
        >
          {/* {permissions &&
            permissions.includes(permissionKeyNames.leadManagement) && (
              <AddLeadsBtn />
            )} */}
          {permissions &&
            permissions.includes(permissionKeyNames.leadManagement) && (
              <>
                {resultProject?.data?.result?.map((permission) => (
                  <Grid key={permission.id}>
                    {permission.permission === "leadAddAndView" &&
                      permission._id === selectedProjectId && <AddLeadsBtn />}
                  </Grid>
                ))}
              </>
            )}
          {/* <ExportLeadsBtn /> */}
        </Grid>
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
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "80vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {isFetching ? (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "80vh",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Table
                  sx={{ boxShadow: "0px 6px 32px 0px rgba(0, 0, 0, 0.15)" }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "rgba(249, 184, 0, 0.1)",
                        fontWeight: "500",
                        color: "black",
                      }}
                    >
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>CP Name</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slicedRows?.length === 0
                      ? [0, 1, 2, 3, 4, 5, 6].map(() => {
                          return (
                            <TableRow>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                              <TableCell>*******</TableCell>
                            </TableRow>
                          );
                        })
                      : slicedRows?.map((row) => (
                          <TableRow key={row?.id}>
                            <TableCell>{row?.FirstName || "N/A"}</TableCell>
                            <TableCell>{row?.Phone || "N/A"}</TableCell>
                            <TableCell>{row?.EmailAddress || "N/A"}</TableCell>
                            <TableCell>{row?.mx_Sub_Source || "N/A"}</TableCell>
                            <TableCell>{row?.ProspectStage || "N/A"}</TableCell>
                            <TableCell>{row?.CreatedOn || "N/A"}</TableCell>
                            <TableCell>
                              <Grid
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Link
                                  href={{
                                    pathname: "/leads/view",
                                    search: `?phone=${row?.Phone}&project=${selectedProject}`,
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      borderRadius: "10px",
                                      color: "black",
                                      width: "58px",
                                      height: "28px",
                                      border: "none",
                                      backgroundColor: "rgba(249, 184, 0, 1)",
                                      "&:hover": {
                                        backgroundColor: "rgba(249, 184, 0, 1)",
                                        boxShadow: "none",
                                        border: "none",
                                      },
                                    }}
                                  >
                                    view
                                  </Button>
                                </Link>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={leadsDatas?.length || 0}
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
