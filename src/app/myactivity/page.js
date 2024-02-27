"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import Timeline from "../components/Timeline";
import { dateToUnixTimestamp } from "../../../shared/dateCalc";
import "rsuite/dist/rsuite.min.css";
import { useGetActivityByIdQuery } from "@/reduxSlice/apiSlice";
import { structureDataInDateWise } from "../../../shared/dataHandler";
import Link from "next/link";

export default function Page() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const { combine, before, afterToday } = DateRangePicker;
  // const today = new Date();
  // const last7Days = new Date(today);
  // last7Days.setDate(today.getDate() - 6);
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
  // console.log(selectedStartDate);
  // console.log(selectedEndDate);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setUser(jsonData);
    }
  }, []);

  const updatedValues = {
    from: selectedStartDate,
    to: selectedEndDate,
    id: user?._id,
  };

  const { data, isFetching } = useGetActivityByIdQuery(updatedValues);
  const resultActivityData = structureDataInDateWise(data?.result);

  // console.log(resultActivityData)
  // console.log(updatedValues);

  const Calendar = {
    sunday: "Su",
    monday: "Mo",
    tuesday: "Tu",
    wednesday: "We",
    thursday: "Th",
    friday: "Fr",
    saturday: "Sa",
    ok: "Apply",
    today: "Today",
    yesterday: "Yesterday",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    formattedMonthPattern: "MMM yyyy",
    formattedDayPattern: "dd MMM yyyy",
  };
  const locale = {
    DateRangePicker: {
      ...Calendar,
      last7Days: "Last 7 Days",
    },
  };

  return (
    <>
      <Grid
        sx={{
          height: "5vh",
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          justifyContent: "end",
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
          <Grid
            sx={{
              padding: "15px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "end",
              gap: "10px",
              // border: "1px solid black",
              height: "100%",
              width: "100%",
            }}
          >
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
                locale={locale}
                style={{ width: 280 }}
                onOk={(value) => handleDateRangeFilter(value)}
                onChange={(value) => handleDateRangeFilter(value)}
                size="lg"
                showOneCalendar
              />
            </FormControl>
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
          </Grid>
        </Grid>

        <Grid
          sx={{
            minHeight: "100vh",
          }}
        >
          <Timeline
            resultActivityData2={resultActivityData}
            isFetching2={isFetching}
          />
        </Grid>
      </Grid>
    </>
  );
}
