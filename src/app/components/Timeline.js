import React, { useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Avatar, Button, Divider, Grid, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function NoOppositeContent() {
  const [isOpen, setIsOpen] = useState({
    timeline1: true,
    timeline2: true,
    timeline3: true,
  });

  const handleToggle = (timelineKey) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [timelineKey]: !prevState[timelineKey],
    }));
  };

  const timeLine = [
    {
      key: "timeline1",
      time: "12:20 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 1",
    },
    {
      key: "timeline2",
      time: "12:00 pm",
      providedBy: "Mohammed",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 2",
    },
    {
      key: "timeline3",
      time: "11:00 pm",
      providedBy: "Mohammed",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 3",
    },
    {
      key: "timeline4",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 4",
    },
    {
      key: "timeline5",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 5",
    },
    {
      key: "timeline6",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 6",
    },
    {
      key: "timeline7",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 7",
    },
    {
      key: "timeline8",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 8",
    },
    {
      key: "timeline9",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 9",
    },
    {
      key: "timeline10",
      time: "12:00 pm",
      providedBy: "Asfer",
      providedTo:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ",
      date: "Feb 10",
    },
  ];

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
          minHeight: "25vh",
        },
      }}
    >
      {timeLine.map((timelineItem) => (
        <Grid key={timelineItem.key} sx={{ padding: "0px 10px" }}>
          <Button
            onClick={() => handleToggle(timelineItem.key)}
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
            {timelineItem.date}
            {isOpen[timelineItem.key] ? (
              <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ fontSize: "18px" }} />
            )}
          </Button>
          {isOpen[timelineItem.key] && (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <Grid sx={{ display: "flex", marginTop: "3px" }}>
                <TimelineContent sx={{ fontSize: "12px", paddingLeft: "30px" }}>
                  {timelineItem.time}
                </TimelineContent>
                <Grid>
                  <TimelineContent sx={{ fontSize: "12px" }}>
                    {timelineItem.providedTo}
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
                      {timelineItem.providedBy.charAt(0)}
                    </Avatar>
                    <Typography>{timelineItem.providedBy}</Typography>
                  </TimelineContent>
                </Grid>
              </Grid>
            </TimelineItem>
          )}
          <Divider sx={{ margin: isOpen[timelineItem.key] ? "30px" : 0 }} />
        </Grid>
      ))}
    </Timeline>
  );
}
