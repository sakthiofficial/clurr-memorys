"use client";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReplayIcon from "@mui/icons-material/Replay";
import { ToastContainer, toast } from "react-toastify";
import {
  useEditUserMutation,
  useRetriveCpByCompanyQuery,
} from "@/reduxSlice/apiSlice";
import { unixToDate } from "../../../../shared/dateCalc";
import CpEditRmDialogBox from "../../components/CpEditRmDialog";
import CpEditDialog from "../../components/CpEditDialog";
import CpEditExecuteDialog from "../../components/CpEditExecuteDialog";
import AddExecuteAccount from "@/app/components/AddExecuteAccount";

export default function Page() {
  const params = useSearchParams();
  const [loggedInRole, setLoggedInRole] = useState([]);
  const id = params.get("id");
  // get data query
  const { data, isFetching, refetch } = useRetriveCpByCompanyQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [isRestPassword, setIsRestPassword] = useState(false);
  const [isRestPasswordExecute, setIsRestPasswordExecute] = useState(false);

  // console.log(data?.result);
  const [resetPassword] = useEditUserMutation();
  const handleExecuteReset = async (executeData) => {
    const updatedReset = {
      id: executeData[0]?._id,
      password: "Pass@123",
      role: executeData[0]?.role,
    };
    // console.log(updatedReset);
    const resultExecute = await resetPassword(updatedReset);
    if (resultExecute?.data?.status === 200) {
      setIsRestPasswordExecute(true);
    }
  };

  const handleBranchHeadReset = async (branchHeadData) => {
    const updatedReset = {
      id: branchHeadData?._id,
      password: "Pass@123",
      role: branchHeadData?.role,
    };
    const resultBranchHead = await resetPassword(updatedReset);
    if (resultBranchHead?.data?.status === 200) {
      setIsRestPassword(true);
    }
  };

  // useEffect(() => {
  //   if (isRestPassword === true) {
  //     toast.success("Successfully Reseted");
  //     console.log("one");
  //   }
  // }, [isRestPassword, isRestPasswordExecute]);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setLoggedInRole(jsonData?.role || []);
    }
  }, []);
  // console.log(loggedInRole);
  return (
    <>
      <ToastContainer />
      <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
        {isFetching ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {loggedInRole[0] === "CP Branch Head" ? null : (
              <Grid
                sx={{
                  height: "5vh",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <Link href="/cpmanagement">
                  <Button
                    type="button"
                    sx={{
                      backgroundColor: "transparent",
                      color: "black",
                      width: "92px",
                      height: "39px",
                      borderRadius: "13px",
                      border: "1px solid black",
                      fontSize: "13px",
                      fontWeight: "400",
                      "&:hover": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                  >
                    back
                  </Button>
                </Link>
              </Grid>
            )}
            <Grid
              sx={{
                border: "1px solid lightgrey",
                minheight: "20vh",
                borderRadius: "30px",
                marginBottom: "20px",
              }}
            >
              <Grid
                sx={{
                  height: "10vh",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#021522",
                  borderRadius: "30px 30px 0px 0px",
                  justifyContent: "space-between",
                  padding: " 0px 30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  Channel Parnter Details
                </Typography>
                {loggedInRole[0] === "CP Branch Head" ? null : (
                  <CpEditRmDialogBox data={data} id={id} refetch={refetch} />
                )}
              </Grid>
              <Grid
                sx={{
                  height: "13vh",
                  display: "flex",
                  alignItems: "center",
                  padding: " 0px 30px",
                  width: "80%",
                  justifyContent: "space-between",
                  fontSize: "10px",
                }}
              >
                <Grid sx={{ display: "flex" }}>
                  <Typography
                    sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                  >
                    Company -
                  </Typography>
                  &nbsp;&nbsp;&nbsp;
                  <Typography sx={{ fontSize: "12px" }}>
                    {data?.result?.company?.name}
                  </Typography>
                </Grid>
                <Grid sx={{ display: "flex" }}>
                  <Typography
                    sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                  >
                    CP Code -
                  </Typography>
                  &nbsp;&nbsp;&nbsp;
                  <Typography sx={{ fontSize: "12px" }}>
                    {data?.result?.company?.cpCode}
                  </Typography>
                </Grid>
                <Grid sx={{ display: "flex" }}>
                  <Typography
                    sx={{ color: "rgba(58, 53, 65, 0.68)", fontSize: "12px" }}
                  >
                    Assigned Under -
                  </Typography>
                  &nbsp;&nbsp;&nbsp;
                  <Typography sx={{ fontSize: "12px" }}>
                    {data?.result?.cpRm?.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              sx={{
                border: "1px solid lightgrey",
                minheight: "20vh",
                borderRadius: "30px",
                marginBottom: "20px",
                overflow: "hidden",
              }}
            >
              <Grid
                sx={{
                  height: "10vh",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#021522",
                  borderRadius: "30px 30px 0px 0px",
                  justifyContent: "space-between",
                  padding: " 0px 30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  Number of Accounts Created
                </Typography>
                {data?.result?.cpExecutes?.length === 0 && (
                  <AddExecuteAccount data={data} refetch={refetch} />
                )}
              </Grid>
              <Table>
                <TableHead>
                  <TableRow
                    style={{
                      backgroundColor: "rgba(249, 184, 0, 0.1)",
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    <TableCell sx={{ fontSize: "12px" }}>NAME</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>CONTACT</TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>USERNAME </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      IS PRIMARY ACCOUNT
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>JOINED DATE</TableCell>
                    {loggedInRole[0] === "CP Branch Head" ? null : (
                      <>
                        <TableCell sx={{ fontSize: "12px" }}>EDIT</TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>
                          RESET PASSWORD
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {data?.result?.cpBranchHead?.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {data?.result?.cpBranchHead?.phone || "N/A"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {data?.result?.cpBranchHead?.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      <Switch checked />
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {unixToDate(data?.result?.cpBranchHead?.created || "N/A")}
                    </TableCell>
                    {loggedInRole[0] === "CP Branch Head" ? null : (
                      <>
                        <TableCell sx={{ fontSize: "12px" }}>
                          <CpEditDialog
                            data={data?.result?.cpBranchHead || "N/A"}
                            refetch={refetch}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>
                          {isRestPassword ? (
                            <Typography
                              sx={{ fontSize: "12px", color: "green" }}
                            >
                              Reset Done
                            </Typography>
                          ) : (
                            <ReplayIcon
                              sx={{ fontSize: "20px", cursor: "pointer" }}
                              onClick={() =>
                                handleBranchHeadReset(
                                  data?.result?.cpBranchHead,
                                )
                              }
                            />
                          )}
                        </TableCell>
                      </>
                    )}
                  </TableRow>

                  {(data?.result?.cpExecutes || []).map((cpExecute) => (
                    <TableRow key={cpExecute.name}>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {cpExecute?.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {cpExecute?.phone}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {cpExecute?.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        <Switch checked={false} />
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        {unixToDate(cpExecute?.created)}
                      </TableCell>
                      {loggedInRole[0] === "CP Branch Head" ? null : (
                        <>
                          <TableCell sx={{ fontSize: "12px" }}>
                            <CpEditExecuteDialog
                              data={data?.result?.cpExecutes}
                              refetch={refetch}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {isRestPasswordExecute ? (
                              <Typography
                                sx={{ fontSize: "12px", color: "green" }}
                              >
                                Reset Done
                              </Typography>
                            ) : (
                              <ReplayIcon
                                sx={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleExecuteReset(data?.result?.cpExecutes)
                                }
                              />
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </>
        )}
        <Grid />
      </Grid>
    </>
  );
}
