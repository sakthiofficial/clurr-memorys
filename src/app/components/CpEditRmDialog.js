import React, { useEffect, useState } from "react";
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
  useEditCpRmMutation,
  useGetRealtionshipManagerQuery,
} from "@/reduxSlice/apiSlice";

export default function CpEditRmDialog({ data, id, refetch }) {
  const [open, setOpen] = useState(false);
  const [selectedRmProjects, setSelectedRmProjects] = useState([]);

  const [selectedRm, setSelectedRm] = useState([data?.result?.cpRm?.name]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const {
    data: rmQueryData,
    error: rmQueryError,
    loading: rmQueryLoading,
    isFetching: rmQueryIsFetching,
  } = useGetRealtionshipManagerQuery();

  useEffect(() => {
    const filteredData = rmQueryData?.result.filter((item) =>
      selectedRm?.includes(item?.name),
    );
    setSelectedRmProjects(filteredData);
  }, [rmQueryData, selectedRm]);

  useEffect(() => {
    if (selectedRmProjects) {
      setSelectedProjects(selectedRmProjects[0]?.projects);
      console.log("inside effect", selectedRmProjects[0]);
    }
  }, [selectedRmProjects]);

  // console.log(selectedProjects);

  const handleRmChange = (event) => {
    const selectedRmName = event.target.value;
    setSelectedRm([selectedRmName]);
  };

  const handleProjectsChange = (event) => {
    setSelectedProjects(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedRm([data?.result?.cpRm?.name]);
    setOpen(false);
  };

  const [cpRmEdit] = useEditCpRmMutation();

  const handleSubmit = async () => {
    const updatedValues = {
      projects: selectedProjects,
      id,
      parentId: selectedRmProjects[0]?._id,
    };
    await cpRmEdit(updatedValues);
    // console.log(updatedValues);
    handleClose();
    await refetch();
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
          borderRadius: "5px",
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
                {(rmQueryData?.result || []).map((rm) => (
                  <MenuItem key={rm?.name} value={rm?.name}>
                    {rm?.name}
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
                {(selectedProjects || []).map((pro) => (
                  <MenuItem
                    key={pro}
                    value={pro}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "white",
                        color: "orange",
                        fontWeight: "500",
                      },
                    }}
                  >
                    {pro}
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
            <Button
              sx={{ border: "1px solid black", color: "black" }}
              onClick={handleCancel}
            >
              cancel
            </Button>
            <Button
              sx={{ border: "1px solid black", color: "black" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  );
}
