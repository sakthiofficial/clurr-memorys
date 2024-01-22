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
  IconButton,
} from "@mui/material";
import Link from "next/link";
// icons
import { ToastContainer, toast } from "react-toastify";
import { Add, Close, DeleteForever } from "@mui/icons-material";
import styled from "@emotion/styled";
import Image from "next/image";
import SuperAdmin from "../../../public/UserCard/SuperAdmin.svg";
import Admin from "../../../public/UserCard/Admin.svg";
import CPHead from "../../../public/UserCard/CPHead.svg";
import CPLead from "../../../public/UserCard/CPLead.svg";
import CPManager from "../../../public/UserCard/CPManager.svg";
import ChanelPartner from "../../../public/UserCard/ChanelPartner.svg";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
} from "@/reduxSlice/apiSlice";
import Trash from "../../../public/trash.png";
import ExportLead from "../leads/component/export";

// card details
const users = [
  { name: "Super Admin", icon: SuperAdmin, total: "123" },
  { name: "Admin", icon: Admin, total: "123" },
  { name: "CP Head", icon: CPHead, total: "123" },
  { name: "CP Lead", icon: CPLead, total: "123" },
  { name: "CP Manager", icon: CPManager, total: "123" },
  { name: "Channel Partner", icon: ChanelPartner, total: "123" },
];

export default function Page() {
  // card background change
  const getBackgroundColor = (name) => {
    switch (name) {
      case "CP Head":
        return "rgba(255, 92, 0, 0.08)";
      case "CP Lead":
        return "rgba(205, 172, 0, 0.08)";
      case "CP Manager":
        return "rgba(219, 0, 255, 0.08)";
      case "Channel Partner":
        return "rgba(0, 173, 17, 0.08)";
      default:
        return "rgba(0, 133, 255, 0.08)";
    }
  };
  const [open, setOpen] = useState(false);

  // table details
  const { data, isLoading, isError, error } = useGetUsersQuery();
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

  useEffect(() => {
    if (isLoading) {
      // console.log("Loading...");
    } else if (isError) {
      // console.error("Error:", error);
    } else if (data) {
      // console.log("Query completed:", data?.result);
    }
  }, [data, isLoading, isError, error]);

  const [deleteUser] = useDeleteUsersMutation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    deleteUser(id);

    toast.success("user delete successfully ");
    handleClose();
    setTimeout(() => window.location.reload(), 3000);
  };
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
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
            // padding: "0px 10px",
          }}
        >
          <Grid sx={{ width: "60%" }}>
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
                User List
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
              <Table sx={{ boxShadow: "0px 6px 32px 0px rgba(0, 0, 0, 0.15)" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(249, 184, 0, 0.1)",
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    <TableCell>Id#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedRows?.map((row) => (
                    <TableRow key={row?.name || "N/A"}>
                      <TableCell>{row?.id || "N/A"}</TableCell>
                      <TableCell>{row?.name || "N/A"}</TableCell>
                      <TableCell>{row?.phone || "N/A"}</TableCell>
                      <TableCell>{row?.email || "N/A"}</TableCell>
                      <TableCell>
                        {row?.projects && row?.projects?.length > 0
                          ? row?.projects.join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{row?.role || "N/A"}</TableCell>
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
                              pathname: "/usermanagement/adduser",
                              query: { id: row?._id },
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
                          </Link>
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
                                "Are you certain about your intention to delete
                                this user from the table?"
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
                                onClick={() => handleDelete(row._id)}
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
