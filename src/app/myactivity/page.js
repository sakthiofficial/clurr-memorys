"use client";

import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import Timeline from "../components/Timeline";

export default function page() {
  const [search, setSearch] = useState("");

  return (
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
          backgroundColor: "black",
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
          My Activity
        </Typography>
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          height: "15vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <Grid sx={{ padding: "15px" }}>
          <TextField
            size="small"
            label="Search"
            name="email"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "500px",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid
        sx={{
          minHeight: "100vh",
          // padding: "20px",
        }}
      >
        <Timeline />
      </Grid>
    </Grid>
  );
}
