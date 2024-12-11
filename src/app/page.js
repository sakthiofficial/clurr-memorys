"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

function App() {
  const [timerEnd, setTimerEnd] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to calculate the remaining time until 7 PM tomorrow
  const calculateTimeUntil7PM = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate()); // set to tomorrow
    tomorrow.setHours(19, 0, 0, 0); // set to 7:00 PM
    return Math.floor((tomorrow - now) / 1000); // return seconds until 7 PM tomorrow
  };

  // Timer logic
  useEffect(() => {
    const timeUntil7PM = calculateTimeUntil7PM();
    setTimerValue(timeUntil7PM);

    if (timeUntil7PM > 0) {
      const interval = setInterval(() => {
        setTimerValue((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    setTimerEnd(true); // Timer has ended, show surprise
  }, []);

  const memories = [
    { image: "/images/fight.jpg", text: "First fight we had 😂" },
    {
      image: "/images/movie.jpg",
      text: "The day I felt there was a shoulder to lean on 🥺",
    },
    {
      image: "/images/caring.jpg",
      text: "I conveyed how I will take care of you through an image 😁💖",
    },
    {
      image: "/images/beach.jpg",
      text: "A beautiful night with a beautiful girl 🙈😍",
    },
    // { image: "/path/to/image5.jpg", text: "The day we made a promise 🤝" },
  ];

  if (timerEnd) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "linear-gradient(45deg, #FF6F91, #FFB6C1)",
          minHeight: "100vh",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              color: "#fff",
              marginBottom: 4,
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            This is not goodbye, it's just the next challenge in our
            relationship. We will miss each other, and many emotions will come
            our way. But no matter what happens, I will always be there for you,
            for the rest of my life.
            <br /> Thank you for making me feel more valuable. The way you
            admire me makes me a more respectful person, and it shows me how
            important I am to you.
            <br />
            Anyways, I won't stop my stupid things like saying kavithais,
            sending silly photos, and making you a little angry by sending weird
            messages 😂 <br />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold", marginBottom: 3, color: "#fff" }}
            >
              Alagi, I'm going to miss you 🥺💗
            </Typography>
          </Typography>
          <Grid container spacing={3}>
            {memories.map((memory, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={memory.image}
                    alt={`Memory ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      padding: 2,
                      fontWeight: "bold",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {memory.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            sx={{
              marginTop: 5,
              backgroundColor: "#FF4081",
              "&:hover": { backgroundColor: "#FF80AB" },
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "18px",
            }}
          >
            Let’s Make More Memories 💕
          </Button>
        </Container>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(45deg, #FF6F91, #FFB6C1)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "20px",
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          A Countdown to My Heart ❤️
        </Typography>

        <Box
          sx={{ marginBottom: 5, display: "flex", justifyContent: "center" }}
        >
          <CountdownCircleTimer
            isPlaying={!timerEnd}
            duration={timerValue}
            initialRemainingTime={timerValue}
            colors={[
              ["#FF6F91", 0.33],
              ["#FFB6C1", 0.33],
              ["#FF4081", 0.33],
            ]}
            size={isMobile ? 150 : 200}
            strokeWidth={isMobile ? 8 : 10}
            trailColor="#ffffff"
            strokeLinecap="round"
          >
            {({ remainingTime }) => (
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "28px" : "36px",
                }}
              >
                {Math.floor(remainingTime / 3600)}:
                {Math.floor((remainingTime % 3600) / 60)}:{remainingTime % 60}
              </Typography>
            )}
          </CountdownCircleTimer>
        </Box>
      </Container>
    </div>
  );
}

export default App;
