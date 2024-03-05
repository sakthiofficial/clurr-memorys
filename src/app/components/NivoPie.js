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

  const colors = ["#235de6", "#49c9c9", "#a6bff5", "#dce5e9"];

  // Reorder data array to have more value legends come first
  const reorderedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Grid container sx={{ width: "100vw", padding: "15px" }}>
      <Typography sx={{ padding: "0px", color: "gray", fontWeight: "midbold" }}>
        Top Contribution
      </Typography>
      <Grid sx={{ width: "100%" }}>
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={12}
          sx={{
            height: "50vh",
            // border: "1px solid black",
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
                data={reorderedData}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                startAngle={-20}
                endAngle={360}
                sortByValue={true}
                innerRadius={0.7}
                colors={colors}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={4}
                arcLinkLabelsTextOffset={4}
                arcLinkLabelsOffset={-24}
                arcLinkLabelsStraightLength={36}
                arcLinkLabelsThickness={0}
                arcLabelsSkipAngle={6}
                padAngle={1}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "row",
                    justify: false,
                    translateX: 60,
                    translateY: 55,
                    itemWidth: 100,
                    itemHeight: 50,
                    itemsSpacing: 0,
                    symbolSize: 15,
                    symbolShape: "circle",
                    itemDirection: "left-to-right",
                    style: { fontWeight: "bold" },
                  },
                ]}
              />
            </Suspense>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
