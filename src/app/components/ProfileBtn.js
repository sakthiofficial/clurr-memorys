import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import Link from "next/link";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export function ProfileInfo({ name, role }) {
  const [profileInfo, setProfileInfo] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileInfo(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const firstLetter = name.charAt(0).toUpperCase();

  const profileDetails = [
    { name: "Profile", link: "profile" },
    { name: "My Activity", link: "myactivity" },
  ];

  return (
    <Grid
      ref={profileRef}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        position: "relative",
        border: "1px solid rgba(250, 185, 0, 1)",
        backgroundColor: "rgba(250, 185, 0, 0.2)",
        padding: "5px",
        borderRadius: "48px",
      }}
      onClick={() => setProfileInfo(!profileInfo)}
    >
      <Avatar>{firstLetter}</Avatar>
      <Grid
        sx={{
          display: { md: "flex", xs: "none" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="p"
          sx={{
            color: "#212121",
            fontWeight: "500",
            fontSize: { lg: "18px", xs: "14px" },
            fontStyle: "normal",
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
            minHeight: "161px",
            flexShrink: "0",
            borderRadius: "18px",
            backgroundColor: "#FFF",
            boxShadow: "0px 0px 14px 0px rgba(0, 108, 181, 0.49)",
            padding: ".5rem 0.5rem",
          }}
        >
          <Grid
            sx={{
              width: "100%",
              minHeight: "50px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ marginBottom: "10px" }}>{firstLetter}</Avatar>
            <Box
              sx={{
                padding: "4px",
                background: "rgba(0, 108, 181, 0.10)",
                borderRadius: "15px",
              }}
            >
              <Typography
                sx={{ fontSize: "12px", padding: "2px", textAlign: "center" }}
              >
                {role}
              </Typography>
            </Box>
          </Grid>
          {profileDetails.map((profile) => (
            <Link
              key={profile.name}
              href={`/${profile.link}`}
              style={{
                padding: "5px",
                width: "100%",
                fontSize: "14px",
                color: "black",
                marginBottom: "5px",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <Typography>{profile.name}</Typography>
                <ArrowRightIcon />
              </Grid>
            </Link>
          ))}
          <Grid container xs={12}>
            <Button
              onClick={handleSignOut}
              sx={{
                width: "100%",
                height: "35px",
                flexShrink: "0",
                borderRadius: "10px",
                border: "1px solid #CA0000",
                background: "rgba(202, 0, 0, 0.10)",
                color: "#CA0000",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
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
};
