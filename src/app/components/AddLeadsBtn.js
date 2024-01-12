import * as React from "react";
import Button from "@mui/material/Button";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useAddLeadMutation, useGetProjectQuery } from "@/reduxSlice/apiSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddLeadsBtn() {
  const [open, setOpen] = useState(false);

  const [addlead] = useAddLeadMutation();

  const result = useGetProjectQuery();
  // console.log(result?.data?.result);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    project: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Call your mutation function here with addlead(formData)
    handleClose();
  };

  return (
    <Grid>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "rgba(255, 255, 255, 1)",
          width: "125px",
          height: "43px",
          borderRadius: "13px",
          fontSize: "13px",
          fontWeight: "400",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 1)",
            boxShadow: "none",
            border: "none",
          },
        }}
      >
        Add Lead
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            minHeight: "486px",
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
            Add New Lead
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
            height: "296px",
            width: "400px",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextField
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            sx={{ width: "80%", borderRadius: "15px", height: "48px" }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ width: "80%", borderRadius: "15px" }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ width: "80%", borderRadius: "20px" }}
          />

          <FormControl sx={{ width: "80%" }}>
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              id="project"
              name="project"
              label="project"
              value={formData.project}
              onChange={handleChange}
              MenuProps={{ disableScrollLock: true }}
            >
              {result?.data?.result?.map((proj) => (
                <MenuItem key={proj.id} value={proj.name}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Button
          onClick={handleSubmit}
          sx={{
            border: "none",
            height: "56px",
            width: "400px",
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
          ADD USER
        </Button>
      </BootstrapDialog>
    </Grid>
  );
}
