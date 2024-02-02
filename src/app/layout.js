"use client";

import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useCallback, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
// icons
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  VerifiedUser,
  Visibility,
  VisibilityOff,
  WindowSharp,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ToastContainer, toast } from "react-toastify";
import store from "../store";
import {
  useLoginUserDataMutation,
  useResetPasswordMutation,
} from "@/reduxSlice/apiSlice";
import themeFont from "../theme";
import "react-toastify/dist/ReactToastify.css";
import { usePathname, useRouter } from "next/navigation";
import { permissionKeyNames } from "../../shared/cpNamings";
import LoginBanner from "../../public/loginBanner2.png";
import { ProfileInfo } from "./components/ProfileBtn";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
// title: "Create Next App",
// description: "Generated by create next app",
// };

// drawer-size
const drawerWidth = 280;

// sidebar datas
const sidebarlist = [
  {
    title: "User Management",
    url: "usermanagement",
    insideUrl: "adduser",
    icon: PeopleAltIcon,
    shortName: permissionKeyNames?.userManagement,
  },
  {
    title: "CP Management",
    url: "cpmanagement",
    insideUrl: "addcp",
    icon: VerifiedUser,
    shortName: permissionKeyNames?.cpManagement,
  },
];
// login function
function Login() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [userData, setUserData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState(null);

  // console.log(user);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeUser = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [loginUserData] = useLoginUserDataMutation();
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoginInProgress(true);
        const result = await loginUserData(formData);
        console.log(result?.data?.result?.userData?.isFirstSignIn);

        if (result?.data?.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify(result.data.result.userData),
          );
          if (result?.data?.isFirstSignIn === true) {
            toast.success("Reset Your Password!");
          }
          const userResult = localStorage.getItem("user");
          setUser(JSON.parse(userResult));
          setLoginPassword(formData.password);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Form submission failed", error);
        toast.error("Form submission failed. Please try again.");
      } finally {
        setLoginInProgress(false);
      }
    },
    [formData, setLoginPassword, setLoginInProgress],
  );

  useEffect(() => {
    console.log(user);
    if (user?.isFirstSignIn === false) {
      window.location.href = "leads";
    }
  }, [user, userData]);

  // console.log(user);
  const [resetPassword] = useResetPasswordMutation();
  const handleSubmitPassword = useCallback(async () => {
    if (userData.newPassword !== userData.confirmPassword) {
      setIsPasswordMismatch(true);
      toast.error("Passwords do not match!");
      return;
    }
    const result = {
      newPassword: userData.confirmPassword,
      password: loginPassword,
      id: user?.id,
    };
    const finalResult = await resetPassword(result);
    if (finalResult?.data?.status === 200) {
      localStorage.setItem("user", JSON.stringify(finalResult?.data?.result));
      router.push("/leads");
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    }
    toast.success("Login Successfuly!");
    console.log(finalResult);
  }, [userData]);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <ToastContainer />
      {user?.isFirstSignIn === false || user === null ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Typography>SIGN IN TO CONTINUE</Typography>
          <Box
            width={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
              name="name"
              label="Username / Email / Phone"
              variant="outlined"
              onChange={handleInputChange}
            />
          </Box>
          <Box
            width={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              sx={{
                width: "90%",
                // padding: "5px",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            sx={{
              // border: "1px solid black",
              width: "90%",
              backgroundColor: "black",
              color: "white",
              height: "45px",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "black",
                boxShadow: "none",
                border: "none",
              },
            }}
            onClick={handleSubmit}
            disabled={loginInProgress}
          >
            {loginInProgress ? (
              <Typography sx={{ color: "gray" }}>Logging in...</Typography>
            ) : (
              <Typography sx={{ color: "white" }}>Login</Typography>
            )}
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Typography>Reset password</Typography>
          <Box
            width={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
              name="newPassword"
              type="password"
              label="password"
              value={userData.newPassword}
              variant="outlined"
              onChange={handleInputChangeUser}
            />
          </Box>
          <Box
            width={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              sx={{
                width: "90%",
                // padding: "5px",
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "19px",
                },
              }}
              name="confirmPassword"
              label="confirm password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={userData.confirmPassword}
              onChange={handleInputChangeUser}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            sx={{
              // border: "1px solid black",
              width: "90%",
              backgroundColor: "black",
              color: "white",
              height: "45px",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "black",
                boxShadow: "none",
                border: "none",
              },
            }}
            onClick={handleSubmitPassword}
            disabled={loginInProgress}
          >
            <Typography sx={{ color: "white" }}>Confirm</Typography>
          </Button>
        </Box>
      )}
    </>
  );
}

export default function RootLayout({ children }) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  // handle drawer functions
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [user, setUser] = useState(null);

  const drawer = (
    <Grid sx={{ height: "100vh", borderRight: "1px solid lightgrey" }}>
      <Grid
        sx={{
          height: "89px",
          borderBottom: "1px solid lightgrey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{
            width: "200px",
            height: "50px",
            // border: "1px solid lightgrey",
            display: "flex",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Link href="/leads">
            <Image
              priority
              src="/Logo.svg"
              alt="Logo"
              width={120}
              height={60}
            />
          </Link>
        </Grid>
      </Grid>
      <List>
        {/* <Link href="/">
<ListItem disablePadding>
<ListItemButton>
<ListItemIcon>{React.createElement(DashboardIcon)}</ListItemIcon>
<ListItemText primary="Dashboard" />
</ListItemButton>
</ListItem>
</Link> */}
        <Link href="/leads" style={{ color: "none", textDecoration: "none" }}>
          <ListItem
            disablePadding
            style={{
              textDecoration: "none",
              color: "black",
              backgroundColor:
                pathname === "/leads"
                  ? "rgba(250, 185, 0, 0.15)"
                  : "transparent",
              borderRight:
                pathname === "/leads"
                  ? "2px solid rgba(250, 185, 0, 1)"
                  : "none",
            }}
          >
            <ListItemButton>
              <ListItemIcon>{React.createElement(AssignmentIcon)}</ListItemIcon>
              <ListItemText primary="Leads list" />
            </ListItemButton>
          </ListItem>
        </Link>
        {sidebarlist
          .filter((item) => permissions.includes(item.shortName))
          .map((item) => (
            <Link
              key={item.title}
              href={`/${item.url}`}
              style={{
                textDecoration: "none",
              }}
            >
              <ListItem
                disablePadding
                style={{
                  textDecoration: "none",
                  color: "black",
                  backgroundColor:
                    pathname === `/${item.url}` ||
                    pathname === `/${item.url}/${item.insideUrl}`
                      ? "rgba(250, 185, 0, 0.15)"
                      : "transparent",
                  borderRight:
                    pathname === `/${item.url}` ||
                    pathname === `/${item.url}/${item.insideUrl}`
                      ? "2px solid rgba(250, 185, 0, 1)"
                      : "none",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                <ListItemButton
                  key={item.title}
                  sx={{
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                >
                  <ListItemIcon alt={item.title}>
                    {React.createElement(item.icon)}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
      </List>
    </Grid>
  );

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setUser(jsonData);
      setPermissions(jsonData.permissions || []);
    } else {
      setUser(null);
      console.error('No data found in local storage for key "user".');
    }
    setLoading(false);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={themeFont}>
        <SnackbarProvider maxSnack={3}>
          <html lang="en">
            <body className={inter.className}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: "white",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : user === null || user.isFirstSignIn === true ? (
                <Box
                  sx={{
                    minHeight: "100vh",
                    display: "flex",
                    // border: "1px solid black",
                    backgroundColor: "white",
                  }}
                >
                  <Grid sx={{ width: "60%", position: "relative" }}>
                    <Image
                      style={{ backgroundColor: "white" }}
                      src={LoginBanner}
                      // width="100%"
                      layout="fill"
                      objectFit="cover"
                    />
                  </Grid>
                  <Grid sx={{ width: "40%" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "20px",
                        // border: "1px solid black",
                        backgroundColor: "white",
                      }}
                    >
                      <Box
                        sx={{
                          height: "15%",
                          width: "250px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src="/Logo.svg"
                          width={300}
                          height={100}
                          style={{ objectFit: "contain" }}
                          alt="logo"
                        />
                      </Box>
                      <Box
                        sx={{
                          height: "50%",
                          width: "90%",
                        }}
                      >
                        <Login user={user} />
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ display: "flex" }}>
                  <AppBar
                    position="fixed"
                    sx={{
                      width: { sm: `calc(100% - ${drawerWidth}px)` },
                      ml: { sm: `${drawerWidth}px` },
                      backgroundColor: "white",
                      boxShadow: "none",
                      borderBottom: "1px solid lightgrey",
                      height: isLargeScreen ? "89px" : "89px",
                    }}
                  >
                    <Toolbar
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        height: isLargeScreen ? "89px" : "89px",
                      }}
                    >
                      <IconButton
                        color="black"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                      >
                        <MenuIcon />
                      </IconButton>

                      <Grid
                        sx={{
                          minWidth: "15%",
                          color: "black",
                          // borderRight: "1px solid lightgrey",
                          // borderLeft: "1px solid lightgrey",
                          height: "100%",
                          padding: 0,
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Grid
                          sx={{
                            // border: "1px solid black",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            sx={{
                              // display: "flex",
                              display: { xs: "none", sm: "flex" },
                            }}
                          >
                            <Typography variant="h6">Hello,&nbsp;</Typography>
                            <Typography variant="h6">
                              {user?.name.split(" ")[0]}
                            </Typography>
                          </Grid>
                          {/* <Typography
                            sx={{ fontSize: "10px", letterSpacing: "1px" }}
                          >
                            Welcome back!
                          </Typography> */}
                        </Grid>
                      </Grid>
                      <Grid
                        sx={{
                          minWidth: "25%",
                          color: "black",
                          height: "100%",
                          padding: 0,
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                          paddingRight: "10px",

                          // border: "1px solid black",
                        }}
                      >
                        <ProfileInfo name={user?.name} role={user?.role[0]} />
                        {/* <Grid
                          sx={{
                            minWidth: "120px",
                            heigth: "43px",
                            border: "1px solid #FAB900",
                            backgroundColor: "rgba(250, 185, 0, 0.2)",
                            borderRadius: "50px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1px",
                          }}
                        >
                          <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="profile">
                              <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: "1px" }}
                              >
                                <Avatar alt="M" src="" />
                              </IconButton>
                            </Tooltip>
                            <Menu
                              sx={{ marginTop: "30px" }}
                              id="menu-appbar"
                              anchorEl={anchorElUser}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              keepMounted
                              transformOrigin={{
                                vertical: "top",
                              }}
                              open={Boolean(anchorElUser)}
                              onClose={handleCloseUserMenu}
                              disableScrollLock
                            >
                              {settings?.map((setting) => (
                                <MenuItem
                                  key={setting}
                                  onClick={() => handleMenuClick(setting)}
                                >
                                  <Typography textAlign="center">
                                    {setting}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Menu>
                          </Box>
                          <Typography sx={{ padding: "5px" }}>
                            {user?.name}
                          </Typography>
                          <KeyboardArrowDownIcon />
                        </Grid> */}
                      </Grid>
                    </Toolbar>
                  </AppBar>
                  <Box
                    component="nav"
                    sx={{
                      width: { sm: drawerWidth },
                      flexShrink: { sm: 0 },
                      backgroundColor: "white",
                    }}
                    aria-label="mailbox folders"
                  >
                    <Drawer
                      variant="temporary"
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      ModalProps={{
                        keepMounted: true,
                      }}
                      sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                          boxSizing: "border-box",
                          width: drawerWidth,
                        },
                      }}
                    >
                      {drawer}
                    </Drawer>
                    <Drawer
                      variant="permanent"
                      sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                          boxSizing: "border-box",
                          width: drawerWidth,
                        },
                      }}
                      open
                    >
                      {drawer}
                    </Drawer>
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      flexGrow: 1,
                      width: { sm: `calc(100% - ${drawerWidth}px)` },
                      backgroundColor: "white",
                    }}
                  >
                    <Toolbar />
                    <Grid
                      sx={{
                        marginTop: "25px",
                        padding: "10px",
                        background: "#FFFCF3",
                      }}
                    >
                      {children}
                    </Grid>
                    <Grid
                      sx={{
                        // border: "1px solid black",
                        minHeight: "5vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        color: "grey",
                      }}
                    >
                      <Typography sx={{ padding: "10px", marginLeft: "10px" }}>
                        © 2024 Hyderabad CP Portal
                      </Typography>
                    </Grid>
                  </Box>
                </Box>
              )}
            </body>
          </html>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
