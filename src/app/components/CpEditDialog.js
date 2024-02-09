import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Grid, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEditUserMutation } from "@/reduxSlice/apiSlice";

export default function CpEditDialog({ data, refetch }) {
  const [open, setOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    name: data?.name,
    email: data?.email,
    phone: data?.phone,
    id: data?._id,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setEditedData({
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
    });
  };

  const handleInputChange = (fieldName, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const [cpBranchEdit] = useEditUserMutation();

  const handleSubmit = async () => {
    console.log("Submitting changes:", editedData);
    await cpBranchEdit(editedData);
    setOpen(false);
    await refetch();
  };

  return (
    <Grid>
      <EditIcon
        sx={{ fontSize: "20px", cursor: "pointer" }}
        onClick={handleClickOpen}
      />
      <Dialog
        onClose={handleClose}
        open={open}
        disableScrollLock
        maxWidth="100px"
        PaperProps={{
          sx: {
            height: "400px",
            width: "300px",
            display: "flex",
            alignItems: "center",
            padding: "15px",
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
              sx={{
                padding: "5px",
                paddingBottom: "20px",
                fontSize: "16px",
              }}
            >
              Change Branch Head Details
            </Typography>
            <Grid
              sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <TextField
                value={editedData?.name}
                name="name"
                id="outlined-required"
                label="Name"
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <TextField
                value={editedData?.email}
                name="email"
                id="outlined-required"
                label="Email"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <TextField
                id="outlined-required"
                label="Phone"
                name="phone"
                value={editedData?.phone}
                disabled
              />
            </Grid>
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
