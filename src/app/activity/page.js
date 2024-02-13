"use client";

import React, { useEffect, useState } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Timeline from "../components/Timeline";

export default function Page() {
  const [subOrdinateRole, setSubOrdinateRole] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  useEffect(() => {
    const storedData = localStorage?.getItem("user");
    if (storedData) {
      const jsonData = JSON?.parse(storedData);
      setSubOrdinateRole(jsonData?.subordinateRoles || []);
    }
  }, []);

  console.log(search);
  console.log(role);

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
          Activity History
        </Typography>
      </Grid>
      <Grid
        sx={{
          borderBottom: "1px solid lightgray",
          height: "15vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          flexWrap: "wrap",
        }}
      >
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
        <FormControl
          size="small"
          sx={{
            width: "350px",
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderRadius: "8px",
            },
          }}
        >
          <InputLabel id="demo-simple-select-label">Selecet role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Selecet role"
            onChange={handleChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="All">All</MenuItem>
            {(subOrdinateRole || []).map((project) => (
              <MenuItem key={project} value={project}>
                {project}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
