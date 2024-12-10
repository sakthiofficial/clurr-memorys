"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

// Placeholder for memory images and texts
const memories = [
  { img: "/path-to-image1.jpg", text: "First fight we had 😂" },
  { img: "/path-to-image2.jpg", text: "The best coffee date ☕" },
  { img: "/path-to-image3.jpg", text: "Laughing until we cried 😂" },
  { img: "/path-to-image4.jpg", text: "Unforgettable sunsets 🌅" },
  { img: "/path-to-image5.jpg", text: "Our favorite place ❤️" },
];

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

  return (
    <div
      style={{
        background: timerEnd
          ? "linear-gradient(45deg, #FFD1DC, #FFC1E3)"
          : "linear-gradient(45deg, #FF6F91, #FFB6C1)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        color: "#fff",
        transition: "background 1s ease-in-out",
      }}
    >
      {!timerEnd ? (
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
              isPlaying
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
            Only {Math.floor(timerValue / (24 * 60 * 60))} days left until I
            miss you...
          </Typography>
        </Container>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ width: "100%" }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                marginBottom: 3,
                fontSize: isMobile ? "28px" : "36px",
                color: "#FF4081",
              }}
            >
              Memories with You 💖
            </Typography>
            <Typography
              variant="h6"
              paragraph
              sx={{ fontStyle: "italic", marginBottom: 4, color: "#333" }}
            >
              Every photo tells a story, every moment was a gift. Here's to us
              and all the beautiful memories we've created together.
            </Typography>
            <Grid container spacing={2}>
              {memories.map((memory, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                      "&:hover img": { transform: "scale(1.1)" },
                    }}
                  >
                    <img
                      src={memory.img}
                      alt={memory.text}
                      style={{
                        width: "100%",
                        height: "auto",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {memory.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              sx={{
                marginTop: 4,
                backgroundColor: "#FF4081",
                "&:hover": { backgroundColor: "#FF80AB" },
                padding: "10px 20px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Let’s Make More Memories Together 💕
            </Button>
          </Container>
        </motion.div>
      )}
    </div>
  );
}

export default App;
