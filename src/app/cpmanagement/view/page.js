"use client";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from "next/navigation";
import { useRetriveCpByCompanyQuery } from "@/reduxSlice/apiSlice";
import { unixToDate } from "../../../../shared/dateCalc";
import CpDialogBox from "../../components/CpDialogBox";
/// dialog box setup
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Page() {
  const params = useSearchParams();

  const id = params.get("id");

  // get data query
  const { data, isFetching } = useRetriveCpByCompanyQuery(id);

  // console.log(data?.result);

  /// dialog open functions

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
      <Grid
        sx={{
          height: "5vh",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Link href="/cpmanagement">
          <Button
            type="button"
            sx={{
              backgroundColor: "transparent",
              color: "black",
              width: "92px",
              height: "39px",
              borderRadius: "13px",
              border: "1px solid black",
              fontSize: "13px",
              fontWeight: "400",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
          >
            back
          </Button>
        </Link>
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
        <>
          <Grid
            sx={{
              border: "1px solid lightgrey",
              minheight: "20vh",
              borderRadius: "30px",
              marginBottom: "20px",
            }}
          >
            <Grid
              sx={{
                height: "10vh",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#021522",
                borderRadius: "30px 30px 0px 0px",
                justifyContent: "space-between",
                padding: " 0px 30px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Channel Parnter Details
              </Typography>
              {/* <Button
                variant="outlined"
                onClick={handleClickOpen}
                sx={{
                  backgroundColor: "rgba(249, 184, 0, 1)",
                  color: "black",
                  minWidth: "125px",
                  height: "35px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "400",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "rgba(249, 184, 0, 1)",
                    boxShadow: "none",
                    border: "none",
                  },
                }}
              >
                Change RM
              </Button>
              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                disableScrollLock
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Modal title
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                  </Typography>
                  <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur et. Vivamus sagittis lacus vel augue laoreet
                    rutrum faucibus dolor auctor.
                  </Typography>
                  <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent
                    commodo cursus magna, vel scelerisque nisl consectetur et.
                    Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                    fringilla.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Save changes
                  </Button>
                </DialogActions>
              </BootstrapDialog> */}
              <CpDialogBox data={data} />
            </Grid>
            <Grid
              sx={{
                height: "13vh",
                display: "flex",
                alignItems: "center",
                padding: " 0px 30px",
                width: "80%",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <Grid sx={{ display: "flex" }}>
                <Typography
                  sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                >
                  Company -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography sx={{ fontSize: "12px" }}>
                  {data?.result?.company?.name}
                </Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography
                  sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                >
                  CP Code -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography sx={{ fontSize: "12px" }}>
                  {data?.result?.company?.cpCode}
                </Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography
                  sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                >
                  Assigned Under -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography sx={{ fontSize: "12px" }}>
                  {data?.result?.cpRm?.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            sx={{
              border: "1px solid lightgrey",
              minheight: "20vh",
              borderRadius: "30px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <Grid
              sx={{
                height: "10vh",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#021522",
                borderRadius: "30px 30px 0px 0px",
                justifyContent: "space-between",
                padding: " 0px 30px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Number of Accounts Created
              </Typography>
              {data?.result?.cpExecutes?.length === 0 && (
                <Button
                  variant="outlined"
                  // onClick={handleClickOpen}
                  sx={{
                    backgroundColor: "rgba(249, 184, 0, 1)",
                    color: "black",
                    minWidth: "125px",
                    height: "35px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "400",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "rgba(249, 184, 0, 1)",
                      boxShadow: "none",
                      border: "none",
                    },
                  }}
                >
                  Add Chanel Partner
                </Button>
              )}

              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                disableScrollLock
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Modal title
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                  </Typography>
                  <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur et. Vivamus sagittis lacus vel augue laoreet
                    rutrum faucibus dolor auctor.
                  </Typography>
                  <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent
                    commodo cursus magna, vel scelerisque nisl consectetur et.
                    Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                    fringilla.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Save changes
                  </Button>
                </DialogActions>
              </BootstrapDialog>
            </Grid>
            <Table>
              <TableHead>
                <TableRow
                  style={{
                    backgroundColor: "rgba(249, 184, 0, 0.1)",
                    fontWeight: "500",
                    color: "black",
                  }}
                >
                  <TableCell sx={{ fontSize: "12px" }}>NAME</TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>CONTACT</TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>USERNAME </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    IS PRIMARY ACCOUNT
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>JOINED DATE</TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>EDIT</TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    RESET PASSWORD
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {data?.result?.cpBranchHead?.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {data?.result?.cpBranchHead?.phone}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {data?.result?.cpBranchHead?.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    <Switch {...label} checked />
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
                    {unixToDate(data?.result?.cpBranchHead?.createdBy)}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
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
                      edit
                    </Button>
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px" }}>
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
                      reset
                    </Button>
                  </TableCell>
                </TableRow>

                {(data?.result?.cpExecutes || []).map((cpExecute, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {cpExecute.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {cpExecute.phone}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {cpExecute.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      <Switch {...label} checked={false} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {unixToDate(cpExecute.createdBy)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
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
                        edit
                      </Button>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
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
                        reset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </>
      )}
      <Grid />
    </Grid>
  );
}
