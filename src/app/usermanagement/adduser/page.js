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
  Box,
  Chip,
} from "@mui/material";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useAddUsersMutation, useGetParentsQuery } from "@/reduxSlice/apiSlice";
import { isPriorityUser } from "../../../../shared/roleManagement";
import "react-toastify/dist/ReactToastify.css";

function getStyles(projectName, pName) {
  return {
    backgroundColor: projectName.indexOf(pName) === -1 ? "transparent" : "",
  };
}

export default function Page() {
  const [selectParentId, setSelectParentId] = useState("");
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [selectedValues, setSelectedValues] = useState({
    projects: [],
    role: [],
    parentId: "",
  });

  const [selectedProjects, setSelectedProjects] = useState([]);
  // handle input data function
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
    projects: [...selectedProjectsListP],
  };

  // console.log("Arrays before submit - Roles and Projects:", ParentDetails);
  const parentResult = useGetParentsQuery(ParentDetails);

  // console.log(parentResult.data.result);

  const handleChange = (name, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "role") {
      setSelectedRolesListP(() => [value]);

      setSelectedValues((prevValues) => ({
        ...prevValues,
        role: [value],
      }));
    }

    if (name === "projects") {
      setSelectedProjectsListP((prevList) => [...prevList, value]);

      setSelectedValues((prevValues) => ({
        ...prevValues,
        projects: [...prevValues.projects, value],
      }));
    }

    if (name === "parentId") {
      const resultId = value._id;
      setSelectParentId(resultId);
    }
  };

  const [sendUsers] = useAddUsersMutation();
  const priorUser = isPriorityUser(selectedRolesListP);
  console.log(priorUser)

  // handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => {
        if (key === "phone") {
          return value.trim().length < 10;
        }
        return value.trim() === "" && key !== "role";
      })
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      emptyFields.forEach((field) => {
        if (field === "phone") {
          toast.error(`Phone number must be at least 10 characters.`);
        } else {
          toast.error(`Please fill in ${field} before submitting.`);
        }
      });
    } else if (!selectedValues.role) {
      toast.error(`Please select a role before submitting.`);
    } else {
      try {
        const updatedValues = {
          ...selectedValues,
          projects: selectedProjects,
          role: selectedRolesListP,
          parentId: priorUser ? userData._id : selectParentId,
        };

        const usersData = {
          ...formData,
          ...updatedValues,
        };

        sendUsers(usersData)
          .then((result) => {
            console.log(result.data);

            if (result.data.status === 400) {
              result.data.result.details.map((res) => toast.error(res.message));
            }

            if (result.data.status === 200) {
              toast.success("User submitted successfully!");
              setTimeout(() => {
                window.location.href = "/usermanagement";
              }, 2000);
            }
          })
          .catch((error) => {
            console.error("User submission failed", error);
          });
      } catch (error) {
        console.error("User submission failed", error);
        toast.error("User submission failed. Please try again.");
      }
    }
  };
  // handle clear function
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setSelectedValues({
      projects: [],
      role: "",
      parent: "",
    });
    setSelectedProjects([]); // Reset selectedProject
  };

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
    return <Grid sx={{ height: "100vh" }}>Loading...</Grid>;
  }

  const SubordinateRoles = userData?.subordinateRoles;
  const SubordinateProjects = userData?.projects;
  // handle project function
  const handleChangeProject = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProjects(value);
    setSelectedProjectsListP(value);
  };

  return (
    <>
      <ToastContainer />
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
              Add New User
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
                  minHeight: "550px",
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
                    label="Name"
                    name="name"
                    type="text"
                    value={formData?.name}
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
                    value={formData?.email}
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
                    value={formData?.phone}
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
                    value={formData?.password}
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
                      width: "397px",
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
                      Select Role
                    </InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      displayEmpty
                      value={selectedValues?.role}
                      label="Select Role"
                      onChange={(e) => handleChange("role", e.target.value)}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {(SubordinateRoles || []).map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {priorUser ? (
                    ""
                  ) : (
                    <FormControl
                      sx={{
                        width: "397px",
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderRadius: "19px",
                          },
                      }}
                    >
                      <InputLabel id="demo-projects-label">Projects</InputLabel>

                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={selectedProjects}
                        onChange={handleChangeProject}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Projects"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selected?.map((value) => (
                              <Chip
                                sx={{
                                  backgroundColor: "rgba(250, 185, 0, 0.28)",
                                }}
                                key={value}
                                label={value}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {SubordinateProjects?.map((p) => (
                          <MenuItem
                            key={p}
                            value={p}
                            sx={{
                              "&.Mui-selected": {
                                backgroundColor: "white",
                                color: "orange",
                                fontWeight: "800",
                              },
                            }}
                          >
                            <ListItemText primary={p} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
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
                  {priorUser ? (
                    ""
                  ) : (
                    <FormControl
                      sx={{
                        minWidth: "397px",
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderRadius: "19px",
                          },
                      }}
                    >
                      {/* <InputLabel
                        id="parent-label"
                        sx={{ color: "#757575", fontSize: "14px" }}
                      >
                        Select Parent
                      </InputLabel> */}
                      {parentResult?.isSuccess &&
                        parentResult?.data?.result?.length > 0 && (
                          <InputLabel
                            id="parent-label"
                            sx={{ color: "#757575", fontSize: "14px" }}
                          >
                            Select Parent
                          </InputLabel>
                        )}
                      {parentResult?.isSuccess ? (
                        parentResult?.data?.result?.length > 0 ? (
                          <Select
                            labelId="parent-label"
                            id="parentId"
                            displayEmpty
                            value={selectedValues?.parentId}
                            label="select parent"
                            onChange={(e) =>
                              handleChange("parentId", e.target.value)
                            }
                            MenuProps={{ disableScrollLock: true }}
                          >
                            {parentResult?.data?.result?.map(
                              (option, index) => (
                                <MenuItem key={index} value={option}>
                                  {option?.name}
                                </MenuItem>
                              ),
                            )}
                          </Select>
                        ) : (
                          <Typography sx={{ textAlign: "center" }}>
                            No options available for parents
                          </Typography>
                        )
                      ) : (
                        <Typography sx={{ textAlign: "center" }}>
                          Loading parent options...
                        </Typography>
                      )}
                    </FormControl>
                  )}
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
    </>
  );
}
