"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import Image from "next/image";
import styled from "@emotion/styled";
import { useCpDeleteMutation, useGetCpQuery } from "@/reduxSlice/apiSlice";
import Trash from "../../../public/trash.png";
import { unixToDate } from "../../../shared/dateCalc";
import ExportLead from "../leads/component/export";
import { convertTimestampToDateTime } from "@/appConstants";

export default function Page() {
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // dialog box setup
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  // get cp data query
  const { data, refetch, isFetching } = useGetCpQuery();
  // console.log(data);
  // const handleUnauthorizedUser = () => {
  //   localStorage.removeItem("user");
  //   window.location.href = "/login";
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          if (data?.message === "UNAUTHORIZED") {
            // console.log("logouted");
            localStorage.removeItem("user");
            window.location.href = "login";
          }
          // console.log(data);
        } else {
          // console.log("Data is undefined");
        }
      } catch (error) {
        console.error("Error during CP data fetch:", error);
      }
    };

    fetchData();
  }, [data]);

  // set pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRows = (data?.result || []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // delete mutation
  const [deleteCp] = useCpDeleteMutation();

  // select data what user click handle open dialog functions
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setSelectedRow(null);
  };

  // handle delete function
  const handleDelete = async (selectedcp) => {
    // console.log(selectedcp);
    try {
      handleClose();
      await deleteCp(selectedcp?.company?.cpCode);

      toast.success("User deleted successfully ");
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (er) {
      console.error("Error during user deletion:", er);
    }
  };

  // refetch
  useEffect(() => {
    refetch();
  }, []);

  // console.log(data);
  const covertCpDataToExcel = useCallback((cpData) => {
    cpData = (cpData || []).map((singleCpData) => {
      const executes = (singleCpData?.cpExecutes || []).map(
        (execute) => execute?.name,
      );
      return {
        Company: singleCpData?.company?.name,
        CpCode: singleCpData?.company?.cpCode,
        CreateOn: convertTimestampToDateTime(singleCpData?.company?.created),
        Projects: singleCpData?.company?.projects,
        BranchHead: singleCpData?.cpBranchHead?.name,
        BranchHeadEmail: singleCpData?.cpBranchHead?.email,

        RelationManager: singleCpData?.cpRm?.name,
        Execute: executes,
      };
    });
    return cpData;
  });
  return (
    <>
      <ToastContainer />

      <Grid style={{ minHeight: "100vh" }}>
        <Grid
          sx={{
            height: "8vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // marginBottom: "10px",
          }}
        >
          <Grid sx={{ width: "60%" }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                color: "rgba(0, 0, 0, 1)",
                // padding:"0px 10px"
              }}
            >
              CP List
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
            <Link href="/cpmanagement/addcp">
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
                Add CP
              </Button>
            </Link>
            <ExportLead data={covertCpDataToExcel(data?.result)} />
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
                CP List
              </Typography>
              {/* <TextField
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
            /> */}
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
                    <TableCell sx={{ fontSize: "12px" }}>
                      COMPANY NAME
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>CP CODE</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>BRANCH HEAD</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      NO. OF ACCOUNTS
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      RELATIONSHIP MANAGER
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>JOINED DATE</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedRows?.map((row) => (
                    <TableRow key={row?.cpCode}>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {row?.company?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {row?.company?.cpCode || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {row?.cpBranchHead?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {row?.cpBranchHead
                          ? 1 + row?.cpExecutes?.length
                          : row?.cpExecutes.length || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {row?.cpRm?.name || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {unixToDate(row?.company?.created) || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        <Grid
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Link
                            href={{
                              pathname: "cpmanagement/view",
                              search: `?id=${row?.company?._id}`,
                            }}
                          >
                            <Button
                              sx={{
                                borderRadius: "10px",
                                color: "black",
                                width: "48px",
                                height: "25px",
                                fontSize: "12px",
                                backgroundColor: "rgba(249, 184, 0, 1)",
                                "&:hover": {
                                  backgroundColor: "rgba(249, 184, 0, 1)",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              view
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
                              fontSize: "12px",
                              "&:hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                            }}
                          >
                            delete
                          </Button>

                          <BootstrapDialog
                            onClose={handleOpen}
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
                                  alt="delete"
                                />
                              </Grid>
                              <Grid
                                sx={{
                                  fontSize: "20px",
                                  lineHeight: "24px",
                                  fontWeight: "600",
                                }}
                              >
                                Delete the CP ?
                              </Grid>
                              <Grid
                                sx={{
                                  width: "80%",
                                  textAlign: "center",
                                  color: "#757575",
                                }}
                              >
                                "Are you certain about your intention to delete
                                this chanel partner from the table?"
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
                                // onClick={() =>
                                //   console.log(selectedRow.company.cpCode)
                                // }
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
              count={data?.result?.length || 0}
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
