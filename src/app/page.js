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
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [timerEnd, setTimerEnd] = useState(false);
  const [timerValue, setTimerValue] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Timer logic
  useEffect(() => {
    if (timerValue > 0) {
      const interval = setInterval(() => {
        setTimerValue((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    setTimerEnd(true);
  }, [timerValue]);

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
            This is not goodbye its just the next challenge in our relationship.
            We will miss each other and many emotions will come our way. But no
            matter what happens I will always be there for you for the rest of
            my life.
            <br /> Thank you for making me feel more valuable. The way you
            admire me makes me a more respectful person, and it shows me how
            important I am to you .
            <br />
            anyways i wont going to stop my stupid things like saying kavithais
            sending stupid photos and making you small small angry by sending
            wierd mesages no way u need to see this things 😂 <br />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold", marginBottom: 3, color: "#fff" }}
            >
              Alagi going to miss u 🥺💗
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
      <Container maxWidth="sm">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          A Countdown to My Heart ❤️
        </Typography>

        <Box sx={{ marginBottom: 5 }}>
          <CountdownCircleTimer
            isPlaying={!timerEnd}
            duration={7 * 24 * 60 * 60}
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

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ color: "white", marginBottom: 5 }}
        >
          Only {Math.floor(timerValue / (24 * 60 * 60))} days left until I miss
          you...
        </Typography>
      </Container>
    </div>
  );
}

export default App;
