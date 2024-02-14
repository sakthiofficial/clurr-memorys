"use client";

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
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

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
      <Grid sx={{ padding: "0px 10px" }}>
        <Button
          onClick={handleToggle}
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
          Today
          {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        </Button>
        {isOpen && (
          <>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <Grid sx={{ display: "flex", marginTop: "3px" }}>
                <TimelineContent sx={{ fontSize: "12px", paddingLeft: "30px" }}>
                  12:30 pm
                </TimelineContent>
                <Grid>
                  <TimelineContent sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do
                  </TimelineContent>
                  <TimelineContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                    >
                      A
                    </Avatar>
                    <Typography>Asfer</Typography>
                  </TimelineContent>
                </Grid>
              </Grid>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <Grid sx={{ display: "flex", marginTop: "3px" }}>
                <TimelineContent sx={{ fontSize: "12px", paddingLeft: "30px" }}>
                  12:30 pm
                </TimelineContent>
                <Grid>
                  <TimelineContent sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do
                  </TimelineContent>
                  <TimelineContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                    >
                      A
                    </Avatar>
                    <Typography>Asfer</Typography>
                  </TimelineContent>
                </Grid>
              </Grid>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" variant="filled" />
                <TimelineConnector />
              </TimelineSeparator>
              <Grid sx={{ display: "flex", marginTop: "3px" }}>
                <TimelineContent sx={{ fontSize: "12px", paddingLeft: "30px" }}>
                  12:30 pm
                </TimelineContent>
                <Grid>
                  <TimelineContent sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do
                  </TimelineContent>
                  <TimelineContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                    >
                      A
                    </Avatar>
                    <Typography>Asfer</Typography>
                  </TimelineContent>
                </Grid>
              </Grid>
            </TimelineItem>
          </>
        )}
        <Divider sx={{ margin: isOpen ? "30px" : 0 }} />
      </Grid>
    </Timeline>
  );
}
