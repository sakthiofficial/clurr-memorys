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
import {
  useResetPasswordMutation,
  useSendEmailForForgetPasswordMutation,
  useVerfiyEmailOtpMutation,
} from "@/reduxSlice/apiSlice";

export default function Stepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgetUserDetails, setForgetUserDetails] = useState(null);
  const [forgetUserOtpDetails, setForgetUserOtpDetails] = useState(null);
  console.log(forgetUserOtpDetails?.data?.result?.id);
  const [emailError, setEmailError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const steps = [
    {
      label: "",
      description: "Enter Your Email",
    },
    {
      label: `Code sent to ${forgetUserDetails?.data?.result?.email}`,
      description: "Enter Your Code",
    },
    {
      label: "",
      description: "Enter Your Password",
    },
  ];

  // console.log(forgetUserDetails?.data?.result?.email);

  const maxSteps = steps.length;

  const [
    sendEmail,
    { data: sendEmailResult, loading: sendEmailLoading, error: sendEmailError },
  ] = useSendEmailForForgetPasswordMutation();

  const [
    sendOtp,
    { data: sendOtpResult, loading: sendOtpLoading, error: sendOtpError },
  ] = useVerfiyEmailOtpMutation();

  const [
    resetPasswordSend,
    {
      data: sendPasswordResult,
      loading: sendPasswordLoading,
      error: sendPasswordError,
    },
  ] = useResetPasswordMutation();

  // console.log(emailError);
  // console.log(activeStep);
  const handleEmailSend = async () => {
    const updatedEmail = {
      email: email,
    };

    // if (email) {
    try {
      const result = await sendEmail(updatedEmail);
      setForgetUserDetails(result);
      if (result?.error?.data?.message === "NOTFOUND") {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
      if (result?.data?.message === "OK") {
        setActiveStep(1);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setActiveStep(0);
    }
    // }

    // if (code) {
    //   try {
    //     const result = await sendOtp(updatedOtp);
    //     console.log(result);
    //     // if (result?.error?.data?.message === "NOTFOUND") {
    //     //   setEmailError(true);
    //     // } else {
    //     //   setEmailError(false);
    //     // }
    //     // if (result?.data?.message === "OK") {
    //     //   setActiveStep(1);
    //     // }

    //     const otpResult = await sendOtp(updatedOtp);
    //     console.log(otpResult);
    //   } catch (error) {
    //     console.error("Error sending email:", error);
    //     setActiveStep(0);
    //   }
    // }
  };

  const handleOtpSend = async () => {
    const updatedOtp = {
      otp: code,
    };

    try {
      const result = await sendOtp(updatedOtp);
      // console.log(result);
      setForgetUserOtpDetails(result);
      if (result?.error?.data?.message === "UNAUTHORIZED") {
        setCodeError(true);
      } else {
        setCodeError(false);
      }
      if (result?.data?.message === "OK") {
        setActiveStep(2);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setActiveStep(1);
    }
  };
console.log(passwordError)
  const handleForgetPassword = async () => {
    const updatedPassword = {
      newPassword: confirmPassword,
      id: forgetUserOtpDetails?.data?.result?.id,
    };

    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      try {
        const result = await resetPasswordSend(updatedPassword);
        // console.log(result);
        if (result?.data?.message === "OK") {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error sending email:", error);
        setActiveStep(1);
      }
    }

    // try {
    //   const result = await resetPasswordSend(updatedPassword);
    //   // console.log(result);
    //   if (result?.data?.message === "OK") {
    //     window.location.href = "/login";
    //   }
    // } catch (error) {
    //   console.error("Error sending email:", error);
    //   setActiveStep(1);
    // }
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
            error={emailError}
            helperText={emailError && "email not found"}
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
            error={codeError}
            helperText={codeError && "i`nvalid code"}
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
              error={passwordError}
              helperText={passwordError && "password not match"}
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
              marginBottom: "0px",
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
              marginBottom: "0px",
              fontSize: "12px",
            }}
          >
            <Link href="/login">Do you remember your password?</Link>
          </Typography>
        )}
      </Box>
      {activeStep === 0 && (
        <MobileStepper
          sx={{
            width: "100%",
            // border: "1px solid black",
            display: "flex",
            // flexDirection: "column",
            justifyContent: "space-between",
          }}
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleEmailSend}
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
        />
      )}
      {activeStep === 1 && (
        <MobileStepper
          sx={{
            width: "100%",
            // border: "1px solid black",
            display: "flex",
            // flexDirection: "column",
            justifyContent: "space-between",
          }}
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleOtpSend}>
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
        />
      )}
      {activeStep === 2 && (
        <MobileStepper
          sx={{
            width: "100%",
            // border: "1px solid black",
            display: "flex",
            // flexDirection: "column",
            justifyContent: "space-between",
          }}
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleForgetPassword}>
              Submit
            </Button>
          }
        />
      )}
    </Box>
  );
}
