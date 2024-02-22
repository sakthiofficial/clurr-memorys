"use client";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "@/reduxSlice/apiSlice";

export default function Page() {
  // const preDefinedValues = [
  //   { label: "Name", key: "name" },
  //   { label: "Email", key: "email" },
  //   { label: "Phone", key: "phone" },
  // ];

  const permissions = [
    {
      name: "Asfer",
      role: "Superadmin",
      userManagement: "Access",
      cpManagement: "Access Denied",
      leads: "Leads With Number",
      projectManagement: "Access Denied",
      activityHistory: "Access",
    },
    {
      name: "Asfer1",
      role: "Admin",
      userManagement: "Access Denied",
      cpManagement: "Access",
      leads: "Leads Without Number",
      projectManagement: "Access",
      activityHistory: "Access Denied",
    },
    {
      name: "Asfer2",
      role: "Cp Branch Head",
      userManagement: "Access",
      cpManagement: "Access Denied",
      leads: "Leads With Number",
      projectManagement: "Access Denied",
      activityHistory: "Access Denied",
    },
    {
      name: "Asfer3",
      role: "Team lead",
      userManagement: "Access Denied",
      cpManagement: "Access Denied",
      leads: "Leads Without Number",
      projectManagement: "Access Denied",
      activityHistory: "Access",
    },
    {
      name: "Asfer4",
      role: "Mis",
      userManagement: "Access",
      cpManagement: "Access",
      leads: "Leads With Number",
      projectManagement: "Access Denied",
      activityHistory: "Access Denied",
    },
    {
      name: "Asfer5",
      role: "Cp Rm",
      userManagement: "Access",
      cpManagement: "Access",
      leads: "Leads With Number",
      projectManagement: "Access Denied",
      activityHistory: "Access Denied",
    },
  ];
  const { data } = useGetUsersQuery();

  const getBackgroundColor = (status) => {
    if (status === "Access") {
      return "rgba(0, 233, 23, 0.2)";
    }
    if (status === "Access Denied") {
      return "rgba(227, 0, 0, 0.2)";
    }

    return "black";
  };

  const getColor = (status) => {
    if (status === "Access") {
      return "rgba(0, 160, 16, 1)";
    }
    if (status === "Access Denied") {
      return "rgba(227, 0, 0, 1)";
    }

    return "black";
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const permissionDatas = permissions || [];
  const slicedRows = permissionDatas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const preDefinedValues = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];
  const [selectedFilter, setSelectedFilter] = useState(preDefinedValues[0]);
  const [filterDatasByCategory, setFilterDatasByCategory] = useState([]);
  const [filterUser, setFilterUser] = useState();
  const [getUserFilter, setGetUserFilter] = useState(null);

  const handleChangeFilter = (event, value) => {
    if (!value) {
      setSelectedFilter(preDefinedValues[0]);
    } else {
      setSelectedFilter(value);
    }
  };

  const handleFilterSearchUser = (event, value) => {
    setGetUserFilter(value);
  };

  useEffect(() => {
    if (selectedFilter?.label) {
      const filteredResults = (data?.result || []).map(
        (item) => item[selectedFilter.key],
      );
      setFilterDatasByCategory(filteredResults);
      // console.log(filteredResults);
    }
  }, [data, selectedFilter]);

  useEffect(() => {
    if (selectedFilter?.label) {
      const filteredResults = data?.result.filter(
        (item) => item[selectedFilter.key] === getUserFilter,
      );
      setFilterUser(filteredResults);
      // console.log("worked");
    }
  }, [getUserFilter]);

  return (
    <Grid style={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          minHeight: "8vh",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          // padding: "0px 10px",
          // border: "1px solid black",
          margin: "10px",
          // flexWrap: "wrap",
        }}
      >
        <Grid sx={{ width: "20%" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "rgba(0, 0, 0, 1)",
            }}
          >
            User List
          </Typography>
        </Grid>
        <Grid
          sx={{
            // border: "1px solid black",
            minWidth: "600px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Grid>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={preDefinedValues}
              sx={{ width: 280 }}
              onChange={handleChangeFilter}
              value={selectedFilter}
              renderInput={(params) => (
                <TextField {...params} label="selecet by" />
              )}
            />
          </Grid>
          <Grid>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={filterDatasByCategory}
              sx={{ width: 280 }}
              onChange={handleFilterSearchUser}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedFilter ? (
                      <>Search By {selectedFilter.label}</>
                    ) : (
                      "select one filter"
                    )
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <TableContainer
          //   component={Paper}
          sx={{
            border: "1px solid lightgrey",
            borderRadius: "29px",
          }}
        >
          <Grid
            sx={{
              padding: "20px",
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
              sx={{ fontSize: "16px", fontWeight: "500" }}
            >
              Permission
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
                <TableCell sx={{ fontSize: "11px" }}>Name</TableCell>
                <TableCell sx={{ fontSize: "11px" }}>Role</TableCell>
                <TableCell sx={{ fontSize: "11px" }}>User Management</TableCell>
                <TableCell sx={{ fontSize: "11px" }}>Cp Management</TableCell>
                <TableCell sx={{ fontSize: "11px" }}>Leads</TableCell>
                <TableCell sx={{ fontSize: "11px" }}>
                  Project Management
                </TableCell>
                <TableCell sx={{ fontSize: "11px" }}>
                  Activity History
                </TableCell>

                <TableCell sx={{ fontSize: "11px" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(slicedRows || []).map((item) => (
                <TableRow key={item.name}>
                  <TableCell sx={{ fontSize: "11px" }}>{item.name}</TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>{item.role}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        // border: "1px solid black",
                        padding: "6px",
                        borderRadius: "10px",
                        backgroundColor: getBackgroundColor(
                          item.userManagement,
                        ),
                        color: getColor(item.userManagement),

                        fontSize: "11px",
                      }}
                      component="span"
                    >
                      {item.userManagement}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    <Typography
                      sx={{
                        // border: "1px solid black",
                        padding: "6px",
                        borderRadius: "10px",
                        backgroundColor: getBackgroundColor(item.cpManagement),
                        fontSize: "11px",
                        color: getColor(item.cpManagement),
                      }}
                      component="span"
                    >
                      {item.cpManagement}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>{item.leads}</TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    <Typography
                      sx={{
                        // border: "1px solid black",
                        padding: "6px",
                        borderRadius: "10px",
                        backgroundColor: getBackgroundColor(
                          item.projectManagement,
                        ),
                        fontSize: "11px",
                        color: getColor(item.projectManagement),
                      }}
                      component="span"
                    >
                      {item.projectManagement}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "11px" }}>
                    <Typography
                      sx={{
                        // border: "1px solid black",
                        padding: "6px",
                        borderRadius: "10px",
                        backgroundColor: getBackgroundColor(
                          item.activityHistory,
                        ),
                        fontSize: "11px",
                        color: getColor(item.activityHistory),
                      }}
                      component="span"
                    >
                      {item.activityHistory}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Link
                        href={{
                          pathname: "/permission/edit",
                        }}
                      >
                        <Button
                          sx={{
                            borderRadius: "10px",
                            color: "black",
                            width: "48px",
                            height: "25px",
                            fontSize: "11px",
                            backgroundColor: "rgba(249, 184, 0, 1)",
                            "&:hover": {
                              backgroundColor: "rgba(249, 184, 0, 1)",
                              boxShadow: "none",
                            },
                          }}
                        >
                          edit
                        </Button>
                      </Link>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={permissionDatas?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ backgroundColor: "white" }}
            disableScrollLock
          />
        </TableContainer>
      </Grid>
    </Grid>
  );
}
