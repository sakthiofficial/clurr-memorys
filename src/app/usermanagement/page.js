"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Button,
  TablePagination,
  CircularProgress,
  Box,
  DialogActions,
  Dialog,
  TextField,
  Autocomplete,
} from "@mui/material";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import styled from "@emotion/styled";
import Image from "next/image";
// import SuperAdmin from "../../../public/UserCard/SuperAdmin.svg";
// import Admin from "../../../public/UserCard/Admin.svg";
// import CPHead from "../../../public/UserCard/CPHead.svg";
// import CPLead from "../../../public/UserCard/CPLead.svg";
// import CPManager from "../../../public/UserCard/CPManager.svg";
// import ChanelPartner from "../../../public/UserCard/ChanelPartner.svg";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
} from "@/reduxSlice/apiSlice";
import Trash from "../../../public/trash.png";
import ExportLead from "../leads/component/export";

// card details
// const users = [
//   { name: "Super Admin", icon: SuperAdmin, total: "123" },
//   { name: "Admin", icon: Admin, total: "123" },
//   { name: "CP Head", icon: CPHead, total: "123" },
//   { name: "CP Lead", icon: CPLead, total: "123" },
//   { name: "CP Manager", icon: CPManager, total: "123" },
//   { name: "Channel Partner", icon: ChanelPartner, total: "123" },
// ];

export default function Page() {
  const [open, setOpen] = useState(false);

  // get user data
  const { data, refetch, isFetching } = useGetUsersQuery();

  // delete user
  const [deleteUser] = useDeleteUsersMutation();

  const [selectedRow, setSelectedRow] = useState(null);
  // dialog open and close functions
  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // refetch the user data
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          if (data?.message === "UNAUTHORIZED") {
            // console.log("logouted");
            localStorage.removeItem("user");
            window.location.href = "login";
          }
        } else {
          // console.log("Data is undefined");
        }
      } catch (error) {
        console.error("Error during CP data fetch:", error);
      }
    };

    fetchData();
  }, [data]);

  // handle delete function
  const handleDelete = async (selectedCp) => {
    // console.log(selectedCp);
    try {
      handleClose();
      await deleteUser(selectedCp?._id);
      toast.success("User deleted successfully ");
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (er) {
      console.error("Error during user deletion:", er);
    }
  };

  // for dialog box
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const preDefinedValues = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];

  const [selectedFilter, setSelectedFilter] = useState(preDefinedValues[0]);
  const [getUserFilter, setGetUserFilter] = useState(null);
  const [filterDatasByCategory, setFilterDatasByCategory] = useState([]);
  const [filterUser, setFilterUser] = useState();
  // console.log(selectedFilter);
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
  // console.log(filterUser);

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

  // console.log(selectedFilter);

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

  // const slicedRows = (filterUser || data?.result || []).slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage,
  // );

  let arrayToSlice;

  if (filterUser && filterUser.length >= 1) {
    arrayToSlice = filterUser;
  } else {
    arrayToSlice = data?.result || [];
  }

  const slicedRows = arrayToSlice.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <ToastContainer />
      <Grid style={{ minHeight: "100vh" }}>
        <Grid
          sx={{
            minHeight: "8vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // padding: "0px 10px",
            // border: "1px solid black",
            margin: "10px",
            // flexWrap: "wrap",
          }}
        >
          <Grid sx={{ width: "50%" }}>
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
          <Grid
            sx={{
              gap: "10px",
              width: "40%",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Link href="/usermanagement/adduser">
              <Button
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 1)",
                  color: "rgba(255, 255, 255, 1)",
                  width: "125px",
                  height: "43px",
                  borderRadius: "13px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "400",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 1)",
                    boxShadow: "none",
                    border: "none",
                  },
                }}
              >
                <Add sx={{ fontSize: "18px" }} />
                Add User
              </Button>
            </Link>
            <ExportLead data={data?.result} />
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
                User List
              </Typography>
            </Grid>
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
                    <TableCell sx={{ fontSize: "11px" }}>Contact</TableCell>
                    <TableCell sx={{ fontSize: "11px" }}>Email</TableCell>
                    <TableCell sx={{ fontSize: "11px" }}>Project</TableCell>
                    <TableCell sx={{ fontSize: "11px" }}>Role</TableCell>
                    <TableCell sx={{ fontSize: "11px" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedRows?.map((row) => (
                    <TableRow key={row?.name || "N/A"}>
                      <TableCell sx={{ fontSize: "11px" }}>
                        {row?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        {row?.phone || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        {row?.email || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        {row?.projects && row?.projects?.length > 0
                          ? row?.projects.join(",")
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "11px" }}>
                        {row?.role || "N/A"}
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
                              pathname: "usermanagement/edit",
                              search: `?id=${row?._id}`,
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
                          <Button
                            onClick={() => handleOpen(row)}
                            sx={{
                              border: "1px solid red",
                              borderRadius: "10px",
                              color: "red",
                              marginLeft: "5px",
                              width: "48px",
                              height: "25px",
                              fontSize: "11px",
                              "&:hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                            }}
                          >
                            delete
                          </Button>

                          <BootstrapDialog
                            onClose={handleClose}
                            aria-labelledby="customized-dialog-title"
                            open={open}
                            maxWidth="xs"
                            PaperProps={{
                              sx: {
                                borderRadius: "30px",
                                // border: "1px solid red",
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            disableScrollLock
                          >
                            <Grid
                              sx={{
                                height: "250px",
                                // border: "1px solid black",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Grid
                                sx={{
                                  width: "80px",
                                  height: "80px",
                                  // border: "1px solid black",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                                }}
                              >
                                <Image
                                  width={39}
                                  height={39}
                                  src={Trash}
                                  sx={{ color: "red" }}
                                />
                              </Grid>
                              <Grid
                                sx={{
                                  fontSize: "20px",
                                  lineHeight: "24px",
                                  fontWeight: "600",
                                }}
                              >
                                Delete the user ?
                              </Grid>
                              <Grid
                                sx={{
                                  width: "80%",
                                  textAlign: "center",
                                  color: "#757575",
                                }}
                              >
                                &quot;Are you certain about your intention to
                                delete this user from the table&nbsp;?&quot;
                              </Grid>
                            </Grid>
                            <DialogActions
                              sx={{
                                // border: "1px solid black",
                                width: "80%",
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              <Button
                                onClick={handleClose}
                                color="primary"
                                sx={{
                                  border: "none",
                                  width: "124px",
                                  height: "43px",
                                  color: "black",
                                  borderRadius: "12px",
                                  backgroundColor: "#D9D9D9",
                                  textTransform: "capitalize",
                                  fontWeight: "800",
                                  "&:hover": {
                                    backgroundColor: "#D9D9D9",
                                    boxShadow: "none",
                                    border: "none",
                                  },
                                }}
                              >
                                No Keep
                              </Button>
                              <Button
                                onClick={() => handleDelete(selectedRow)}
                                color="primary"
                                sx={{
                                  border: "none",
                                  width: "124px",
                                  height: "43px",
                                  color: "white",
                                  borderRadius: "12px",
                                  backgroundColor: "#E50000",
                                  textTransform: "capitalize",
                                  fontWeight: "800",
                                  "&:hover": {
                                    backgroundColor: "#E50000",
                                    boxShadow: "none",
                                    border: "none",
                                  },
                                }}
                                autoFocus
                              >
                                Yes, Delete!
                              </Button>
                            </DialogActions>
                          </BootstrapDialog>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={arrayToSlice?.length || 0}
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
    </>
  );
}
