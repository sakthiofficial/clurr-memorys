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
import { Add, SaveAlt } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  checkValidRoleToAddLead,
  isCpUser,
} from "../../../../shared/roleManagement";
import {
  useAddLeadMutation,
  useGetCPSQuery,
  useGetProjectWithPermissionQuery,
} from "@/reduxSlice/apiSlice";
import { clientAppLsqMsg } from "../../../../shared/lsqConstants";
// import PhoneInput from "react-phone-input";

export default function Page() {
  const router = useRouter();
  const [permissionproject, setPermissionProject] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [isCproleCheck, setIsCproleCheck] = useState();
  const [isEmailCheckLeads, setIsEmailCheckLeads] = useState(false);
  const [userCpCode, setUserCpCode] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  checkValidRoleToAddLead(role);

  const [leadData] = useAddLeadMutation();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    project: "",
    companyCode: "",
    notes: "",
    id: "",
  });

  const resultProject = useGetProjectWithPermissionQuery();
  const resultCps = useGetCPSQuery();

  const [value, setValue] = useState("india");

  const handlePhoneInputChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setRole(jsonData?.role || "");
      setUserId(jsonData?._id);
      setUserCpCode(jsonData?.cpCode);
    } else {
      console.error("No data found");
    }
  }, []);

  const isCps = isCpUser(role);

  useEffect(() => {
    setIsCproleCheck(isCps);
  }, [role, isCps]);

  const handleCpChange = (event) => {
    const selectedCpName = event.target.value;
    setSelectedCompanyName(selectedCpName);
  };

  useEffect(() => {
    if (resultProject?.data?.status === 200) {
      const projectsWithLeadAddPermission = resultProject?.data?.result?.filter(
        (project) => project?.permission === "leadAddAndView"
      );

      setPermissionProject(projectsWithLeadAddPermission);
    }
  }, [resultProject]);

  useEffect(() => {
    if (permissionproject.length >= 1) {
      setFormData((prevData) => ({
        ...prevData,
        project: permissionproject[0]?.name,
      }));
    }
  }, [permissionproject]);

  useEffect(() => {
    const selectedCp = resultCps?.data?.result?.find(
      (cp) => cp.name === selectedCompanyName
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

    if (
      !formData.userName ||
      !formData.email ||
      !formData.phone ||
      !formData.project
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const resultLeads = await leadData(formData);
    if (resultLeads?.data?.result?.Status === "Success") {
      setFormData({
        userName: "",
        email: "",
        phone: "+91",
        project: permissionproject[0]?.name,
        companyCode: "",
        notes: "",
        id: "",
      });
      if (selectedCompanyName) {
        setSelectedCompanyName("");
      }
    }
    if (resultLeads?.data?.result?.Message?.IsCreated === true) {
      toast.success(clientAppLsqMsg.newLeadCreated, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
    if (resultLeads?.data?.result?.Message?.IsCreated === false) {
      toast.info(clientAppLsqMsg.existLeadCreated, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (resultLeads?.error?.data?.result?.email) {
      setIsEmailCheckLeads(true);
      return;
    }
    setIsEmailCheckLeads(false);

    if (resultLeads?.error?.status === 400) {
      toast.error("something went wrong");
    }
  };

  const handleSubmitSave = async (e) => {
    e.preventDefault();

    if (
      !formData.userName ||
      !formData.email ||
      !formData.phone ||
      !formData.project
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const resultLeads = await leadData(formData);
    if (resultLeads?.data?.result?.Status === "Success") {
      setFormData({
        userName: "",
        email: "",
        phone: "+91",
        project: "",
        companyCode: "",
        notes: "",
        id: "",
      });
      if (selectedCompanyName) {
        setSelectedCompanyName("");
      }
    }
    if (resultLeads?.data?.result?.Message?.IsCreated === true) {
      toast.success(clientAppLsqMsg.newLeadCreated, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setTimeout(() => {
        router.push("/leads");
      }, 2000);
    }
    if (resultLeads?.data?.result?.Message?.IsCreated === false) {
      toast.info(clientAppLsqMsg.existLeadCreated, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setTimeout(() => {
        router.push("/leads");
      }, 2000);
    }

    if (resultLeads?.error?.data?.result?.email) {
      setIsEmailCheckLeads(true);
      return;
    }
    setIsEmailCheckLeads(false);

    if (resultLeads?.error?.status === 400) {
      toast.error("something went wrong");
    }
  };
  return (
    <>
      <ToastContainer />
      <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
        <Grid
          sx={{
            height: "6vh",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            justifyContent: "end",
            // border:"1px solid black",
            // padding:"10px"
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
            // border: "1px solid #9E9E9E",
            width: "100%",
          }}
        >
          <Grid
            sx={{
              height: "59px",
              backgroundColor: "#021522",
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
            sx={{ minHeight: "600px" }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "60%",
                // border: "1px solid black",
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
                  item
                  md={12}
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
                {/* <Grid>
                  <TextField
                    name="phone"
                    placeholder="Enter phone"
                    value={formData?.phone}
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
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Grid> */}
                <Grid>
                  {/* <TextField
                    name="phone"
                    placeholder="Enter phone"
                    value={formData?.phone}
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
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  /> */}
                  <PhoneInput
                    country="in"
                    value={formData?.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    inputStyle={{height:"56px"}}
                  />
                </Grid>
              </Grid>
              {isCproleCheck ? null : (
                <Grid>
                  <TextField
                    name="email"
                    placeholder="Enter email"
                    fullWidth
                    error={isEmailCheckLeads}
                    helperText={isEmailCheckLeads && "email already exists"}
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
              )}
              {isCproleCheck ? (
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    name="email"
                    placeholder="Enter email"
                    value={formData?.email}
                    error={isEmailCheckLeads}
                    helperText={isEmailCheckLeads && "email already exists"}
                    sx={{
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderRadius: "5px",
                          width: "300px",
                        },
                    }}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Grid>
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
                        {(permissionproject || []).map((proj) => (
                          <MenuItem key={proj?.name} value={proj?.name}>
                            {proj?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : null}
              {isCproleCheck ? null : (
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
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
                            Select a chanel partner
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
                      {(permissionproject || []).map((proj) => (
                        <MenuItem key={proj?.name} value={proj?.name}>
                          {proj?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
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
              <Grid
                sx={{
                  // border: "1px solid black",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "50px",
                }}
              >
                <Button
                  onClick={handleSubmitSave}
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
                  <SaveAlt sx={{ fontSize: "12px" }} />
                  &nbsp;Save Lead
                </Button>
                <Button
                  onClick={handleSubmitAdd}
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
      </Grid>
    </>
  );
}
