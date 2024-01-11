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
  Switch,
  Chip,
  Box,
} from "@mui/material";
import Link from "next/link";
import { DeleteOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useGetRealtionshipManagerQuery } from "@/reduxSlice/apiSlice";

export default function Page() {
  const [userData, setUserData] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [showAddAccountButton, setShowAddAccountButton] = useState(true);

  const result = useGetRealtionshipManagerQuery();
  console.log(result?.data?.result);

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setUserData(jsonData);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);

  const [formData, setFormData] = useState({
    cpCompany: {
      name: "",
      projects: [],
      parentId: "",
    },
    cpExecutes: [
      {
        projects: selectedProjects,
        role: "CP Executive",
        isPrimary: true,
      },
    ],
  });

  const handleRmChange = (event) => {
    setSelectedCategory(event.target.value);
    // Reset selected projects when category changes
    setSelectedProjects([]);
  };

  const handleProjectsChange = (event) => {
    setSelectedProjects(event.target.value);
  };

  const validateForm = () => {
    if (!formData.cpCompany.name) {
      console.error("Company name is required.");
      return false;
    }

    if (
      formData.cpExecutes.some(
        (exec) => !exec.name || !exec.phone || !exec.email || !exec.password,
      )
    ) {
      console.error("All CP Executive fields are required.");
      return false;
    }

    return true;
  };

  const handleAddAccount = () => {
    const updatedCpExecutes = [
      ...formData.cpExecutes,
      {
        projects: [],
        role: "CP Executive",
        // isPrimary: false,
      },
    ];

    setFormData({
      ...formData,
      cpExecutes: updatedCpExecutes,
    });

    if (updatedCpExecutes.length < 2) {
      setShowAddAccountButton(true);
    } else {
      setShowAddAccountButton(false);
    }
  };

  const handleDeleteAccount = (index) => {
    const updatedCpExecutes = [...formData.cpExecutes];

    if (index !== 0) {
      updatedCpExecutes.splice(index, 1);
    }

    setFormData({
      ...formData,
      cpExecutes: updatedCpExecutes,
    });

    if (updatedCpExecutes.length < 2) {
      setShowAddAccountButton(true);
    } else {
      setShowAddAccountButton(false);
    }
  };

  const handleSwitchChange = (index, checked) => {
    setFormData((prev) => ({
      ...prev,
      cpExecutes: prev.cpExecutes.map((item, i) => ({
        ...item,
        isPrimary: i === index ? checked : !checked,
      })),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      const updatedValues = {
        ...formData.cpCompany,
        projects: selectedProjects,
        parentId: userData ? userData._id : formData.cpCompany.parentId,
      };

      const usersData = {
        ...formData,
        cpCompany: updatedValues,
      };

      console.log(usersData);
    } else {
      console.error("Form is not valid. Please fill in all required fields.");
    }
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
        <Link href="/cpmanagement">
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
            Add New CP
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
            <Grid
              sx={{
                minHeight: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "50px",
                padding: "15px",
              }}
            >
              <Grid
                sx={{
                  width: "100%",
                  minHeight: "100px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="channel partner company name"
                  name="cpCompany.name"
                  type="text"
                  sx={{
                    width: "380px",
                    color: "black",
                  }}
                  size="small"
                  value={formData.cpCompany.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpCompany: {
                        ...formData.cpCompany,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <FormControl sx={{ m: 1, width: 300 }} size="small">
                  <InputLabel id="demo-category-label">
                    Category (RM)
                  </InputLabel>
                  <Select
                    labelId="demo-category-label"
                    id="demo-category"
                    value={selectedCategory}
                    onChange={handleRmChange}
                    MenuProps={{ disableScrollLock: true }}
                    input={
                      <OutlinedInput
                        id="select-category"
                        label="Category (RM)"
                      />
                    }
                  >
                    {result?.data?.result?.map((rm) => (
                      <MenuItem key={rm.name} value={rm.name}>
                        {rm.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ m: 1, width: 300 }} size="small">
                  <InputLabel id="demo-projects-label">
                    Projects (Chip)
                  </InputLabel>
                  <Select
                    labelId="demo-projects-label"
                    id="demo-projects"
                    multiple
                    value={selectedProjects}
                    onChange={handleProjectsChange}
                    MenuProps={{ disableScrollLock: true }}
                    input={
                      <OutlinedInput
                        id="select-projects"
                        label="Projects (Chip)"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {selectedProjects.map((project) => (
                      <MenuItem key={project} value={project}>
                        {project}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                sx={{
                  width: "100%",
                  minHeight: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {formData.cpExecutes.map((cpExecute, index) => (
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <TextField
                        label={`name ${index + 1}`}
                        name={`cpExecutes[${index}].name`}
                        type="text"
                        size="small"
                        sx={{ width: "18%" }}
                        value={cpExecute.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cpExecutes: prev.cpExecutes.map((item, i) =>
                              i === index
                                ? { ...item, name: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <TextField
                        label={`number ${index + 1}`}
                        name={`cpExecutes[${index}].phone`}
                        type="number"
                        size="small"
                        sx={{ width: "12%" }}
                        value={cpExecute.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cpExecutes: prev.cpExecutes.map((item, i) =>
                              i === index
                                ? { ...item, phone: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <TextField
                        label={`email ${index + 1}`}
                        name={`cpExecutes[${index}].email`}
                        type="email"
                        size="small"
                        sx={{ width: "18%" }}
                        value={cpExecute.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cpExecutes: prev.cpExecutes.map((item, i) =>
                              i === index
                                ? { ...item, email: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <TextField
                        label={`password ${index + 1}`}
                        name={`cpExecutes[${index}].password`}
                        type="password"
                        size="small"
                        sx={{ width: "18%" }}
                        value={cpExecute.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cpExecutes: prev.cpExecutes.map((item, i) =>
                              i === index
                                ? { ...item, password: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <Grid sx={{ display: "flex", alignItems: "center" }}>
                        <Switch
                          checked={cpExecute.isPrimary}
                          onChange={(e) =>
                            handleSwitchChange(index, e.target.checked)
                          }
                        />
                        <DeleteOutline
                          onClick={() => handleDeleteAccount(index)}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                <Grid
                  sx={{
                    marginTop: "25px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {showAddAccountButton ? (
                    <Button
                      sx={{ border: "1px solid black" }}
                      onClick={handleAddAccount}
                    >
                      Add Another Account
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "80%",
                  minHeight: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={handleSubmit}>Submit</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}