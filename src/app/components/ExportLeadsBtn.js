"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Input,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import "rsuite/dist/rsuite.min.css";
import { useEffect, useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ExportsLeadsBtn() {
  const [open, setOpen] = React.useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleExport = () => {
    // console.log(
    //   "Exporting leads from",
    //   selectedStartDate,
    //   "to",
    //   selectedEndDate,
    //   "for project",
    //   selectedProject,
    // );

    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedProject("");

    setOpen(false);
  };

  const handleProjectChange = (event) => {
    const projectName = event.target.value;
    const selectedProjectData = projects.find(
      (proj) => proj.name === projectName,
    );
    if (selectedProjectData) {
      setSelectedStartDate(selectedProjectData.startDate);
      setSelectedEndDate(selectedProjectData.endDate);
    }
    setSelectedProject(projectName);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setProjects(jsonData.projects || []);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          backgroundColor: "rgba(249, 184, 0, 1)",
          color: "black",
          width: "154px",
          height: "43px",
          borderRadius: "13px",
          border: "none",
          fontSize: "13px",
          fontWeight: "400",
          "&:hover": {
            backgroundColor: "rgba(249, 184, 0, 1)",
            boxShadow: "none",
            border: "none",
          },
        }}
      >
        Export Leads
      </Button>
      <BootstrapDialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            height: "350px",
            border: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            position: "relative",
          },
        }}
        disableScrollLock
      >
        <Grid
          sx={{
            border: "none",
            height: "55px",
            width: "400px",
            borderRadius: "19px",
            backgroundColor: "#F9B800",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
            Export Leads
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid
          sx={{
            border: "1px solid rgba(189, 189, 189, 1)",
            height: "180px",
            width: "400px",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Grid
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                marginBottom: "15px",
                textAlign: "start",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                width: "90%",
                fontSize: "12px",
              }}
            >
              Select Project
            </Typography>
            <FormControl
              size="small"
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "15px",
                },
              }}
            >
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                id="project"
                name="project"
                label="project"
                MenuProps={{ disableScrollLock: true }}
                onChange={handleProjectChange}
              >
                {projects?.map((proj) => (
                  <MenuItem key={proj} value={proj}>
                    {proj}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            sx={{
              width: "80%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid sx={{ width: "40%" }}>
              <Typography sx={{ marginBottom: "10px", fontSize: "13px" }}>
                Duration from
              </Typography>
              <Input
                type="date"
                value={selectedStartDate}
                onChange={handleProjectChange}
                sx={{
                  '& input[type="date"]': {
                    borderBottom: 0,
                    borderRadius: "5px",
                    border: "1px solid lightgray",
                    padding: "3px",
                  },
                }}
              />
            </Grid>
            <Grid sx={{ width: "40%" }}>
              <Typography sx={{ marginBottom: "10px", fontSize: "13px" }}>
                Duration to
              </Typography>
              <Input
                type="date"
                sx={{
                  '& input[type="date"]': {
                    outline: "none",
                    borderRadius: "5px",
                    border: "1px solid lightgray",
                    padding: "5px",
                  },
                }}
                value={selectedEndDate}
                onChange={handleProjectChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Button
          onClick={handleExport}
          sx={{
            border: "none",
            height: "55px",
            width: "400px",
            borderRadius: "19px",
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "black",
              boxShadow: "none",
              border: "none",
            },
          }}
        >
          Export
        </Button>
      </BootstrapDialog>
    </>
  );
}
