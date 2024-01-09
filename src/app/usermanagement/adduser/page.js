"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import Link from "next/link";
import { useGetParentsQuery } from "@/reduxSlice/apiSlice";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [selectedValues, setSelectedValues] = useState({
    project: [],
    role: "",
    parent: "",
  });

  const [selectedProject, setSelectedProject] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [selectedProjectsListP, setSelectedProjectsListP] = useState([]);
  const [selectedRolesListP, setSelectedRolesListP] = useState("");

  const ParentDetails = {
    role: selectedRolesListP[0],
    project: [...selectedProjectsListP],
  };

  console.log("Arrays before submit - Roles and Projects:", ParentDetails);
  const result = useGetParentsQuery(ParentDetails);

  console.log(result);

  const handleChange = (name, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "role") {
      setSelectedRolesListP(() => [value]);
    }

    if (name === "project") {
      setSelectedProjectsListP((prevList) => [...prevList, value]);

      // Assuming you want to update the project property in selectedValues
      setSelectedValues((prevValues) => ({
        ...prevValues,
        project: [...prevValues.project, value],
      }));
    }
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
      const updatedValues = {
        ...selectedValues,
        project: selectedProject,
      };

      const allDataObject = {
        ...formData,
        ...updatedValues,
      };

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setSelectedValues({
        project: [],
        role: "",
        parent: "",
      });

      setSelectedProject([]); // Reset selectedProject

      console.log("Form submitted with data:", allDataObject);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setSelectedValues({
      project: [],
      role: "",
      parent: "",
    });
    setSelectedProject([]); // Reset selectedProject
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
  const SubordinateRoles = userData.subordinateRoles;
  const SubordinateProjects = userData.projects;

  const handleChangeProject = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProject(value);
    setSelectedProjectsListP(value);
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
            onClick={handleCancel}
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
            Add New User - {LoginUserName}
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
                  label="name"
                  name="name"
                  type="text"
                  value={formData.name}
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
                    value={selectedProject}
                    onChange={handleChangeProject}
                    input={<OutlinedInput label="select project" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {SubordinateProjects.map((p) => (
                      <MenuItem key={p.name} value={p.name}>
                        <Checkbox
                          checked={selectedProject.indexOf(p.name) > -1}
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
