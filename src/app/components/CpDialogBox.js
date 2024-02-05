import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import {
  useCpManagenentQuery,
  useGetRealtionshipManagerQuery,
} from "@/reduxSlice/apiSlice";

export default function SimpleDialogDemo({ data }) {
  const [open, setOpen] = useState(false);

  const getRmQuery = useGetRealtionshipManagerQuery();

  const [selectedRm, setSelectedRm] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleRmChange = (event) => {
    setSelectedRm([event.target.value]);
  };

  const handleProjectsChange = (event) => {
    setSelectedProjects(event.target.value);
  };

  const cprmValues = {
    parentId: data?.result?.cpRm?.parentId,
    id: data?.result?.company?._id,
    projects: data?.result?.cpRm?.projects,
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const updatedValues = {
      projects: selectedProjects,
      role: selectedRm,
    };
    console.log(updatedValues);
  };
  console.log(data?.result?.cpRm?.name);
  console.log(data?.result?.cpRm?.projects);

  return (
    <Grid sx={{ border: "1px solid black" }}>
      <Button
        variant="outlined"
        // onClick={handleClickOpen}
        sx={{
          backgroundColor: "rgba(249, 184, 0, 1)",
          color: "black",
          minWidth: "154px",
          height: "35px",
          borderRadius: "8px",
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
        Change Rm and project
      </Button>
      <Dialog
        onClose={handleClose}
        open={open}
        disableScrollLock
        maxWidth="90px"
        PaperProps={{
          sx: {
            height: "300px",
            display: "flex",
            alignItems: "center",
            padding: "10px",
          },
        }}
      >
        <Grid
          sx={{
            // border: "1px solid red",
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // alignItems: "center",
            width: "100%",
          }}
        >
          <Grid>
            <Typography
              sx={{ padding: "10px", paddingBottom: "20px", fontSize: "20px" }}
            >
              Change RM And Project
            </Typography>
            <FormControl sx={{ m: 1, width: 300 }} size="small">
              <InputLabel id="demo-category-label">Category (RM)</InputLabel>
              <Select
                labelId="demo-category-label"
                id="demo-category"
                value={selectedRm}
                onChange={handleRmChange}
                MenuProps={{ disableScrollLock: true }}
                input={
                  <OutlinedInput id="select-category" label="Category (RM)" />
                }
              >
                {(getRmQuery?.data?.result || []).map((rm) => (
                  <MenuItem key={rm.name} value={rm.name}>
                    {rm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300 }} size="small">
              <InputLabel id="demo-projects-label">Projects</InputLabel>
              <Select
                labelId="demo-projects-label"
                id="demo-projects"
                multiple
                value={selectedProjects}
                onChange={handleProjectsChange}
                MenuProps={{ disableScrollLock: true }}
                input={<OutlinedInput id="select-projects" label="Projects" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected || []).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        sx={{
                          backgroundColor: "rgba(250, 185, 0, 0.28)",
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {(getRmQuery?.data?.result || []).map((pro) => (
                  <MenuItem
                    key={pro.projects}
                    value={pro.projects}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "white",
                        color: "orange",
                        fontWeight: "500",
                      },
                    }}
                  >
                    {pro.projects}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            sx={{
              // border: "1px solid black",
              display: "flex",
              justifyContent: "end",
              gap: "20px",
            }}
          >
            <Button sx={{ border: "1px solid black" }} onClick={handleClose}>
              cancel
            </Button>
            <Button sx={{ border: "1px solid black" }} onClick={handleSubmit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  );
}
