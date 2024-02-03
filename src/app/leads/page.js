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
import { Close } from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddLeadsBtn from "../components/AddLeadsBtn";
// import ExportLeadsBtn from "../components/ExportLeadsBtn";
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
import ExportsLeadsBtn from "../components/ExportLeadsBtn";
import ExportLead from "./component/export";
import {
  leadRegistrationStatus,
  lsqLeadFieldNames,
} from "../../../shared/lsqConstants";

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
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const resultProject = useGetProjectWithPermissionQuery();
  const [selectedProject, setSelectedProject] = useState("All");

  // const projectloader = resultProject.isFetching;
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

  // setting default project

  useEffect(() => {
    if (resultProject?.data?.result && resultProject.data.result.length > 0) {
      const initialSelectedProject = resultProject.data.result[0];
      setSelectedProjectId(initialSelectedProject?._id || null);
      setSelectedProject(
        resultProject.data?.result.length > 1
          ? "All"
          : resultProject.data?.result[0]?.name,
      );
    }
  }, [resultProject]);

  // permissions and project set for  user
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
  // getting leads details
  const { data, isFetching, isLoading, refetch } = useGetLeadsByDateQuery({
    selectedProject,
    selectedStartDate,
    selectedEndDate,
  });

  /// refetch the data
  useEffect(() => {
    refetch();
  }, []);

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

  const getStatusColor = (status) => {
    if (status === leadRegistrationStatus.sucess) {
      return "green";
    }
    if (status === leadRegistrationStatus.duplicate) {
      return "red";
    }
    if (status === leadRegistrationStatus.exist) {
      return "red";
    }
    return "black";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          if (data?.message === "UNAUTHORIZED") {
            console.log("logouted");
            localStorage.removeItem("user");
            window.location.href = "login";
          }
        } else {
          console.log("Data is undefined");
        }
      } catch (error) {
        console.error("Error during CP data fetch:", error);
      }
    };

    fetchData();
  }, [data]);

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
              height: "10px",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "13px",
              },
            }}
            // size="small"
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
              size="md"
            />
          </FormControl>
          <FormControl
            sx={{
              width: "300px",
              // height:"10px",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "10px",
              },
            }}
            // size="small"
          >
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              id="project"
              name="project"
              label="project"
              sx={{ height: "40px" }}
              value={selectedProject}
              onChange={handleChangeProject}
              MenuProps={{ disableScrollLock: true }}
            >
              {resultProject?.data?.result?.length > 1 ? (
                <MenuItem value="All">All</MenuItem>
              ) : null}

              {(resultProject?.data?.result || [])?.map((proj) => (
                <MenuItem key={proj?.name} value={proj?.name}>
                  {proj?.name}
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
            alignItems: "end",
            paddingLeft: "20px",
            // border: "1px solid black",
          }}
        >
          {permissions &&
            permissions.includes(permissionKeyNames?.leadManagement) &&
            selectedProject === "All" && <AddLeadsBtn refetch={refetch} />}

          {permissions &&
            permissions.includes(permissionKeyNames?.leadManagement) &&
            selectedProject !== "All" && (
              <>
                {resultProject?.data?.result?.map((permission) => (
                  <Grid key={permission?.id}>
                    {permission?.permission === "leadAddAndView" &&
                      permission?._id === selectedProjectId && (
                        <AddLeadsBtn refetch={refetch} />
                      )}
                  </Grid>
                ))}
              </>
            )}
          <ExportLead
            data={data?.result}
            excelHeaders={["Name", "CreatedOn", "Email", "Source", "Phone"]}
            excelHeadersMappings={{
              a: lsqLeadFieldNames?.firstName,
              b: lsqLeadFieldNames?.createdOn,
              c: lsqLeadFieldNames?.email,
              d: lsqLeadFieldNames?.source,
              e: lsqLeadFieldNames?.phone,
            }}
          />
        </Grid>
      </Grid>
      <Grid
        sx={{
          // border: "1px solid black",
          display: "flex",
          alignItems: "center",
          height: "10vh",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            border: "1px solid #ffb52f",
            borderRadius: "4px",
          }}
        >
          <Grid
            sx={{
              minHeight: "6vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              backgroundColor: "#ffb52f",
            }}
          >
            <ReportProblemIcon sx={{ fontSize: "20px" }} />
          </Grid>
          <Grid
            sx={{
              minHeight: "6vh",
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(250, 185, 0, 0.1)",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                alignItems: "center",
                paddingLeft: "15px",
                paddingRight: "15px",
                display: "flex",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  borderRight: "1px solid",
                  textAlign: "center",
                }}
              >
                {" "}
                <DoneAllIcon sx={{ fontSize: "18px", color: "green" }} />
                &nbsp;
                <strong>Success</strong> (Bring the Customer to the initial Site
                Visit)
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  borderRight: "1px solid",
                }}
              >
                {" "}
                <DoneAllIcon sx={{ fontSize: "18px", color: "red" }} />
                &nbsp;
                <strong>Duplicate</strong> (Bring the Customer to the initial
                Site Visit)
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  borderRight: "1px solid",
                }}
              >
                {" "}
                <DoneAllIcon sx={{ fontSize: "18px", color: "grey" }} />
                &nbsp;
                <strong>Duplicate</strong> (Customer Already Visited the Site.
                You Can Bring Him/Her Again. You may get the Credit.)
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Close sx={{ fontSize: "18px", color: "red" }} />
                &nbsp;
                <strong>Lead Exists</strong>
              </Typography>
            </Typography>
          </Grid>
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
                      <TableCell sx={{ fontSize: "11px" }}>Name</TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>Contact</TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>Email</TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        Registration Status
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>CP Name</TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>Stage</TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        Created Date
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>Action</TableCell>
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
                      : slicedRows.map((row) => (
                          <TableRow key={row?.id}>
                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.FirstName || "N/A"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.Phone || "**********"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.EmailAddress || (
                                <Typography
                                  sx={{
                                    display: "inline-block",
                                    minWidth: "80px",
                                    // height: "20px",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(250, 185, 0, 1)",
                                    color: "white",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontSize: "14px",
                                  }}
                                >
                                  not provided
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell
                              style={{
                                color: getStatusColor(row?.LeadRegistration),
                              }}
                            >
                              {row.LeadRegistration ===
                              leadRegistrationStatus?.exist ? (
                                <Close sx={{ fontSize: "20px" }} />
                              ) : (
                                <DoneAllIcon sx={{ fontSize: "20px" }} />
                              )}
                            </TableCell>

                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.mx_Sub_Source || "N/A"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.ProspectStage || "N/A"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "11px" }}>
                              {row?.CreatedOn || "N/A"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "11px" }}>
                              <Grid
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Link
                                  href={{
                                    pathname: "/leads/view",
                                    search: `?phone=${row?.Phone}&project=${row?.Project}`,
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      borderRadius: "10px",
                                      color: "black",
                                      width: "48px",
                                      height: "25px",
                                      border: "none",
                                      fontSize: "12px",
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
