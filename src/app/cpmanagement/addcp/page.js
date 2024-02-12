"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Switch,
  Chip,
  Box,
  IconButton,
  Dialog,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import {
  DeleteOutlineOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAddCpMutation,
  useGetRealtionshipManagerQuery,
} from "@/reduxSlice/apiSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Page() {
  // const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [cpEnteredCode, setCpEnteredCode] = useState(null);
  const [showAddAccountButton, setShowAddAccountButton] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // errors
  const [cpCompanyError, setCpCompanyError] = useState(false);
  const [cpBranchHeadName, setCpBranchHeadName] = useState(false);
  const [cpBranchHeadPhone, setCpBranchHeadPhone] = useState(false);
  const [cpBranchHeadEmail, setCpBranchHeadEmail] = useState(false);
  const [cpExecuteName, setCpExecuteName] = useState(false);
  const [cpExecutePhone, setCpExecutePhone] = useState(false);
  const [cpExecuteEmail, setCpExecuteEmail] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [formData, setFormData] = useState({
    cpCompany: {
      name: "",
      projects: [],
    },
    cpExecutes: [
      {
        name: "",
        phone: "",
        email: "",
        password: "Pass@123",
        projects: [],
        role: "",
        isPrimary: true,
      },
    ],
  });

  const router = useRouter();

  // get relational manager query
  const result = useGetRealtionshipManagerQuery();
  // console.log(result?.data?.result);

  // add cp query
  const [cpsAdd] = useAddCpMutation();
  // console.log(cpsAdd);
  // handle rm function
  const handleRmChange = (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);

    // Find the selected category data
    const selectedCategoryData = (result?.data?.result || []).find(
      (rm) => rm.name === selectedCategoryValue,
    );

    const initialSelectedProjects = selectedCategoryData?.projects || [];
    setSelectedProjects(initialSelectedProjects);
  };

  // handle project function
  const handleProjectsChange = (event) => {
    setSelectedProjects(event.target.value);
  };

  // validate from before submit
  const validateForm = () => {
    if (!formData?.cpCompany?.name) {
      console.error("Company name is required.");
      return false;
    }

    if (
      (formData?.cpExecutes || []).some(
        (exec) => !exec.name || !exec.phone || !exec.email || !exec.password,
      )
    ) {
      console.error("All CP Executive fields are required.");
      return false;
    }

    return true;
  };
  // handle add function
  // const handleAddAccount = useCallback(() => {
  //   const updatedCpExecutes = [
  //     ...(formData?.cpExecutes || []),
  //     {
  //       projects: [],
  //       role: "CP Executive",
  //       isPrimary: false,
  //     },
  //   ];

  //   setFormData({
  //     ...formData,
  //     cpExecutes: updatedCpExecutes,
  //   });

  //   if (updatedCpExecutes.length < 2) {
  //     setShowAddAccountButton(true);
  //   } else {
  //     setShowAddAccountButton(false);
  //   }
  // }, []);
  const handleAddAccount = () => {
    const updatedCpExecutes = [
      ...(formData?.cpExecutes || []),
      {
        projects: [],
        role: "CP Executive",
        isPrimary: false,
        password: "Pass@123",
      },
    ];

    setFormData({
      ...formData,
      cpExecutes: updatedCpExecutes,
    });

    if (updatedCpExecutes?.length < 2) {
      setShowAddAccountButton(true);
    } else {
      setShowAddAccountButton(false);
    }
  };

  // handle delete function
  const handleDeleteAccount = (index) => {
    const updatedCpExecutes = [...(formData?.cpExecutes || [])];

    if (index !== 0) {
      updatedCpExecutes.splice(index, 1);
    }

    setFormData({
      ...formData,
      cpExecutes: updatedCpExecutes,
    });

    if (updatedCpExecutes?.length < 2) {
      setShowAddAccountButton(true);
    } else {
      setShowAddAccountButton(false);
    }
  };

  // handle toggle function
  const handleSwitchChange = (index, checked) => {
    setFormData((prev) => {
      const updatedExecutes = prev?.cpExecutes.map((item, i) => ({
        ...item,
        role: i === index && checked ? "cpBranchHead" : "cpExecutes",
        isPrimary: i === index ? checked : !checked,
      }));
      return {
        ...prev,
        cpExecutes: updatedExecutes,
      };
    });
  };

  const selectedCategoryData = result?.data?.result?.find(
    (rm) => rm.name === selectedCategory,
  );

  // form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      const updatedValues = {
        ...formData?.cpCompany,
        projects: selectedProjects,
      };

      const cpExecutesp = formData?.cpExecutes.map((exec) => {
        const role = exec?.isPrimary ? "cpBranchHead" : "cpExecute";

        return {
          ...exec,
          role,
          projects: selectedProjects,
        };
      });

      const cpData = {
        parentId: selectedCategoryData?._id,
        cpCompany: updatedValues,
        cpEnteredCode: parseInt(cpEnteredCode),
        cpExecute: cpExecutesp.find((exec) => exec?.role === "cpExecute"),
        cpBranchHead: cpExecutesp.find((exec) => exec?.role === "cpBranchHead"),
      };

      try {
        const resultRes = await cpsAdd(cpData);
        console.log(resultRes?.error?.data?.result?.cpBranchHead);

        if (resultRes?.error?.data?.result?.cpCompany?.name === true) {
          setCpCompanyError(true);
        } else {
          setCpCompanyError(false);
        }

        if (resultRes?.error?.data?.result?.cpBranchHead?.name === true) {
          setCpBranchHeadName(true);
        } else {
          setCpBranchHeadName(false);
        }

        if (resultRes?.error?.data?.result?.cpBranchHead?.email === true) {
          setCpBranchHeadEmail(true);
        } else {
          setCpBranchHeadEmail(false);
        }

        if (resultRes?.error?.data?.result?.cpBranchHead?.phone === true) {
          setCpBranchHeadPhone(true);
        } else {
          setCpBranchHeadPhone(false);
        }

        if (resultRes?.error?.data?.result?.cpExecute?.name === true) {
          setCpExecuteName(true);
        } else {
          setCpExecuteName(false);
        }

        if (resultRes?.error?.data?.result?.cpExecute?.email === true) {
          setCpExecuteEmail(true);
        } else {
          setCpExecuteEmail(false);
        }

        if (resultRes?.error?.data?.result?.cpExecute?.phone === true) {
          setCpExecutePhone(true);
        } else {
          setCpExecutePhone(false);
        }

        if (resultRes?.error?.data?.status === 400) {
          toast.error(resultRes?.error?.data?.result);
        }

        if (resultRes?.data?.status === 200) {
          toast.success("CP added successfully!");
          setTimeout(() => {
            router.push("/cpmanagement");
          }, 1500);
        }
      } catch (error) {
        toast.error("CP submission failed", error);
      }
    }
  };
  // console.log(cpEnteredCode);

  // get user details
  // useEffect(() => {
  //   const storedData = localStorage.getItem("user");

  //   if (storedData) {
  //     const jsonData = JSON.parse(storedData);
  //     setUserData(jsonData);
  //   } else {
  //     console.error('No data found in local storage for key "user".');
  //   }
  // }, []);

  // handle dialog functions
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // handle clear
  const handleClear = () => {
    setCpEnteredCode("");
  };
  return (
    <>
      <ToastContainer />

      <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
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
                    label="Channel Partner Company Name"
                    name="cpCompany.name"
                    type="text"
                    sx={{
                      width: "380px",
                      color: "black",
                    }}
                    size="small"
                    value={formData?.cpCompany?.name}
                    error={cpCompanyError}
                    helperText={cpCompanyError && "name already exists"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cpCompany: {
                          ...formData?.cpCompany,
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
                        <MenuItem key={rm?.name} value={rm?.name}>
                          {rm?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 300 }} size="small">
                    <InputLabel id="demo-projects-label">Projects</InputLabel>
                    <Select
                      labelId="demo-projects-label"
                      id="demo-projects"
                      multiple
                      value={selectedProjects}
                      onChange={handleProjectsChange}
                      MenuProps={{ disableScrollLock: true }}
                      input={
                        <OutlinedInput id="select-projects" label="Projects" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected?.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              sx={{
                                backgroundColor: "rgba(250, 185, 0, 0.28)",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {selectedCategoryData?.projects?.map((project) => (
                        <MenuItem
                          key={project}
                          value={project}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: "white",
                              color: "orange",
                              fontWeight: "500",
                            },
                          }}
                        >
                          {project}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  sx={{
                    // border: "1px solid black",
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "30px",
                    padding: "0px 15px",
                  }}
                >
                  <Grid>
                    <Button
                      variant="outlined"
                      onClick={handleClickOpen}
                      sx={{
                        color: "red",
                        border: "1px solid  black",
                      }}
                    >
                      enter cp code
                    </Button>
                    <BootstrapDialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}
                      maxWidth="200px"
                      PaperProps={{
                        sx: {
                          borderRadius: "34px",
                          minHeight: "300px",
                          // width: "456px",
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
                        <Typography
                          sx={{ fontSize: "20px", fontWeight: "600" }}
                        >
                          ENTER CP CODE
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
                          // border: "1px solid rgba(189, 189, 189, 1)",
                          minHeight: "100px",
                          width: "400px",
                          borderRadius: "19px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <TextField
                          sx={{
                            width: "80%",
                            borderRadius: "15px",
                            height: "48px",
                          }}
                          placeholder="Provide only cpcode numbers"
                          type="number"
                          onChange={(e) => setCpEnteredCode(e.target.value)}
                          value={cpEnteredCode}
                        />
                      </Grid>
                      <Grid
                        sx={{
                          // border: "1px solid black",
                          display: "flex",
                          // flexDirection: "column",
                          justifyContent: "space-around",
                          width: "100%",
                        }}
                      >
                        <Button
                          onClick={handleClear}
                          sx={{
                            border: "1px solid black",
                            height: "46px",
                            width: "120px",
                            borderRadius: "19px",
                            backgroundColor: "white",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "white",
                              boxShadow: "none",
                              border: "1px solid black",
                            },
                          }}
                        >
                          clear
                        </Button>
                        <Button
                          onClick={handleClose}
                          sx={{
                            border: "1px solid black",
                            height: "46px",
                            width: "120px",
                            borderRadius: "19px",
                            backgroundColor: "white",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "white",
                              boxShadow: "none",
                              border: "1px solid black",
                            },
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </BootstrapDialog>
                  </Grid>
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
                    {formData?.cpExecutes?.map((cpExecute, index) => (
                      <Grid
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <TextField
                          label="Name"
                          name={`cpExecutes[${index}].name`}
                          type="text"
                          size="small"
                          sx={{ width: "18%" }}
                          value={cpExecute?.name}
                          error={cpBranchHeadName[1] || cpExecuteName[2]}
                          helperText={
                            (cpBranchHeadName[0] || cpExecuteName[1]) &&
                            "name already exists"
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cpExecutes: prev?.cpExecutes?.map((item, i) =>
                                i === index
                                  ? { ...item, name: e.target.value }
                                  : item,
                              ),
                            }))
                          }
                        />
                        <TextField
                          label="Number"
                          name={`cpExecutes[${index}].phone`}
                          type="text"
                          size="small"
                          sx={{ width: "15%" }}
                          value={cpExecute?.phone}
                          error={cpBranchHeadPhone || cpExecutePhone}
                          helperText={
                            (cpBranchHeadPhone || cpExecutePhone) &&
                            "phone already exists"
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cpExecutes: prev?.cpExecutes?.map((item, i) =>
                                i === index
                                  ? { ...item, phone: e.target.value }
                                  : item,
                              ),
                            }))
                          }
                        />
                        <TextField
                          label="Email"
                          name={`cpExecutes[${index}].email`}
                          type="email"
                          size="small"
                          sx={{ width: "18%" }}
                          value={cpExecute?.email}
                          error={cpBranchHeadEmail || cpExecuteEmail}
                          helperText={
                            (cpBranchHeadEmail || cpExecuteEmail) &&
                            "name already exists"
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cpExecutes: prev?.cpExecutes?.map((item, i) =>
                                i === index
                                  ? { ...item, email: e.target.value }
                                  : item,
                              ),
                            }))
                          }
                        />
                        {/* <TextField
                          label={`Password ${index + 1}`}
                          name={`cpExecutes[${index}].password`}
                          type={showPassword ? "text" : "password"}
                          size="small"
                          sx={{ width: "18%" }}
                          value={formData.cpExecutes[0]?.password || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cpExecutes: prev?.cpExecutes?.map((item, i) =>
                                i === index
                                  ? { ...item, password: e.target.value }
                                  : item,
                              ),
                            }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={toggleShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        /> */}
                        <TextField
                          label="Password"
                          name={`cpExecutes[${index}].password`}
                          type={showPassword ? "text" : "password"}
                          size="small"
                          sx={{ width: "18%" }}
                          value={formData?.cpExecutes[0]?.password || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cpExecutes: prev?.cpExecutes?.map((item) => ({
                                ...item,
                                password: e.target.value,
                              })),
                            }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={toggleShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Grid sx={{ display: "flex", alignItems: "center" }}>
                          <Switch
                            checked={cpExecute?.isPrimary}
                            onChange={(e) =>
                              handleSwitchChange(index, e.target.checked)
                            }
                          />
                          <DeleteOutlineOutlined
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
                        sx={{
                          border: "1px solid black",
                          // backgroundColor: "rgba(249, 184, 0, 1)",
                          color: "black",
                          height: "43px",
                          borderRadius: "5px",
                          // border: "none",
                          fontSize: "12px",
                          fontWeight: "400",
                          paddind: "5px",
                          // "&:hover": {
                          //   backgroundColor: "rgba(249, 184, 0, 1)",
                          //   boxShadow: "none",
                          //   border: "none",
                          // },
                        }}
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
                  <Button
                    sx={{
                      border: "1px solid black",
                      // backgroundColor: "rgba(249, 184, 0, 1)",
                      color: "black",
                      height: "43px",
                      borderRadius: "5px",
                      // border: "none",
                      fontSize: "12px",
                      fontWeight: "400",
                      paddind: "5px",
                      padding: "10px",
                      // "&:hover": {
                      //   backgroundColor: "rgba(249, 184, 0, 1)",
                      //   boxShadow: "none",
                      //   border: "none",
                      // },
                    }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
