"use client";

import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Add } from "@mui/icons-material";
// import PhoneInput from "react-phone-input-2";
import { checkValidRoleToAddLead } from "../../../../shared/roleManagement";
import {
  useAddLeadMutation,
  useGetCPSQuery,
  useGetProjectWithPermissionQuery,
} from "@/reduxSlice/apiSlice";
// import "react-phone-input-2/lib/style.css";

export default function Page() {
  const [permissionproject, setPermissionProject] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [userCpCode, setUserCpCode] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  checkValidRoleToAddLead(role);

  const [leadData] = useAddLeadMutation();
  // console.log(checkBranchHeadAndExecutes);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "+91",
    project: "",
    companyCode: "",
    notes: "",
    id: "",
  });

  const resultProject = useGetProjectWithPermissionQuery();
  const resultCps = useGetCPSQuery();

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setRole(jsonData.role || "");
      setUserId(jsonData._id);
      setUserCpCode(jsonData.cpCode);
    } else {
      console.error("No data found");
    }
  }, []);
  console.log(userCpCode);
  const handleCpChange = (event) => {
    const selectedCpName = event.target.value;
    setSelectedCompanyName(selectedCpName);
    console.log(selectedCpName);
  };

  useEffect(() => {
    if (resultProject?.data?.status === 200) {
      const projectsWithLeadAddPermission = resultProject?.data?.result?.filter(
        (project) => project?.permission === "leadAddAndView",
      );

      setPermissionProject(projectsWithLeadAddPermission);
      console.log(resultProject);
    }
  }, [resultProject]);

  useEffect(() => {
    const selectedCp = resultCps?.data?.result?.find(
      (cp) => cp?.name === selectedCompanyName,
    );

    if (selectedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        companyCode: selectedCp?.companyCode,
        id: selectedCp?.id,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        companyCode: userCpCode,
        id: userId,
      }));
    }
  }, [resultCps, selectedCompanyName]);

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    // if (
    //   !formData.userName ||
    //   !formData.email ||
    //   !formData.phone ||
    //   !formData.project ||
    //   !formData.companyCode ||
    //   !formData.id
    // ) {
    //   toast.error("Please fill in all required fields");
    //   return;
    // }
    setFormData({
      userName: "",
      email: "",
      phone: "91",
      project: "",
      companyCode: "",
      notes: "",
      id: "",
    });
    if (selectedCompanyName) {
      setSelectedCompanyName("");
    }
    await leadData(formData);
    console.log(formData);
  };

  const [valid, setValid] = useState(true);

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
    setValid(validatePhoneNumber(value));
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
          <Link href="/leads">
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
        {/* <Grid
          sx={{
            minHeight: "580px",
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
              Add New Leads
            </Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "550px" }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "60%",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Grid>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      padding: "4px",
                      letterSpacing: ".5px",
                      color: "black",
                    }}
                  >
                    Name
                  </Typography>
                  <TextField
                    size="small"
                    name="userName"
                    placeholder="Enter name"
                    value={formData?.userName}
                    sx={{
                      width: "300px",
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderRadius: "5px",
                        },
                      "& input::placeholder": {
                        color: "black",
                      },
                    }}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                  />
                </Grid>
                <Grid>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      padding: "4px",
                      color: "black",
                    }}
                  >
                    Phone
                  </Typography>
                  <TextField
                    size="small"
                    name="phone"
                    sx={{
                      width: "300px",
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderRadius: "5px",
                        },
                      "& input::placeholder": {
                        color: "red",
                      },
                    }}
                    value={formData?.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Grid>
                <Typography
                  sx={{
                    fontSize: "13px",
                    padding: "4px",
                    color: "black",
                  }}
                >
                  Email
                </Typography>
                <TextField
                  name="email"
                  size="small"
                  placeholder="Enter email"
                  fullWidth
                  value={formData.email}
                  sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid
                sx={{
                  // border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {role[0] === "CP Branch Head" || role[0] === "CP Executive" ? (
                  ""
                ) : (
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        padding: "4px",
                        color: "black",
                      }}
                    >
                      Chanel Partner
                    </Typography>
                    <FormControl
                      size="small"
                      sx={{
                        width: "300px",
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderRadius: "5px",
                          },
                      }}
                    >
                      <Select
                        value={selectedCompanyName}
                        onChange={handleCpChange}
                        name="cp"
                        displayEmpty
                        renderValue={(selected) =>
                          selected || (
                            <Typography sx={{ color: "gray" }}>
                              Select a partner
                            </Typography>
                          )
                        }
                        MenuProps={{ disableScrollLock: true }}
                      >
                        {resultCps?.data?.result?.map((cp) => (
                          <MenuItem key={cp?.name} value={cp?.name}>
                            {cp?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      padding: "4px",
                      color: "black",
                    }}
                  >
                    Project
                  </Typography>
                  <FormControl
                    size="small"
                    sx={{
                      width: "300px",
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderRadius: "5px",
                        },
                    }}
                  >
                    <Select
                      id="project"
                      name="project"
                      displayEmpty
                      renderValue={(selected) =>
                        selected || (
                          <Typography sx={{ color: "gray" }}>
                            Select a projects
                          </Typography>
                        )
                      }
                      value={formData?.project}
                      onChange={(e) =>
                        setFormData({ ...formData, project: e.target.value })
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {permissionproject?.map((proj) => (
                        <MenuItem key={proj.name} value={proj.name}>
                          {proj.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid>
                <Typography
                  sx={{
                    fontSize: "13px",
                    padding: "4px",
                    color: "black",
                  }}
                >
                  Notes
                </Typography>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  multiline
                  rows={3}
                  name="notes"
                  type="text"
                  placeholder="Enter exclusive notes...."
                  value={formData?.notes}
                  sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Grid>
              <Button
                onClick={handleSubmitAdd}
                fullWidth
                sx={{
                  border: "1px solid gray",
                  height: "40px",
                  marginTop: "20px",
                  borderRadius: "5px",
                  letterSpacing: ".5px",
                  padding: "0px 20px ",
                  fontSize: "12px",
                  backgroundColor: "transparent",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    border: "1px solid gray",
                  },
                }}
              >
                Save&nbsp;
                <Add sx={{ fontSize: "12px" }} />
                &nbsp;Add Another Lead
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
        <Grid
          sx={{
            minHeight: "580px",
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
              Add New Leads
            </Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "550px" }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "60%",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  name="userName"
                  placeholder="Enter name"
                  value={formData?.userName}
                  sx={{
                    width: "300px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                    "& input::placeholder": {
                      color: "black",
                    },
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />

                {/* <TextField
                  name="phone"
                  sx={{
                    width: "300px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                    "& input::placeholder": {
                      color: "red",
                    },
                  }}
                  value={formData?.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                /> */}
                <Grid>
                  {/* <PhoneInput
                    inputStyle={{
                      width: "300px",
                      height: "60px",
                      backgroundColor: "white",
                    }}
                    country="in"
                    value={formData?.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      required: true,
                    }}
                  /> */}
                  {!valid && <p>Please enter a valid phone number.</p>}
                </Grid>
              </Grid>
              <Grid>
                <TextField
                  name="email"
                  placeholder="Enter email"
                  fullWidth
                  value={formData.email}
                  sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {role[0] === "CP Branch Head" || role[0] === "CP Executive" ? (
                  ""
                ) : (
                  <FormControl
                    sx={{
                      width: "300px",
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderRadius: "5px",
                        },
                    }}
                  >
                    <Select
                      value={selectedCompanyName}
                      onChange={handleCpChange}
                      name="cp"
                      displayEmpty
                      renderValue={(selected) =>
                        selected || (
                          <Typography sx={{ color: "gray" }}>
                            Select a partner
                          </Typography>
                        )
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {resultCps?.data?.result?.map((cp) => (
                        <MenuItem key={cp?.name} value={cp?.name}>
                          {cp?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl
                  sx={{
                    width: "300px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                  }}
                >
                  <Select
                    id="project"
                    name="project"
                    displayEmpty
                    renderValue={(selected) =>
                      selected || (
                        <Typography sx={{ color: "gray" }}>
                          Select a projects
                        </Typography>
                      )
                    }
                    value={formData?.project}
                    onChange={(e) =>
                      setFormData({ ...formData, project: e.target.value })
                    }
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {permissionproject?.map((proj) => (
                      <MenuItem key={proj.name} value={proj.name}>
                        {proj.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  multiline
                  rows={3}
                  name="notes"
                  type="text"
                  placeholder="Enter exclusive notes...."
                  value={formData?.notes}
                  sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderRadius: "5px",
                      },
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Grid>
              <Button
                onClick={handleSubmitAdd}
                fullWidth
                sx={{
                  border: "1px solid gray",
                  height: "40px",
                  marginTop: "20px",
                  borderRadius: "5px",
                  letterSpacing: ".5px",
                  padding: "0px 20px ",
                  fontSize: "12px",
                  backgroundColor: "transparent",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    border: "1px solid gray",
                  },
                }}
              >
                Save&nbsp;
                <Add sx={{ fontSize: "12px" }} />
                &nbsp;Add Another Lead
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
