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
import {
  useAddCpExecuteMutation,
  useAddUsersMutation,
} from "@/reduxSlice/apiSlice";

export default function AddExecuteAccount({ data, refetch }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // console.log(data)

  const [addData, setAddData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Pass@123",
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
    setAddData({
      name: "",
      email: "",
      phone: "",
      password: "Pass@123",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [addExecute] = useAddCpExecuteMutation();

  const handleSubmit = async () => {
    const updateValue = {
      ...addData,
      parentId: data?.result?.cpBranchHead?._id,
      companyId: data?.result?.company?._id,
      projects: data?.result?.company?.projects,
    };
    await addExecute(updateValue);
    await refetch();
    console.log(updateValue);
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
                value={addData?.name}
                name="name"
                id="outlined-required"
                label="Name"
                onChange={handleInputChange}
              />
              <TextField
                value={addData?.email}
                name="email"
                id="outlined-required"
                label="Email"
                onChange={handleInputChange}
              />
              <TextField
                name="phone"
                id="outlined-required"
                label="Phone"
                value={addData?.phone}
                onChange={handleInputChange}
              />
              <TextField
                name="password"
                id="outlined-required"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={addData?.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleInputChange}
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
