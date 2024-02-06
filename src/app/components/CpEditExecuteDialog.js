import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Grid, TextField, Typography } from "@mui/material";

export default function CpEditDialog({ data, refetch }) {
  const [open, setOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    name: data[0]?.name,
    email: data[0]?.email,
    phone: data[0]?.phone,
  });

  console.log(data[0]._id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleInputChange = (fieldName, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting changes:", editedData);
    setOpen(false);
  };

  return (
    <Grid>
      <Button
        onClick={handleClickOpen}
        sx={{
          borderRadius: "10px",
          color: "black",
          width: "48px",
          height: "25px",
          fontSize: "12px",
          backgroundColor: "rgba(249, 184, 0, 1)",
          "&:hover": {
            backgroundColor: "rgba(249, 184, 0, 1)",
            boxShadow: "none",
          },
        }}
      >
        edit
      </Button>
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
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <TextField
                value={editedData?.email}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <TextField value={editedData?.phone} disabled />
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
            <Button sx={{ border: "1px solid black" }} onClick={handleCancel}>
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
