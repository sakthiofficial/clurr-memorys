"use client";

import {
  Typography,
  Grid,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [userManagementValue, setUserManagementValue] = useState("show");
  const [cpManagementValue, setCpManagementValue] = useState("hide");
  const [leadsValue, setLeadsValue] = useState("hide");
  const [leadManagementValue, setLeadManagementValue] = useState("show");
  const [projectManagementValue, setProjectManagementValue] = useState("show");
  const [activityHistoryValue, setActivityHistoryValue] = useState("hide");

  const handleUserManagementChange = (event) => {
    setUserManagementValue(event.target.value);
  };

  const handleCpManagementChange = (event) => {
    setCpManagementValue(event.target.value);
  };

  const handleLeadsChange = (event) => {
    setLeadsValue(event.target.value);
  };

  const handleLeadManagementChange = (event) => {
    setLeadManagementValue(event.target.value);
  };

  const handleProjectManagementChange = (event) => {
    setProjectManagementValue(event.target.value);
  };

  const handleActivityHistoryChange = (event) => {
    setActivityHistoryValue(event.target.value);
  };

  const handleSubmit = () => {
    const updatedValue = {
      projectManagement: projectManagementValue,
      userManagement: userManagementValue,
      leads: leadsValue,
      leadManagement: leadManagementValue,
      cpManagement: cpManagementValue,
      activityHistory: activityHistoryValue,
    };
    console.log(updatedValue);
  };

  const handleCancel = () => {
    setUserManagementValue("show");
    setCpManagementValue("hide");
    setLeadsValue("hide");
    setLeadManagementValue("show");
    setProjectManagementValue("show");
    setActivityHistoryValue("hide");
  };

  return (
    <>
      <Grid
        sx={{
          height: "5vh",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Link href="/permission">
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
          border: "1px solid lightgrey",
          borderRadius: "30px",
          marginBottom: "20px",
        }}
      >
        <Grid
          sx={{
            height: "10vh",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#021522",
            borderRadius: "30px 30px 0px 0px",
            color: "white",
            justifyContent: "space-between",
            padding: "30px",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
            }}
          >
            Edit Permission
          </Typography>
        </Grid>
        <Grid
          sx={{
            borderBottom: "1px solid lightgray",
            minHeight: "10vh",
            padding: "20px",
            flexWrap: "wrap",
            //   width: "80%",
            backgroundColor: "rgba(250, 185, 0, 0.06)",
          }}
        >
          <Grid
            sx={{
              // border: "1px solid black",
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "10vh",
            }}
          >
            <Grid sx={{ display: "flex" }}>
              <Typography
                sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "18px" }}
              >
                UserDetails
              </Typography>
              {/* &nbsp;&nbsp;&nbsp;
          <Typography sx={{ fontSize: "14px" }}>asfer</Typography> */}
            </Grid>
            <Grid sx={{ display: "flex" }}>
              <Typography
                sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "16px" }}
              >
                Name&nbsp; -
              </Typography>
              &nbsp;&nbsp;&nbsp;
              <Typography
                sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "16px" }}
              >
                Asfer
              </Typography>
            </Grid>
            <Grid sx={{ display: "flex" }}>
              <Typography
                sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "16px" }}
              >
                Role&nbsp; -
              </Typography>
              &nbsp;&nbsp;&nbsp;
              <Typography
                sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "16px" }}
              >
                Superadmin
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            sx={{
              //   border: "1px solid black",
              width: "85%",
              height: "80%",
              display: "flex",
              //   justifyContent: "space-around",
              //   flexDirection
              marginBottom: "30px",
              alignItems: "center",
              flexDirection: "column",
              gap: "50px",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>
                    User Management
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={userManagementValue}
                      onChange={handleUserManagementChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>
                    Cp Management
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={cpManagementValue}
                      onChange={handleCpManagementChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>Leads</Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={leadsValue}
                      onChange={handleLeadsChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>
                    Lead Management
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={leadManagementValue}
                      onChange={handleLeadManagementChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>
                    Project Management
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={projectManagementValue}
                      onChange={handleProjectManagementChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "200px",
                  height: "150px",
                  //   border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{
                    width: "80%",
                    height: "80%",
                    // border: "1px solid black",
                  }}
                >
                  <Typography sx={{ marginBottom: "15px" }}>
                    Activity History
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={activityHistoryValue}
                      onChange={handleActivityHistoryChange}
                    >
                      <FormControlLabel
                        value="show"
                        control={<Radio />}
                        label="Show"
                      />
                      <FormControlLabel
                        value="hide"
                        control={<Radio />}
                        label="Hide"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            sx={{
              //   border: "1px solid black",
              width: "80%",
              height: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "25px",
            }}
          >
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
              onClick={handleSubmit}
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
        </Grid>
      </Grid>
    </>
  );
}
