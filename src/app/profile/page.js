"use client";

import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetUserByIdQuery } from "@/reduxSlice/apiSlice";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const { data, isFetching, refetch } = useGetUserByIdQuery(userData?._id);

  console.log(data);

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);

      setUserData(jsonData);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, [data]);

  console.log(data?.result);
  return (
    <Grid
      sx={{
        border: "1px solid lightgrey",
        borderRadius: "30px",
        marginBottom: "20px",
        maxWidth: "1356px",
        margin: "0 auto",
      }}
    >
      <Grid
        sx={{
          height: "12vh",
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
          Profile Information
        </Typography>
      </Grid>

      <Grid
        sx={{
          minHeight: "65vh",
          // border: "1px solid black",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Grid
          sx={{
            // border: "1px solid black",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Grid
            sx={{
              width: "90%",
              border: "1px solid lightgray",
              height: "90%",
              borderRadius: "15px ",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "gray",
                  width: "60px",
                  // border: "1px solid black",
                }}
              >
                Name
              </Typography>
              <TextField size="small" value={data?.result?.name} disabled />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "gray",
                  width: "60px",
                  // border: "1px solid black",
                }}
              >
                Email
              </Typography>
              <TextField size="small" value={data?.result?.email} disabled />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "gray",
                  width: "60px",
                  // border: "1px solid black",
                }}
              >
                Phone
              </Typography>
              <TextField size="small" value={data?.result?.phone} disabled />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "gray",
                  width: "60px",
                  // border: "1px solid black",
                }}
              >
                Role
              </Typography>
              <TextField size="small" value={data?.result?.role[0]} disabled />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          sx={{
            // border: "1px solid black",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            sx={{
              width: "90%",
              border: "1px solid lightgray",
              height: "90%",
              borderRadius: "15px ",
              // display: "flex",
            }}
          >
            <Grid
              sx={{
                // border: "1px solid black",
                width: "100%",
                height: "18%",
                borderRadius: "15px 15px 0px 0px",
                // backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "#021522",
                  // opacity: ".5px",
                  fontWeight: "lighter",
                }}
              >
                Reset Password
              </Typography>
            </Grid>
            <Grid
              sx={{
                width: "100%",
                height: "80%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "20px",
                gap: "10px",
              }}
            >
              <Grid>
                <Typography
                  sx={{ color: "gray", fontSize: "14px", marginBottom: "5px" }}
                >
                  New Password
                </Typography>
                <TextField sx={{ width: "100%" }} />
              </Grid>
              <Grid>
                <Typography
                  sx={{ color: "gray", fontSize: "14px", marginBottom: "5px" }}
                >
                  Confirm Password
                </Typography>
                <TextField sx={{ width: "100%" }} />
              </Grid>
              <Button
                sx={{
                  width: "30%",
                  alignSelf: "end",
                  color: "black",
                  backgroundColor: "none",
                  borderRadius: "10px",
                  boxShadow: "none",
                  border: "1px solid black",
                  marginTop: "10px",

                  "&:hover": {
                    backgroundColor: "none",
                    boxShadow: "none",
                    border: "1px solid black",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
