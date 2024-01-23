import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { dateToUnixTimestamp } from "../../../shared/dateCalc";
import { useGetProjectByDateQuery } from "@/reduxSlice/apiSlice";

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date("2023-09-15"), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];

      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: "default",
  },
  {
    label: "Next week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];

      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: "default",
  },
];

export default function DateRangeComponent({ selectedProject }) {
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState([
    null,
    null,
  ]);

  const [selectedStartDate, SetSelectedStartDate] = useState("");
  const [selectedEndDate, SetSelectedEndDate] = useState("");

  const { combine, before, afterToday } = DateRangePicker;
  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 6);
  const defaultFilterValue = [new Date("2023-09-15"), new Date()];

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

  // console.log(data);
  const handleDateRangeFilter = (newValue) => {
    setSelectedDateRangeFilter(newValue);
    if (newValue[0] !== null && newValue[1] !== null) {
      const startSelectDate = dateToUnixTimestamp(newValue[0]);
      SetSelectedStartDate(startSelectDate);
      const endSelectDate = dateToUnixTimestamp(newValue[1]);
      SetSelectedEndDate(endSelectDate);
    }
  };

  const dummy1 = typeof selectedStartDate;
  console.log("start date ", selectedStartDate);
  console.log(dummy1);
  console.log("end date", selectedEndDate);

  // if(selectedProject){

  // }
  const { data, error, isLoading } = useGetProjectByDateQuery(selectedProject);

  useEffect(() => {
    if (selectedProject !== undefined && selectedProject !== null) {
      if (!isLoading && !error && !data) {
        console.log("Making API call for selectedProject:", selectedProject);
      }
    }
  }, [selectedProject, isLoading, error, data]);


  return (
    <DateRangePicker
      defaultValue={defaultFilterValue}
      ranges={predefinedRanges}
      placeholder="Fitler By Date"
      disabledDate={combine(before("08/10/2023"), afterToday())}
      locale={locale}
      style={{ width: 250 }}
      onOk={(value) => handleDateRangeFilter(value)}
      onChange={(value) => handleDateRangeFilter(value)}
    />
  );
}
