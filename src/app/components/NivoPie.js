"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "@nivo/pie/dist/nivo-pie.es";

const DynamicFunnel = lazy(() =>
  import("@nivo/pie").then((module) => ({
    default: module.ResponsivePie,
  }))
);

export default function NivoPie({ data: initialData }) {
  const [LoadedFunnel, setLoadedFunnel] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setLoadedFunnel(true);
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  //   console.log(data);

  return (
    <Grid
      container
      sx={{
        // border: "1px solid black",
        // display: "flex",
        // height: "50vh",
        // marginBottom: "40px",
        // justifyContent: "start",
        // width: "100vw",
        padding: "10px",
      }}
    >
      <Grid>
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "40vh",
            border: "1px solid black",
            width: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
                data={data}
                margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                startAngle={-180}
                sortByValue={true}
                innerRadius={0.75}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={4}
                arcLinkLabelsTextOffset={4}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsOffset={-24}
                arcLinkLabelsStraightLength={36}
                arcLinkLabelsThickness={0}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={6}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", "1.2"]],
                }}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                fill={[
                  {
                    match: {
                      id: "ruby",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "c",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "go",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "python",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "scala",
                    },
                    id: "lines",
                  },
                  {
                    match: {
                      id: "lisp",
                    },
                    id: "lines",
                  },
                  {
                    match: {
                      id: "elixir",
                    },
                    id: "lines",
                  },
                  {
                    match: {
                      id: "javascript",
                    },
                    id: "lines",
                  },
                ]}
                animate={false}
                // legends={[
                //   {
                //     anchor: "bottom",
                //     direction: "row",
                //     justify: false,
                //     translateX: 0,
                //     translateY: 56,
                //     itemsSpacing: 0,
                //     itemWidth: 100,
                //     itemHeight: 18,
                //     itemTextColor: "#999",
                //     itemDirection: "left-to-right",
                //     itemOpacity: 1,
                //     symbolSize: 13,
                //     symbolShape: "circle",
                //     effects: [
                //       {
                //         on: "hover",
                //         style: {
                //           itemTextColor: "#000",
                //         },
                //       },
                //     ],
                //   },
                // ]}
              />
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
