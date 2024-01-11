"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import Link from "next/link";

export default function Page({ searchParams }) {
  const [formData, setFormData] = useState({
    username: searchParams.name || "",
    email: searchParams.email || "",
    phone: searchParams.phone || "",
    password: "",
  });

  const [selectedValues, setSelectedValues] = useState({
    project: searchParams.projects || [],
    role: searchParams.role || "",
    parent: "",
  });

  const [personName, setPersonName] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (name, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value.trim() === "",
    );

    if (
      isAnyFieldEmpty ||
      Object.values(selectedValues).some((value) => value === "")
    ) {
      alert("Please fill in all fields before submitting.");
    } else {
      const formDataArray = Object.values(formData);
      const selectedValuesArray = Object.values(selectedValues);
      const allDataArray = [...formDataArray, ...selectedValuesArray];

      console.log("Form submitted with data:", allDataArray);
    }
  };

  const parentOptions = ["ParentOne", "ParentTwo", "ParentThree"];

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);

      setUserData(jsonData);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const LoginUserName = userData.name;
  const LoginUserRoles = userData.role;
  const SubordinateRoles = userData.subordinateRoles;
  const SubordinateProjects = userData.projects;

  const handleChangeProject = (event) => {
    const {
      target: { value },
    } = event;

    // Ensure value is an array
    const updatedProjects = Array.isArray(value) ? value : [value];

    setPersonName(updatedProjects);
    handleChange("project", updatedProjects);
  };

  return (
    <Grid sx={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          height: "5vh",
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
          width: "100%",
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
          }}
        >
          <Typography
            sx={{ fontSize: "18px", fontWeight: "600", padding: "20px" }}
          >
            Edit User 
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            sx={{
              width: "100%",
              minHeight: "500px",
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
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  sx={{
                    width: "397px",
                    color: "black",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{
                    width: "397px",
                    color: "black",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                />
              </Grid>

              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  marginBottom: "40px",
                  width: "80%",
                }}
              >
                <TextField
                  label="Phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{
                    width: "397px",
                    color: "black",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  sx={{
                    width: "397px",
                    color: "black",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
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
                }}
              >
                <FormControl
                  sx={{
                    minWidth: "397px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                >
                  <InputLabel id="demo-multiple-checkbox-label">
                    select project
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={
                      Array.isArray(selectedValues.project)
                        ? selectedValues.project
                        : [selectedValues.project]
                    }
                    onChange={handleChangeProject}
                    input={<OutlinedInput label="select project" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {SubordinateProjects.map((p) => (
                      <MenuItem key={p.name} value={p.name}>
                        <Checkbox
                          checked={selectedValues.project.indexOf(p.name) > -1}
                        />
                        <ListItemText primary={p.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  sx={{
                    minWidth: "397px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                >
                  <InputLabel
                    id="role-label"
                    sx={{ color: "#757575", fontSize: "14px" }}
                  >
                    Choose one role
                  </InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    displayEmpty
                    value={selectedValues.role}
                    label="Choose one role"
                    onChange={(e) => handleChange("role", e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {selectedValues.project.length === 0 && (
                      <MenuItem value="" disabled>
                        No Project
                      </MenuItem>
                    )}
                    {SubordinateRoles.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
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
                }}
              >
                <FormControl
                  sx={{
                    minWidth: "397px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "19px",
                      },
                  }}
                >
                  <InputLabel
                    id="parent-label"
                    sx={{ color: "#757575", fontSize: "14px" }}
                  >
                    Choose one parent
                  </InputLabel>
                  <Select
                    labelId="parent-label"
                    id="parent"
                    displayEmpty
                    value={selectedValues.parent}
                    label="Choose one parent"
                    onChange={(e) => handleChange("parent", e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {parentOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ marginTop: "40px" }}>
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
