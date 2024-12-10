"use client";

import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import themeFont from "../theme";

import store from "../store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeFont}>
        <SnackbarProvider maxSnack={3}>
          <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
