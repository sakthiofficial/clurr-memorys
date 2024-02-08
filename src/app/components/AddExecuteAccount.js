import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AddExecuteAccount({ data, refetch }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // console.log(data)

  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Pass@123",
    id: data?.result?.cpRm?._id,
  });

  // console.log(data[0]._id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setEditedData({
      name: "",
      email: "",
      phone: "",
      password: "Pass@123",
    });
  };

  const handleInputChange = (fieldName, value) => {
    setEditedData((prevData) => [
      {
        ...prevData,
        [fieldName]: value,
      },
    ]);
  };

  const handleSubmit = async () => {
    console.log("Submitting changes:", editedData);
    setOpen(false);
  };

  return (
    <Grid>
      <Button
        onClick={handleClickOpen}
        sx={{
          borderRadius: "5px",
          color: "black",
          // width: "88px",
          height: "35px",
          fontSize: "12px",
          backgroundColor: "rgba(249, 184, 0, 1)",
          "&:hover": {
            backgroundColor: "rgba(249, 184, 0, 1)",
            boxShadow: "none",
          },
        }}
      >
        Add Execute
      </Button>
      <Dialog
        onClose={handleClose}
        open={open}
        disableScrollLock
        maxWidth="100px"
        PaperProps={{
          sx: {
            height: "450px",
            width: "350px",
            display: "flex",
            alignItems: "center",
            padding: "15px",
          },
        }}
      >
        <Grid
          sx={{
            // border: "1px solid red",
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // alignItems: "center",
            width: "100%",
          }}
        >
          <Grid>
            <Typography
              sx={{
                padding: "5px",
                paddingBottom: "20px",
                fontSize: "16px",
              }}
            >
              Enter Execute Details
            </Typography>
            <Grid
              sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <TextField
                value={editedData?.name}
                name="name"
                id="outlined-required"
                label="Name"
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <TextField
                value={editedData?.email}
                name="email"
                id="outlined-required"
                label="Email"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <TextField
                name="phone"
                id="outlined-required"
                label="Phone"
                value={editedData?.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              <TextField
                name="password"
                id="outlined-required"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={editedData?.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid
            sx={{
              // border: "1px solid black",
              display: "flex",
              justifyContent: "end",
              gap: "20px",
            }}
          >
            <Button
              sx={{ border: "1px solid black", color: "black" }}
              onClick={handleCancel}
            >
              cancel
            </Button>
            <Button
              sx={{ border: "1px solid black", color: "black" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  );
}
