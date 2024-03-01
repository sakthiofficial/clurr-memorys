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

  console.log(data);

  return (
    <Grid
      container
      sx={{
        // border: "1px solid black",
        display: "flex",
        height: "50vh",
        // marginBottom: "40px",
        justifyContent: "start",
        width: "100vw",
        padding:"10px"
      }}
    >
      <Grid
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "start",
          //   height: "300px",
          alignItems: "center",
          //   border: "1px solid black",
        }}
      >
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "30vh",
            // width:"300px"
            // border: "1px solid black",
            marginTop: "20px",
            // marginBottom: "40px",
            // display: "flex",
            // justifyContent: "start",
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
              <DynamicFunnel
                data={data.sort((a, b) => b.value - a.value)}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                direction="horizontal"
                shapeBlending={1}
                colors={data.map((item) => item.color)}
                borderWidth={0}
                borderOpacity={0.65}
                // labelColor={{ theme: "white" }}
                // labelColor={{
                //   from: "color",
                //   modifiers: [["darker", "5"]],
                // }}
                labelColor="black"
                currentBorderWidth={0}
                // spacing={4}
                motionConfig={{
                  mass: 1,
                  tension: 170,
                  friction: 26,
                  clamp: false,
                  precision: 0.01,
                  velocity: 0,
                }}
              />
              <Grid
                sx={{
                  display: "flex",
                  //   flexDirection: "column",
                  justifyContent: "space-around",
                  //   border: "1px solid black",
                  //   width: "100%",
                }}
              >
                {data.map((item) => (
                  <Grid
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      //   border: "1px solid black",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      sx={{
                        width: "10px",
                        height: "10px",
                        // marginRight: "5px",
                        backgroundColor: item.color,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        width: "100px",
                        textAlign: "center",
                      }}
                      key={item.id}
                    >
                      {item.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
