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
import { DateRangePicker } from "rsuite";
import Timeline from "../components/Timeline";
import { dateToUnixTimestamp } from "../../../shared/dateCalc";
import "rsuite/dist/rsuite.min.css";
import { useActivityQuery } from "@/reduxSlice/apiSlice";
import { structureDataInDateWise } from "../../../shared/dataHandler";

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

  // console.log(search);
  // console.log(role);

  const { combine, before, afterToday } = DateRangePicker;
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 6);
  const defaultFilterValue = [new Date("2024-01-01"), new Date()];

  const intialStartDate = dateToUnixTimestamp(defaultFilterValue[0]);
  const intialEndDate = dateToUnixTimestamp(defaultFilterValue[1]);

  const [selectedStartDate, SetSelectedStartDate] = useState(intialStartDate);
  const [selectedEndDate, SetSelectedEndDate] = useState(intialEndDate);

  const handleDateRangeFilter = (newValue) => {
    if (newValue[0] !== null && newValue[1] !== null) {
      const startSelectDate = dateToUnixTimestamp(newValue[0]);
      SetSelectedStartDate(startSelectDate);
      const endSelectDate = dateToUnixTimestamp(newValue[1]);
      SetSelectedEndDate(endSelectDate);
    }
  };

  const updatedvalue = {
    from: selectedStartDate,
    to: selectedEndDate,
    role,
  };
  const { data, isFetching } = useActivityQuery(updatedvalue);
  const resultActivityData = structureDataInDateWise(data?.result);

  // console.log(resultActivityData);

  // console.log(resultActivityData);

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
        {/* <TextField
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
        /> */}
        <FormControl
          sx={{
            width: "300px",
            // height: "0px",
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderRadius: "5px",
            },
          }}
          // size="md"
        >
          <DateRangePicker
            defaultValue={defaultFilterValue}
            placeholder="Fitler By Date"
            shouldDisableDate={combine(before("08/10/2023"), afterToday())}
            // locale={locale}
            style={{ width: 280 }}
            onOk={(value) => handleDateRangeFilter(value)}
            onChange={(value) => handleDateRangeFilter(value)}
            size="lg"
            showOneCalendar
          />
        </FormControl>
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
        }}
      >
        <Timeline
          resultActivityData={resultActivityData}
          isFetching={isFetching}
        />
      </Grid>
    </Grid>
  );
}
