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
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { useDeleteUsersMutation, useGetCpQuery } from "@/reduxSlice/apiSlice";

export default function Page() {
  const [open, setOpen] = useState(false);

  // get cp data query
  const { data, isLoading, refetch } = useGetCpQuery();
  // set pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRows =
    data && data?.result
      ? data?.result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];

  // useEffect(() => {
  //   if (isLoading) {
  //     // console.log("Loading...");
  //   } else if (isError) {
  //     // console.error("Error:", error);
  //   } else if (data) {
  //     // console.log("Query completed:", data?.result);
  //   }
  // }, [data, isLoading, isError, error]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [deleteUser] = useDeleteUsersMutation();

  // handle delete function
  const handleDelete = (id) => {
    deleteUser(id);

    toast.success("cp delete successfully ");
    handleClose();
    // setTimeout(() => window.location.reload(), 3000);
  };

  useEffect(() => {
    refetch();
  }, []);

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
          </Grid>
        </Grid>
        {/* <Grid
        sx={{
          minHeight: "30vh",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexWrap: "wrap",
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
      </Grid> */}
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
              <Table sx={{ boxShadow: "0px 6px 32px 0px rgba(0, 0, 0, 0.15)" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(249, 184, 0, 0.1)",
                      fontWeight: "500",
                      color: "black",
                      fontSize: "0.75rem",
                    }}
                  >
                    <TableCell>COMPANY NAME</TableCell>
                    <TableCell>CP CODE</TableCell>
                    <TableCell>BRANCH HEAD</TableCell>
                    <TableCell>NO. OF ACCOUNTS</TableCell>
                    <TableCell>RELATIONSHIP MANAGER</TableCell>
                    <TableCell>JOINED DATE</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedRows?.map((row) => (
                    <TableRow key={row?._id}>
                      <TableCell>{row?.company?.name || "N/A"}</TableCell>
                      <TableCell>{row?.company?.cpCode || "N/A"}</TableCell>
                      <TableCell>{row?.cpBranchHead?.name || "N/A"}</TableCell>
                      <TableCell>
                        {row?.cpBranchHead
                          ? 1 + row?.cpExecutes.length
                          : row?.cpExecutes.length || "N/A"}
                      </TableCell>
                      <TableCell>{row?.cpRm?.name || "N/A"}</TableCell>
                      <TableCell>{row?.createdBy || "N/A"}</TableCell>
                      <TableCell>{row?.status || "N/A"}</TableCell>
                      <TableCell>
                        <Grid
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            sx={{
                              borderRadius: "10px",
                              color: "black",
                              width: "58px",
                              height: "28px",
                              fontSize: "10px",
                              backgroundColor: "rgba(249, 184, 0, 1)",
                              "&:hover": {
                                backgroundColor: "rgba(249, 184, 0, 1)",
                                boxShadow: "none",
                              },
                            }}
                          >
                            edit
                          </Button>
                          <Button
                            onClick={handleOpen}
                            sx={{
                              border: "1px solid red",
                              borderRadius: "10px",
                              color: "red",
                              marginLeft: "5px",
                              width: "58px",
                              height: "28px",
                              fontSize: "10px",
                              "&:hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                            }}
                          >
                            delete
                          </Button>

                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            disableScrollLock
                          >
                            <DialogTitle id="alert-dialog-title">
                              Confirm Delete
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this user?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleDelete(row.id)}
                                color="primary"
                                autoFocus
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
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
