"use client";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
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
              <Button
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
              </BootstrapDialog>
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
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Company -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography>{data?.result?.company?.name}</Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  CP Code -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography>{data?.result?.company?.cpCode}</Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Assigned Under -
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography>{data?.result?.cpRm?.name}</Typography>
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
                  <TableCell>NAME</TableCell>
                  <TableCell>CONTACT</TableCell>
                  <TableCell>USERNAME </TableCell>
                  <TableCell>IS PRIMARY ACCOUNT</TableCell>
                  <TableCell>JOINED DATE</TableCell>
                  <TableCell>EDIT</TableCell>
                  <TableCell>RESET PASSWORD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{data?.result?.cpBranchHead?.name}</TableCell>
                  <TableCell>{data?.result?.cpBranchHead?.phone}</TableCell>
                  <TableCell>{data?.result?.cpBranchHead?.name}</TableCell>
                  <TableCell>yes</TableCell>
                  <TableCell>
                    {unixToDate(data?.result?.cpBranchHead?.createdBy)}
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                {data?.result?.cpExecutes?.length === 0 ? null : (
                  <>
                    {data?.result?.cpExecutes.map((cpExecute, index) => (
                      <TableRow key={index}>
                        <TableCell>{cpExecute.name}</TableCell>
                        <TableCell>{cpExecute.phone}</TableCell>
                        <TableCell>{cpExecute.name}</TableCell>
                        <TableCell>no</TableCell>
                        <TableCell>{unixToDate(cpExecute.createdBy)}</TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell>N/A</TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </Grid>
        </>
      )}
      <Grid />
    </Grid>
  );
}
