"use client";

import {
  Button,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Link from "next/link";
import * as React from "react";

export default function page() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value.trim() === "",
    );

    if (isAnyFieldEmpty) {
      alert("Please fill in all fields before submitting.");
    } else {
      console.log("Form submitted with data:", formData);

      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        status: "",
        parent: "",
        // ...
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const [selectedProject, setSelectedProject] = React.useState("");

  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };

  return (
    <Grid sx={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "5vh",
          // border: "1px solid black",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Link href="/usermanagement">
        <Button
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
      <Grid
        sx={{
          minHeight: "581px",
          borderRadius: "29px",
          boxShadow: " 0px 6px 32px 0px rgba(0, 0, 0, 0.15)",
          border: "1px solid #9E9E9E",
        }}
      >
        <Grid
          sx={{
            height: "59px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "29px 29px 0px 0px",
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Typography
            sx={{ fontSize: "18px", fontWeight: "600", padding: "20px" }}
          >
            Add New User
          </Typography>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            sx={{
              // border: "1px solid red",
              width: "1000px",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "500px",
              }}
            >
              <Grid
                sx={{
                  // border: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  marginBottom: "40px",
                  width: "80%",
                }}
              >
                <TextField
                  label="Username"
                  name="username"
                  tyoe="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  sx={{
                    width: "389px",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{
                    width: "389px",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                  }}
                />
              </Grid>

              <Grid
                sx={{
                  // border: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  marginBottom: "40px",
                  width: "80%",
                  // height:"150px"
                }}
              >
                <TextField
                  label="Phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{
                    width: "389px",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  sx={{
                    width: "389px",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                  }}
                />
              </Grid>

              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  width: "80%",
                  marginBottom: "40px",
                  // height:"150px"
                }}
              >
                <FormControl
                  sx={{
                    minWidth: 389,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "10px",
                      },
                  }}
                  // size="small"
                >
                  <InputLabel
                    id="demo-select-small-label"
                    sx={{ color: "#757575", fontSize: "14px" }}
                  >
                    choose one project
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    displayEmpty
                    value={selectedProject}
                    label="choose one project"
                    onChange={handleChange}
                    disableScrollLock={true}
                  >
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  sx={{
                    minWidth: 389,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "10px",
                      },
                  }}
                  // size="small"
                >
                  <InputLabel
                    id="demo-select-small-label"
                    sx={{ color: "#757575", fontSize: "14px" }}
                  >
                    choose one project
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    displayEmpty
                    value={selectedProject}
                    label="choose one project"
                    onChange={handleChange}
                    disableScrollLock={true}
                  >
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  width: "80%",
                  // height:"150px"
                }}
              >
                <FormControl
                  sx={{
                    minWidth: 389,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "10px",
                      },
                  }}
                  // size="small"
                >
                  <InputLabel
                    id="demo-select-small-label"
                    sx={{ color: "#757575", fontSize: "14px" }}
                  >
                    choose one project
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    displayEmpty
                    value={selectedProject}
                    label="choose one project"
                    onChange={handleChange}
                    disableScrollLock={true}
                  >
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ marginTop: "40px" }}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleCancel}
                  sx={{
                    width: "145px",
                    backgroundColor: "transparent",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                    boxShadow: "none",
                    border: "1px solid black",
                    "&:hover": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    marginLeft: "20px",
                    width: "145px",
                    backgroundColor: "#F9B800",
                    color: "black",
                    height: "43px",
                    borderRadius: "12px",
                    boxShadow: "none",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#F9B800",
                      boxShadow: "none",
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
