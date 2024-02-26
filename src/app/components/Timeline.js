import React, { useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import isTodayOrYesterday, { unixTo12HourTime } from "../../../shared/dateCalc";

export default function NoOppositeContent({
  resultActivityData,
  isFetching,
  resultActivityData2,
  isFetching2,
}) {
  const [isOpen, setIsOpen] = useState({});

  useEffect(() => {
    const initialState = {};
    (resultActivityData || []).forEach((activity, index) => {
      const dateKeys = Object.keys(activity);

      dateKeys.forEach((date, activityIndex) => {
        if (isTodayOrYesterday(date)) {
          initialState[`timeline${index + 1}-${activityIndex + 1}`] = false;
        } else {
          initialState[`timeline${index + 1}-${activityIndex + 1}`] = true;
        }
      });
    });
    setIsOpen(initialState);
  }, [resultActivityData]);

  const handleToggle = (timelineKey) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [timelineKey]: !prevState[timelineKey],
    }));
  };

  return (
    <>
      {isFetching || isFetching2 ? (
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
      ) : (
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
              minHeight: "25vh",
            },
          }}
        >
          {(resultActivityData || resultActivityData2 || []).map(
            (dateActivities, index) =>
              Object.entries(dateActivities)
                .reverse()
                .map(([date, activities], activityIndex) => (
                  <Grid key={date} sx={{ padding: "0px 10px" }}>
                    <Button
                      onClick={() =>
                        handleToggle(
                          `timeline${index + 1}-${activityIndex + 1}`
                        )
                      }
                      sx={{
                        margin: "40px 0px",
                        padding: " 5px 10px",
                        color: "black",
                        fontSize: "12px",
                        borderRadius: "10px",
                        backgroundColor: "#F9B800",
                        "&:hover": {
                          backgroundColor: "#F9B800",
                          boxShadow: "none",
                          border: "none",
                        },
                      }}
                    >
                      {isTodayOrYesterday(date) || date}
                      {isOpen[`timeline${index + 1}-${activityIndex + 1}`] ? (
                        <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ fontSize: "18px" }} />
                      )}
                    </Button>
                    {isOpen[`timeline${index + 1}-${activityIndex + 1}`] &&
                      activities.map((activity) => (
                        <TimelineItem key={date}>
                          <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <Grid sx={{ display: "flex", marginTop: "3px" }}>
                            <TimelineContent
                              sx={{ fontSize: "12px", paddingLeft: "30px" }}
                            >
                              {unixTo12HourTime(activity.created)}
                            </TimelineContent>
                            <Grid>
                              <TimelineContent sx={{ fontSize: "12px" }}>
                                {activity.message}
                              </TimelineContent>
                              <TimelineContent
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: "30px",
                                    height: "30px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {activity?.performedBy
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </Avatar>
                                <Typography>{activity.performedBy}</Typography>
                              </TimelineContent>
                            </Grid>
                          </Grid>
                        </TimelineItem>
                      ))}
                    <Divider
                      sx={{
                        margin: isOpen[
                          `timeline${index + 1}-${activityIndex + 1}`
                        ]
                          ? "30px"
                          : 0,
                      }}
                    />
                  </Grid>
                ))
          )}
        </Timeline>
      )}
    </>
  );
}
