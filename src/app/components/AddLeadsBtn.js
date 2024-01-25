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
import { toast } from "react-toastify";
import {
  useAddLeadMutation,
  useGetCPSQuery,
  useGetCpQuery,
  useGetProjectQuery,
  useGetProjectWithPermissionQuery,
} from "@/reduxSlice/apiSlice";
import { checkValidRoleToAddLead } from "../../../shared/roleManagement";

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
  const [permissionproject, setPermissionProject] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const checkBranchHeadAndExecutes = checkValidRoleToAddLead(role);
  console.log(checkBranchHeadAndExecutes);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    project: "",
    companyCode: "",
    id: "",
  });
  console.log(formData.id);
  // get cp data
  // console.log(data);
  const resultProject = useGetProjectWithPermissionQuery();
  const resultCps = useGetCPSQuery();

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setRole(jsonData.role || "");
      setUserId(jsonData._id);
    } else {
      console.error("No data found");
    }
  }, []);

  const handleCpChange = (event) => {
    const selectedCpName = event.target.value;
    setSelectedCompanyName(selectedCpName);
    // const selectedCp = resultCps?.data?.result?.find(
    //   (cp) => cp?.name === selectedCpName,
    // );
    // setFormData((prevData) => ({
    //   ...prevData,
    //   companyCode: selectedCp?.companyCode,
    // }));

    // if (selectedCp) {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     id: selectedCp?.id,
    //   }));
    // }
  };
  // console.log(userId)
  useEffect(() => {
    const projectsWithLeadAddPermission = resultProject.data.result.filter(
      (project) => project?.permission === "leadAddAndView",
    );
    setPermissionProject(projectsWithLeadAddPermission);
    console.log(projectsWithLeadAddPermission);
  }, []);

  useEffect(() => {
    const selectedCp = resultCps?.data?.result?.find(
      (cp) => cp?.name === selectedCompanyName,
    );

    if (selectedCp) {
      setFormData((prevData) => ({
        ...prevData,
        companyCode: selectedCp?.companyCode,
        id: selectedCp?.id,
      }));
    } else {
      console.error(`Company with name  not found in resultCps.`);
      setFormData((prevData) => ({
        ...prevData,
        companyCode: "DEFAULT_COMPANY_CODE",
        id: userId,
      }));
    }
  }, [resultCps]);

  // handle submit function
  // const handleSubmit = () => {
  //   if (!formData.id || !formData.companyCode) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       id: userId,
  //       companyCode: "DEFAULT_COMPANY_CODE",
  //     }));
  //   }

  //   console.log(formData);

  //   try {
  //     setFormData({
  //       userName: "",
  //       email: "",
  //       phone: "",
  //       project: "",
  //       companyCode: "",
  //       id: "",
  //       notes: "",
  //     });
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("User submission failed", error);
  //     // Toast.error("User submission failed. Please try again.");
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  console.log(role);
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
          {role[0] === "CP Branch Head" || role[0] === "CP Executive" ? (
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
                {resultCps?.data?.result?.map((cp) => (
                  <MenuItem key={cp?.name} value={cp?.name}>
                    {cp?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
              {permissionproject?.map((proj) => (
                <MenuItem key={proj.id} value={proj.name}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            // size="small"
            label="Notes"
            name="phone"
            type="text"
            id="outlined-textarea"
            placeholder="enter exclusive notes..."
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
