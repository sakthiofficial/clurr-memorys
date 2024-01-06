"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          // border: "1px solid black",
          backgroundColor: "rgba(249, 184, 0, 1)",
          color: "black",
          width: "154px",
          height: "43px",
          borderRadius: "13px",
          border: "none",
          fontSize: "13px",
          fontWeight: "400",
          "&:hover": {
            backgroundColor: "rgba(249, 184, 0, 1)",
            boxShadow: "none",
            border: "none",
          },
        }}
      >
        Export Leads
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "50px",
          },
        }}
        disableScrollLock
      >
        <Grid
          sx={{
            // border: "1px solid black",
            display: "flex",
            height: "100px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Grid
            sx={{
              // border: "2px solid red",
              width: "90%",
              height: "62px",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#FAB900",
              color: "white",
              borderRadius: "50px",
              // padding: "0px 5px",
            }}
          >
            <DialogTitle id="customized-dialog-title">
              <Typography variant="h6" sx={{ color: "black" }}>
                Export leads
              </Typography>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                paddingRight: "20px",
                "&:hover": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <Grid sx={{ height: "280px" }}>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam.
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
