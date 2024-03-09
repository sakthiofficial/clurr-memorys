"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { TextField } from "@mui/material";
import Link from "next/link";

const steps = [
  {
    label: "",
    description: "Enter Your Email",
  },
  {
    label: "code send to asfer6xxxx@gmail.com",
    description: "Enter Your Code",
  },
  {
    label: "",
    description: "Enter Your Password",
  },
];

export default function Stepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: 450, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          //   pl: 2,
          //   bgcolor: "background.default",
          textAlign: "start",
          // border: "1px solid black",
          padding: "2px",
        }}
      >
        <Typography
          sx={{ width: "100%", fontSize: "18px", letterSpacing: ".5px" }}
        >
          {/* {steps[activeStep].label} */}
          Forget Your Password Here
        </Typography>
      </Paper>
      <Box
        sx={{
          height: 150,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          flexDirection: "column",
          //   border:"1px solid black"
        }}
      >
        <Typography
          sx={{
            // border: "1px solid black",
            width: "98%",
            textAlign: "start",
            marginBottom: "5px",
            color: "green",
            fontSize: "14px",
          }}
        >
          {" "}
          {steps[activeStep].label}
        </Typography>
        <TextField
          //   size="small"
          placeholder={`${steps[activeStep].description}`}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderRadius: "19px",
            },
          }}
        />
        <Typography
          sx={{
            width: "98%",
            textAlign: "end",
            marginTop: "10px",
            fontSize: "12px",
            //   border: "1px solid black",
            // color: "#0969DA",
          }}
        >
          <Link href="/login">Do you remember your password ?</Link>
        </Typography>
      </Box>
      <MobileStepper
        sx={{ width: "100%" }}
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}
