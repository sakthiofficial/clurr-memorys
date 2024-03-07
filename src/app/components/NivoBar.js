"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "@nivo/bar/dist/nivo-bar.es";

const DynamicFunnel = lazy(() =>
  import("@nivo/bar").then((module) => ({
    default: module.ResponsiveBar,
  }))
);

export default function NivoBar({ data: initialData }) {
  const [LoadedFunnel, setLoadedFunnel] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setLoadedFunnel(true);
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // console.log(data);

  return (
    <Grid container sx={{ width: "100vw", padding: "0px 40px 0px 40px " }}>
      {/* <Typography sx={{ padding: "0px", color: "gray", fontWeight: "midbold",border:"1px solid black" }}>
        Recent 7 Days Lead Registered
      </Typography> */}
      <Grid sx={{ width: "100%" }}>
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "50vh",
            // border:"1px solid black"
          }}
        >
          {/* <Typography
            sx={{
              padding: "0px",
              color: "gray",
              fontWeight: "midbold",
              // border: "1px solid black",
            }}
          >
            Recent 7 Days Lead Registered
          </Typography> */}
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
                data={data}
                keys={[
                  "hot dog",
                  "burger",
                  "sandwich",
                  "kebab",
                  "fries",
                  "donut",
                ]}
                indexBy="country"
                margin={{ top: 20, right: 30, bottom: 35, left: 30 }}
                padding={0.60}
                maxValue={20}
                layout="vertical"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={"#3d81f3"}
                borderRadius={15}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "#38bcb2",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "#eed312",
                    rotation: -45,
                    lineWidth: 8,
                    spacing: 10,
                  },
                ]}
                fill={[
                  {
                    match: {
                      id: "fries",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "sandwich",
                    },
                    id: "lines",
                  },
                ]}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", "0"]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 15,
                  tickRotation: 0,
                  legendOffset: 32,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 15,
                  tickRotation: 0,
                  legendOffset: -60,
                  truncateTickAt: 0,
                }}
                // enableGridX={true}
                enableLabel={true}
                labelSkipWidth={0}
                labelSkipHeight={0}
                labelTextColor="black"
                // labelTextColor={{
                //   from: "color",
                //   modifiers: [["darker", "0.1"]],
                // }}
                legends={[]}
                isInteractive={false}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={(e) =>
                  e.id +
                  ": " +
                  e.formattedValue +
                  " in country: " +
                  e.indexValue
                }
              />
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
