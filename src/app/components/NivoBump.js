"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { Box, Grid } from "@mui/material";
import "@nivo/bump/dist/nivo-bump.es";

const DynamicFunnel = lazy(() =>
  import("@nivo/bump").then((module) => ({
    default: module.ResponsiveBump,
  }))
);

export default function NivoBump({ data: initialData }) {
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
    <Grid container>
      <Grid>
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "60vh",
            marginTop: "20px",
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
                colors={{ scheme: "spectral" }}
                lineWidth={3}
                activeLineWidth={6}
                inactiveLineWidth={3}
                inactiveOpacity={0.15}
                pointSize={10}
                activePointSize={16}
                inactivePointSize={0}
                pointColor={{ theme: "background" }}
                pointBorderWidth={3}
                activePointBorderWidth={3}
                pointBorderColor={{ from: "serie.color" }}
                axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "",
                  legendPosition: "middle",
                  legendOffset: -36,
                  truncateTickAt: 0,
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "",
                  legendPosition: "middle",
                  legendOffset: 32,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "ranking",
                  legendPosition: "middle",
                  legendOffset: -40,
                  truncateTickAt: 0,
                }}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                axisRight={null}
              />
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
