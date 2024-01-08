"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAddFormDataMutation } from "@/reduxSlice/apiSlice";

function Page() {
  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [formData, setFormData] = useState({
    usernameOrEmailOrPhone: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();

  useAddFormDataMutation();

  const handleSubmit = async () => {
    try {
      // console.log(data);
      // router.push("/");
    } catch (error) {
      console.error("Form submission failed. Please try again.", error);
      // You can handle errors or display an alert here
    }
  };

  return (
    <Box
      sx={{
        height: isLargeScreen ? "100vh" : "150vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        flexDirection: isLargeScreen ? "row" : "column",
      }}
    >
      <Box
        sx={{
          width: isLargeScreen ? "55%" : "100%",
          height: "100%",
        }}
      >
        hi
      </Box>
      <Box
        sx={{
          width: isLargeScreen ? "45%" : "60%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            height: "15%",
            width: "250px",
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Image
        </Box>
        <Box
          sx={{
            height: "40%",
            width: "90%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <Typography>SIGN IN TO CONTINUE</Typography>
            <Box
              width={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "80%" }}
                name="usernameOrEmailOrPhone"
                label="Username / Email / Phone"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Box>
            <Box
              width={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "80%" }}
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Box>
            <Button
              sx={{ border: "1px solid black", width: "80%" }}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
