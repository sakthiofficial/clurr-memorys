import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { Add } from "@mui/icons-material";
import {
  useAddLeadMutation,
  useGetCpQuery,
  useGetProjectQuery,
  useGetProjectWithPermissionQuery,
} from "@/reduxSlice/apiSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function AddLeadsBtn() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    project: "",
    cp: "",
    id: "",
  });
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  // get cp data
  const { data, isLoading, isError, error } = useGetCpQuery();
  // console.log(data);
  const resultProject = useGetProjectWithPermissionQuery();
  // console.log(resultProject);
  // get project data
  // const result = useGetProjectQuery();
  // console.log(result.data?.result);
  // handle cp function
  const handleCpChange = (event) => {
    const selectedCpName = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      cp: selectedCpName,
    }));

    const selectedCp = data?.result?.find(
      (cp) => cp?.company?.name === selectedCpName,
    );
    if (selectedCp) {
      setFormData((prevData) => ({
        ...prevData,
        id: selectedCp?.company?._id,
      }));
    }
    if (selectedCp) {
      const branchHead = selectedCp?.cpBranchHead?.name;
      console.log("Branch Head:", branchHead);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setRole(jsonData.role || "");
    } else {
      console.error("No data found");
    }
  }, []);

  useEffect(() => {
    if (resultProject.data) {
      const datafilterProject = resultProject.data.result.map((item) => {
        const result = item?.permissions?.find(
          (permission) => permission === "leadAddAndView",
        );
        // console.log("hi", datafilterProject);
      });
      console.log("hi", datafilterProject);

      // console.log("hi", resultProject.data.result);
    }
  }, []);

  // handle submit function
  const handleSubmit = () => {
    console.log(formData);

    setFormData({
      userName: "",
      email: "",
      phone: "",
      project: "",
      cp: "",
      id: "",
      notes: "",
    });
    setOpen(false);
  };
  // console.log(role);
  return (
    <Grid>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "rgba(255, 255, 255, 1)",
          width: "125px",
          height: "43px",
          borderRadius: "13px",
          fontSize: "13px",
          fontWeight: "400",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 1)",
            boxShadow: "none",
            border: "none",
          },
        }}
      >
        <Add sx={{ fontSize: "18px" }} />
        Add Lead
      </Button>
      <BootstrapDialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            minHeight: "550px",
            width: "40%",
            // border: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          },
        }}
        disableScrollLock
      >
        <Grid
          sx={{
            border: "none",
            height: "55px",
            width: "100%",
            borderRadius: "19px",
            backgroundColor: "#F9B800",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
            Add New Lead
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
            height: "390px",
            width: "100%",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextField
            size="small"
            label="Name"
            name="userName"
            value={formData?.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            sx={{
              width: "90%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "15px",
              },
            }}
          />
          <TextField
            size="small"
            label="Email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{
              width: "90%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "15px",
              },
            }}
          />
          <TextField
            size="small"
            label="Phone"
            name="phone"
            value={formData?.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            sx={{
              width: "90%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "15px",
              },
            }}
          />

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
              value={formData?.project}
              onChange={(e) =>
                setFormData({ ...formData, project: e.target.value })
              }
              MenuProps={{ disableScrollLock: true }}
            >
              {projects?.map((proj) => (
                <MenuItem key={proj} value={proj}>
                  {proj}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {role === "CP Branch Head" ? (
            ""
          ) : (
            <FormControl
              size="small"
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "15px",
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData?.cp}
                label="Company"
                onChange={handleCpChange}
                name="cp"
              >
                {data?.result?.map((cp) => (
                  <MenuItem key={cp?.company?.name} value={cp?.company?.name}>
                    {`${cp?.company?.name} - ${cp?.cpBranchHead?.name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            // size="small"
            label="Notes"
            name="phone"
            type="text"
            id="outlined-textarea"
            placeholder="Placeholder"
            multiline
            value={formData?.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            sx={{
              width: "90%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "15px",
              },
            }}
          />
        </Grid>
        <Button
          onClick={handleSubmit}
          sx={{
            border: "none",
            height: "55px",
            width: "100%",
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
          Save Lead &nbsp;
          <Add sx={{ fontSize: "18px" }} />
          &nbsp; ADD Another Lead
        </Button>
      </BootstrapDialog>
    </Grid>
  );
}

export default AddLeadsBtn;
