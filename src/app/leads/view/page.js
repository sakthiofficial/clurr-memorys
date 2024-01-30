"use client";

import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetLeadByPhoneQuery } from "@/reduxSlice/apiSlice";

export default function Page({ searchParams }) {
  const router = useRouter();
  const params = useSearchParams();

  const phone = params.get("phone");
  const project = params.get("project");
  const [phonenumber, setPhoneNumber] = useState(phone);

  console.log("phone number check", phonenumber);
  console.log(project);

  // get leads by phone
  const { data, isFetching } = useGetLeadByPhoneQuery({ project, phonenumber });
  // console.log(data);

  // handle back function
  const handleBack = () => {
    router.push("/leads");
  };

  return (
    <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
      <Grid sx={{ heigth: "8vh", marginBottom: "20px" }}>
        <Button
          onClick={handleBack}
          sx={{
            border: "1px solid black",
            borderRadius: "10px",
            color: "black",
            padding: "5px 20px",
          }}
        >
          back
        </Button>
      </Grid>
      {isFetching && (
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
      )}
      {data?.result?.map((leads) => (
        <Grid
          sx={{
            minHeight: "100vh",
          }}
        >
          <Grid
            sx={{
              border: "1px solid lightgrey",
              minheight: "20vh",
              borderRadius: "30px",
              marginBottom: "20px",
            }}
          >
            <Grid
              sx={{
                height: "10vh",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(250, 185, 0, 0.06)",
                borderRadius: "30px 30px 0px 0px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  padding: " 0px 30px",
                }}
              >
                Client Details
              </Typography>
            </Grid>
            <Grid
              sx={{
                height: "10vh",
                display: "flex",
                alignItems: "center",
                padding: " 0px 30px",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Grid sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Name
                </Typography>
                &nbsp;:&nbsp;&nbsp;
                <Typography>{leads?.FirstName || "N/A"}</Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Email
                </Typography>
                &nbsp;:&nbsp;&nbsp;
                <Typography>{leads?.EmailAddress || "N/A"}</Typography>
              </Grid>
              <Grid sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Phone
                </Typography>
                &nbsp;:&nbsp;&nbsp;
                <Typography>{leads?.Phone || "N/A"}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid sx={{ minHeight: "50vh", marginBottom: "20px" }}>
            <Grid
              sx={{
                height: "50vh",
                // border: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                // flexDirection: "column",
                flexWrap: "wrap",
              }}
            >
              <Grid
                sx={{
                  width: "48%",
                  border: "1px solid lightgray",
                  borderRadius: "30px",
                  display: "flex",
                  // justifyContent: "space-around",
                  padding: "30px 0px",
                }}
              >
                <Grid
                  sx={{
                    // border: "1px solid black",
                    // height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: "20px",
                    paddingRight: "40px",
                  }}
                >
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Project
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Lead Sourse
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Cp Name
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Is Primary
                  </Typography>
                </Grid>
                <Grid
                  sx={{
                    // border: "1px solid black",
                    // height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // padding: "40px",
                  }}
                >
                  <Typography>{project || "N/A"}</Typography>
                  <Typography>{leads?.Source || "N/A"}</Typography>
                  <Typography>{leads?.mx_Sub_Source || "N/A"}</Typography>
                  <Typography>N/A</Typography>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  width: "48%",
                  border: "1px solid lightgray",
                  borderRadius: "30px",
                  display: "flex",
                  // justifyContent: "space-around",
                  padding: "30px 0px",
                }}
              >
                <Grid
                  sx={{
                    // border: "1px solid black",
                    // height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // padding: "40px",
                    paddingLeft: "20px",
                    paddingRight: "40px",
                  }}
                >
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Lead Status
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Registration Status
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Created Date & Time
                  </Typography>
                  <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                    Created By
                  </Typography>
                </Grid>
                <Grid
                  sx={{
                    // border: "1px solid black",
                    // height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // padding: "40px",
                  }}
                >
                  <Grid>
                    <Typography
                      sx={{
                        display: "inline-block",
                        minWidth: "80px",
                        // height: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#00ad11",
                        color: "white",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {leads?.ProspectStage}
                    </Typography>
                  </Grid>
                  <Typography>N/A</Typography>
                  <Typography>{leads?.CreatedOn || "N/A"}</Typography>
                  <Typography>{leads?.CreatedByName || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            sx={{
              border: "1px solid lightgrey",
              minheight: "20vh",
              borderRadius: "30px",
            }}
          >
            <Grid
              sx={{
                height: "20vh",
                display: "flex",
                alignItems: "center",
                // flexDirection:"column",
              }}
            >
              <Grid
                sx={{ fontSize: "15px", padding: " 0px 30px", display: "flex" }}
              >
                <Typography sx={{ color: "rgba(58, 53, 65, 0.68)" }}>
                  Notes By Cp
                </Typography>
                &nbsp;&nbsp;:&nbsp;&nbsp;
                <Typography
                  sx={{
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {leads?.Notes || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
