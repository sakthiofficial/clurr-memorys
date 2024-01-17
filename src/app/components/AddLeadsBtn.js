import * as React from "react";
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
import { useState } from "react";
import {
  useAddLeadMutation,
  useGetCpQuery,
  useGetProjectQuery,
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

  // get cp data
  const { data, isLoading, isError, error } = useGetCpQuery();
  console.log(data);

  // get project data
  const result = useGetProjectQuery();
  // console.log(result.data?.result)
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
  };
  // handle submit function
  const handleSubmit = () => {
    console.log(formData);
    console.log(data.result);
  };
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
        Add Lead
      </Button>
      <BootstrapDialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "34px",
            minHeight: "500px",
            border: "1px solid black",
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
            height: "64px",
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
            height: "340px",
            width: "400px",
            borderRadius: "19px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextField
            label="Name"
            name="userName"
            value={formData?.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            sx={{ width: "80%", borderRadius: "15px", height: "48px" }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ width: "80%", borderRadius: "15px" }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData?.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            sx={{ width: "80%", borderRadius: "20px" }}
          />

          <FormControl sx={{ width: "80%" }}>
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
              {result?.data?.result.map((proj) => (
                <MenuItem key={proj?._id} value={proj?.name}>
                  {proj?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: "80%" }}>
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
                <MenuItem key={cp?.company?.id} value={cp?.company?.name}>
                  {cp?.company?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Button
          onClick={handleSubmit}
          sx={{
            border: "none",
            height: "56px",
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
          ADD USER
        </Button>
      </BootstrapDialog>
    </Grid>
  );
}

export default AddLeadsBtn;
