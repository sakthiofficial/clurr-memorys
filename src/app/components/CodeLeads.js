"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
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

export default function AddLeadsBtn() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          color: "red",
          border: "1px solid  black",
        }}
      >
        enter cp code
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="200px"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            minHeight: "300px",
            // width: "456px",
            border: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          },
        }}
        disableScrollLock
      >
        <Grid
          sx={{
            border: "none",
            height: "64px",
            width: "400px",
            borderRadius: "19px",
            backgroundColor: "#F9B800",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
            ENTER CP CODE
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid
          sx={{
            // border: "1px solid rgba(189, 189, 189, 1)",
            minHeight: "100px",
            width: "400px",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextField
            sx={{ width: "80%", borderRadius: "15px", height: "48px" }}
            placeholder="enter code"
            type="number"
          />
        </Grid>
        <Button
          onClick={handleClose}
          sx={{
            border: "none",
            height: "56px",
            width: "150px",
            borderRadius: "19px",
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "black",
              boxShadow: "none",
              border: "none",
            },
          }}
        >
          Submit
        </Button>
      </BootstrapDialog>
    </Grid>
  );
}
