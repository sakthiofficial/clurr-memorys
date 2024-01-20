"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
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

export default function ViewLeadsBtn({ leadData }) {
  const [open, setOpen] = React.useState(false);
  // console.log(leadData)
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
          borderRadius: "10px",
          color: "black",
          width: "58px",
          height: "28px",
          border: "none",
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
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        // maxWidth="800px"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            height: "486px",
            width: "456px",
            display: "flex",
            justifyContent: "center",
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
            marginBottom: "10px",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
            View Lead Details
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
            border: "1px solid rgba(189, 189, 189, 1)",
            height: "380px",
            width: "400px",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Name</Typography>
            <Typography>{leadData?.FirstName || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Contact</Typography>
            <Typography>{leadData?.Phone || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Email</Typography>
            <Typography>{leadData?.EmailAddress || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Project</Typography>
            <Typography>{leadData?.mx_Origin_Project || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Status</Typography>
            <Typography>{leadData?.Status || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Stage</Typography>
            <Typography>{leadData?.ProspectStage || "N/A"}</Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", width: "350px", justifyContent: "start" }}
          >
            <Typography sx={{ width: "150px" }}>Created By</Typography>
            <Typography>{leadData?.CreatedOn || "N/A"}</Typography>
          </Grid>
        </Grid>
      </BootstrapDialog>
    </Grid>
  );
}
