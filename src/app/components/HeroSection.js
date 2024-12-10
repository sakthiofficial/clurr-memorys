import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";

export default function BannerSection() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Images for Desktop and Mobile */}
      <Box
        component="img"
        src="https://assetzpropertybangalore.com/melodiesoflife/wp-content/themes/melodiesoflife/assets/images/MOL.jpg"
        alt="Melodiesoflife Desktop banner"
        sx={{
          display: { xs: "none", sm: "block" },
          width: "100%",
          height: "auto",
        }}
      />
      <Box
        component="img"
        src="https://assetzpropertybangalore.com/melodiesoflife/wp-content/themes/melodiesoflife/assets/images/MOL-mobile.jpg"
        alt="Melodiesoflife Mobile banner"
        sx={{
          display: { xs: "block", sm: "none" },
          width: "100%",
          height: "auto",
        }}
      />

      {/* Form Section */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
          padding: { xs: 2, sm: 4 },
          width: { xs: "90%", sm: "400px" },
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
        >
          Kindly share your details to know more about Melodies Of Life
        </Typography>

        <form>
          <TextField
            label="Name"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            type="tel"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}
