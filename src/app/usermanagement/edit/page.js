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
  Box,
  Chip,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useGetUserByIdQuery } from "@/reduxSlice/apiSlice";
import { isPriorityUser } from "../../../../shared/roleManagement";

export default function Page({ searchParams }) {
  const { id } = searchParams;
  // console.log(id);
  const [userData, setUserData] = useState(null);

  const { data, isFetching } = useGetUserByIdQuery(id);
  // console.log(data?.result);
  const priorUser = isPriorityUser(data?.result?.role[0] || "N/A");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  // console.log(formData.username);
  const [selectedValues, setSelectedValues] = useState({
    projects: [],
    role: [],
    parent: "",
  });

  useEffect(() => {
    if (data?.result) {
      setFormData({
        username: data.result.name || "",
        email: data.result.email || "",
        phone: data.result.phone || "",
        password: "",
      });

      setSelectedValues({
        projects: data?.result?.projects || [],
        role: data?.result?.role || [],
        parent: "",
      });
    }
  }, [data]);

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

    const updatedValue = {
      ...formData,
      ...selectedValues,
    };

    console.log(updatedValue);
  };

  const parentOptions = ["ParentOne", "ParentTwo", "ParentThree"];

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);

      setUserData(jsonData);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);
  // console.log(userData);
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
        {isFetching ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
              {isFetching ? (
                ""
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "640px",
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
                      // marginBottom: "40px",
                    }}
                  />

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
                      <InputLabel
                        id="parent-label"
                        sx={{ color: "#757575", fontSize: "14px" }}
                      >
                        Choose one role
                      </InputLabel>
                      <Select
                        labelId="parent-label"
                        id="parent"
                        displayEmpty
                        value={selectedValues.role}
                        label="Choose one role"
                        onChange={(e) => handleChange("role", e.target.value)}
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {userData?.subordinateRoles?.map((option, index) => (
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
                        <InputLabel id="demo-projects-label">
                          project
                        </InputLabel>

                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={selectedValues.projects}
                          onChange={(e) =>
                            handleChange("projects", e.target.value)
                          }
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="project"
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
                                    borderRadius: "10px",
                                  }}
                                  key={value}
                                  label={value}
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={{ disableScrollLock: true }}
                        >
                          {userData?.projects?.map((p) => (
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
                              {p}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
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
                  )}

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
                      Update
                    </Button>
                  </Grid>
                </form>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
