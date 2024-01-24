import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

export function ProfileInfo({ name, role }) {
  const [profileInfo, setprofileInfo] = useState(false);
  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
    // handleCloseUserMenu();
  };

  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        position: "relative",
        border: "1px solid black",
        // width: "100%",
        padding: "5px",
        borderRadius: "48px",
      }}
      onClick={() => setprofileInfo(!profileInfo)}
    >
      <Box
        sx={{
          width: "48px",
          height: "48px",
          flexShrink: "0",
          borderRadius: "48px",
          backgroundColor: "black",
          // display:"flex"
        }}
      />

      <Grid
        sx={{
          display: { md: "flex", xs: "none" },
          alignItems: "center",
          justifyContent: "center",
          // border: "1px solid red",
        }}
        // onClick={() => setprofileInfo(!profileInfo)}
      >
        <Typography
          variant="p"
          sx={{
            color: "#212121",
            fontWeight: "500",
            fontSize: { lg: "18px", xs: "14px" },
            fontStyle: "normal",
            // padding: "15px 0px",
            marginBottom: "0px",
            textTransform: "capitalize",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          gutterBottom
        >
          {name}
        </Typography>
        <ExpandMoreIcon sx={{ padding: 0, marginBottom: "3px" }} />
      </Grid>
      {profileInfo ? (
        <Grid
          container
          position="absolute"
          top="3rem"
          xs={12}
          sx={{
            width: "280px",
            height: "191px",
            flexShrink: "0",
            borderRadius: "18px",
            backgroundColor: "#FFF",
            boxShadow: "0px 0px 14px 0px rgba(0, 108, 181, 0.49)",
            padding: "1rem 0.5rem",
          }}
        >
          <Grid container xs={12} alignItems="center">
            <Grid item xs={3}>
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  flexShrink: "0",
                  borderRadius: "48px",
                  backgroundColor: "black",
                }}
              />
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                // border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#212121",

                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: "600",
                  padding: "5px",
                  // lineHeight: "30px",
                  // margin: "0px 5px",
                }}
              >
                {name}
              </Typography>
              <Box
                sx={{
                  width: "108px",
                  height: "34px",
                  flexShrink: "0",
                  borderRadius: "8px",
                  background: "rgba(0, 108, 181, 0.10)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // margin: "5px 10px",
                }}
              >
                <Typography
                  variant="body"
                  sx={{
                    color: "#006CB5",
                    fontSize: "10px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    padding: "2px",
                    // lineHeight: "30px",
                  }}
                >
                  {role}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container xs={12}>
            <Button
              onClick={handleSignOut}
              sx={{
                width: "100%",
                height: "40px",
                flexShrink: "0",
                borderRadius: "10px",
                border: "1px solid #CA0000",
                background: "rgba(202, 0, 0, 0.10)",
                color: "#CA0000",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "30px",
                textTransform: "capitalize",
              }}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}
ProfileInfo.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
};
