import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
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

const emails = ["username@gmail.com", "user02@gmail.com"];

function CpDialogBox(props) {
  const { onClose, selectedValue, open } = props;
  // const {data}=data
  // console.log(cpName);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const [selectedRm, setSelectedRm] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleRmChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRm(typeof value === "string" ? value.split(",") : value);
  };

  const handleProjectsChange = (event) => {
    setSelectedProjects(event.target.value);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableScrollLock
      maxWidth="90px"
      // fullWidth
      // sx={{ height: "800px" }}
      PaperProps={{
        sx: {
          // borderRadius: "34px",
          height: "300px",
          // border: "1px solid black",
          display: "flex",
          // justifyContent: "space-between",
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
              {names?.map((rm) => (
                <MenuItem key={rm} value={rm}>
                  {rm}
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
                  {selected?.map((value) => (
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
              {names?.map((project) => (
                <MenuItem
                  key={project}
                  value={project}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "white",
                      color: "orange",
                      fontWeight: "500",
                    },
                  }}
                >
                  {project}
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
          <Button sx={{ border: "1px solid black" }}>cancel</Button>
          <Button sx={{ border: "1px solid black" }}>Save</Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

CpDialogBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo({ data }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  console.log(data);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <Grid sx={{ border: "1px solid black" }}>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          backgroundColor: "rgba(249, 184, 0, 1)",
          color: "black",
          minWidth: "154px",
          height: "35px",
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
        Change Rm and project
      </Button>
      <CpDialogBox
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </Grid>
  );
}
