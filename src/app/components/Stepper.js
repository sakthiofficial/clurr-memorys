import React, { useState } from "react";
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
import { useSendEmailForForgetPasswordMutation } from "@/reduxSlice/apiSlice";

const steps = [
  {
    label: "",
    description: "Enter Your Email",
  },
  {
    label: "Code sent to asfer6xxxx@gmail.com",
    description: "Enter Your Code",
  },
  {
    label: "",
    description: "Enter Your Password",
  },
];

export default function Stepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // console.log(email);

  const maxSteps = steps.length;

  const [sendEmail] = useSendEmailForForgetPasswordMutation();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (email) {
      sendEmail(email);
      // console.log(email);
    }
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
          textAlign: "start",
          padding: "2px",
        }}
      >
        <Typography
          sx={{ width: "100%", fontSize: "18px", letterSpacing: ".5px" }}
        >
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
        }}
      >
        <Typography
          sx={{
            width: "98%",
            textAlign: "start",
            marginBottom: "5px",
            color: "green",
            fontSize: "14px",
          }}
        >
          {steps[activeStep].label}
        </Typography>
        {activeStep === 0 && (
          <TextField
            placeholder={`${steps[activeStep].description}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "19px",
              },
            }}
          />
        )}
        {activeStep === 1 && (
          <TextField
            placeholder={`${steps[activeStep].description}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderRadius: "19px",
              },
            }}
          />
        )}
        {activeStep === 2 && (
          <>
            <TextField
              placeholder="Enter New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                width: "100%",
                marginBottom: "20px",
                marginTop: "50px",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
            />
            <TextField
              placeholder="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                width: "100%",
                marginBottom: "30px",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
            />
          </>
        )}
        {/* <Typography
          sx={{
            width: "98%",
            textAlign: "end",
            marginTop: "10px",
            fontSize: "12px",
          }}
        >
          <Link href="/login">Do you remember your password?</Link>
        </Typography> */}

        {activeStep === 0 && (
          <Typography
            sx={{
              width: "98%",
              textAlign: "end",
              marginTop: "10px",
              marginBottom: "30px",
              fontSize: "12px",
            }}
          >
            <Link href="/login">Do you remember your password?</Link>
          </Typography>
        )}
        {activeStep === 1 && (
          <Typography
            sx={{
              width: "98%",
              textAlign: "end",
              marginTop: "10px",
              marginBottom: "30px",
              fontSize: "12px",
            }}
          >
            <Link href="/login">Do you remember your password?</Link>
          </Typography>
        )}
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
