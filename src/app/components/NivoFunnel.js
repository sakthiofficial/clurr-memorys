"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "@nivo/funnel/dist/nivo-funnel.es";

const DynamicFunnel = lazy(() =>
  import("@nivo/funnel").then((module) => ({
    default: module.ResponsiveFunnel,
  }))
);

export default function NivoFunnel({ data: initialData }) {
  const [LoadedFunnel, setLoadedFunnel] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setLoadedFunnel(true);
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // console.log(data);

  const colors = ["#d4dffa", "#a6bff5", "#7a9ef1", "#4f7deb", "#235de6"];

  

  return (
    <Grid
      container
      sx={{
        display: "flex",
        height: "40vh",
        justifyContent: "start",
        width: "100vw",
        // padding: "10px",
      }}
    >
      <Grid
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "20vh",
            // marginTop: "20px",
          }}
        >
          {LoadedFunnel ? (
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Loading...
                </Box>
              }
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  // border:"1px solid black",
                  marginBottom: "20px",
                }}
              >
                {data.map((item, index) => (
                  <Grid
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // border:"1px solid black"
                    }}
                  >
                    <Grid
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: colors[index % colors.length],
                        borderRadius: "50px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        width: "100px",
                        textAlign: "center",
                        color: "gray",
                        fontWeight: "semibold",
                      }}
                      key={item.id}
                    >
                      {item.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <DynamicFunnel
                data={data.sort((a, b) => b.value - a.value)}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                direction="horizontal"
                shapeBlending={0.5}
                colors={colors}
                borderWidth={20}
                borderOpacity={0.65}
                labelColor="black"
                // currentBorderWidth={0}
                beforeSeparatorLength={100}
                afterSeparatorOffset={100}
                // currentBorderWidth={100}
                motionConfig={{
                  mass: 1,
                  tension: 170,
                  friction: 26,
                  clamp: false,
                  precision: 0.01,
                  velocity: 0,
                }}
              />
              {/* <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  // border:"1px solid black",
                  marginTop: "10px",
                }}
              >
                {data.map((item, index) => (
                  <Grid
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // border:"1px solid black"
                    }}
                  >
                    <Grid
                      sx={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: colors[index % colors.length],
                        borderRadius: "50px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        width: "100px",
                        textAlign: "center",
                        color: "gray",
                        fontWeight: "bold",
                      }}
                      key={item.id}
                    >
                      {item.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid> */}
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
