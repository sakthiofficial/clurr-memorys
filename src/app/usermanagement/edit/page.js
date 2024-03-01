"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEditUserMutation,
  useGetParentsQuery,
  useGetUserByIdQuery,
} from "@/reduxSlice/apiSlice";
import { isPriorityUser } from "../../../../shared/roleManagement";
import { removeRolesFromArray } from "../../../../shared/dataHandler";

export default function Page() {
  // console.log(id);
  const params = useSearchParams();
  const id = params.get("id");
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // get user by id
  const { data, isFetching, refetch } = useGetUserByIdQuery(id);
  // console.log(data?.result?.parentId);
  // edit user query
  const [editUserData] = useEditUserMutation();
  // selected roles and projects
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(
    data?.result?.projects || []
  );
  // default user datas
  const [defaultParent, setDefaultParent] = useState();
  const [selectedParentId, setSelectedParentId] = useState(null);

  // console.log(typeof selectedRole);

  // set default project
  useEffect(() => {
    if (data?.result?.role) {
      setSelectedRole(data?.result?.role[0]);
    }
    if (data?.result?.projects) {
      setSelectedProjects(data?.result?.projects);
    }
  }, [data]);

  // get parent and set
  const ParentDetails = {
    role: typeof selectedRole === "string" ? selectedRole : selectedRole[0],
    projects: [...selectedProjects] || [],
  };

  // parent query
  const parentResult = useGetParentsQuery(ParentDetails);

  // check prior user
  const priorUser = isPriorityUser(selectedRole || []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  // console.log(formData.username);
  const [selectedValues, setSelectedValues] = useState({
    projects: [],
    role: [],
    parentId: "",
  });

  // get and data and set particular name
  useEffect(() => {
    if (data?.result?.parentId) {
      const filterParent = (parentResult?.data?.result || [])?.filter(
        (parent) => parent?._id === data?.result?.parentId
      );
      if (filterParent && filterParent.length > 0) {
        const parentName = filterParent[0]?.name;
        setDefaultParent(parentName);
      }
      // console.log("set name working");
    }
  }, [parentResult, data]);

  // set default data of all text fields
  useEffect(() => {
    if (data?.result) {
      setFormData({
        name: data.result.name || "",
        email: data.result.email || "",
        phone: data.result.phone || "",
        password: "",
      });

      setSelectedValues((prevValues) => ({
        ...prevValues,
        projects: data?.result?.projects || [],
        role: data?.result?.role || [],
      }));
    }
  }, [data]);

  useEffect(() => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      parentId: defaultParent || "",
    }));
  }, [defaultParent]);

  // console.log(defaultParent);
  // console.log(selectedValues.parentId);

  const subOrdinateRole = removeRolesFromArray(userData?.subordinateRoles);

  // console.log(selectedValues.parentId, "parentid");
  // handleinput change functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // gandle project chnage functions
  const handleChange = (name, value) => {
    if (name === "projects" && value.length === 0) {
      toast.error("Please select at least one project.");
      return;
    }
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === "role") {
      setSelectedRole(value);
    }
    if (name === "projects") {
      setSelectedProjects(value);
    }
    // console.log(selectedValues.projects);
    // if (name === "parent") {
    //   const selectedParent = parentResult?.data?.result.find(
    //     (parent) => parent.name === value,
    //   );
    //   const parentId = selectedParent?._id || null;
    //   setSelectedValues((prevValues) => ({
    //     ...prevValues,
    //     parent: parentId,
    //   }));
    // }
  };

  // console.log(ParentDetails);
  // console.log(parentResult?.data?.result);
  // console.log(selectedProjects);

  // handle submit functions
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!selectedValues.parentId && !priorUser) {
  //     toast.error("Please select at least one parent.");
  //     return;
  //   }
  //   if (!parentResult?.isSuccess || parentResult?.data?.result?.length === 0) {
  //     toast.error("No options available for parents or no parent user found.");
  //     return;
  //   }

  //   const updatedParentValues = {
  //     ...selectedValues,
  //     parentId: priorUser ? userData._id : selectedParentId,
  //     role: [selectedRole],
  //     id,
  //   };

  //   const updatedValue = {
  //     ...formData,
  //     ...updatedParentValues,
  //   };
  //   editUserData(updatedValue).then((result) => {
  //     console.log(result.data);

  //     if (result.data.status === 400) {
  //       // result.data.result.details.map((res) => toast.error(res.message));
  //       toast.error("something went wrong");
  //     }

  //     if (result.data.status === 200) {
  //       toast.success("User edit successfully!");
  //       setTimeout(() => {
  //         router.push("/usermanagement");
  //         refetch();
  //       }, 1500);
  //     }
  //   });
  //   // console.log(updatedValue);
  // };

  // handle submit functions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedValues.parentId && !priorUser) {
      toast.error("Please select at least one parent.");
      return;
    }
    if (!parentResult?.isSuccess || parentResult?.data?.result?.length === 0) {
      toast.error("No options available for parents or no parent user found.");
      return;
    }

    let updatedValue = {};

    if (isSuperAdmin) {
      updatedValue = {
        ...formData,
        ...selectedValues,
        parentId: priorUser ? userData._id : selectedParentId,
        role: [selectedRole],
        id,
      };
    } else {
      updatedValue = {
        name: formData.name,
        password: formData.password,
        ...selectedValues,
        parentId: priorUser ? userData._id : selectedParentId,
        role: [selectedRole],
        id,
      };
    }

    editUserData(updatedValue).then((result) => {
      console.log(result?.data);

      if (result.data.status === 400) {
        // result.data.result.details.map((res) => toast.error(res.message));
        toast.error("something went wrong");
      }

      if (result.data.status === 200) {
        toast.success("User edit successfully!");
        setTimeout(() => {
          router.push("/usermanagement");
          refetch();
        }, 1500);
      }
    });
  };

  // get user datas
  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const jsonData = JSON.parse(storedData);
      setUserData(jsonData);
    } else {
      console.error('No data found in local storage for key "user".');
    }
  }, []);

  useEffect(() => {
    if (userData?.role[0] === "Super Administrator") {
      setIsSuperAdmin(true);
    } else {
      setIsSuperAdmin(false);
    }
  }, [userData]);
  console.log(isSuperAdmin);
  console.log(userData?.role[0]);

  // console.log(defaultParent);

  // get parent id with parent name
  useEffect(() => {
    if (selectedValues.parentId && parentResult?.data?.result) {
      const selectedParent = parentResult?.data?.result.find(
        (parent) => parent.name === selectedValues.parentId
      );
      const retriveparentId = selectedParent?._id || null;
      setSelectedParentId(retriveparentId);
    }
  }, [selectedValues.parentId, parentResult]);
  // console.log(selectedParentId);

  return (
    <>
      <ToastContainer />

      <Grid sx={{ minHeight: "100vh", maxWidth: "1356px", margin: "0 auto" }}>
        <Grid
          sx={{
            height: "5vh",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            justifyContent: "end",
          }}
        >
          <Link href="/usermanagement">
            <Button
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
        <Grid
          sx={{
            minHeight: "581px",
            borderRadius: "29px",
            boxShadow: " 0px 6px 32px 0px rgba(0, 0, 0, 0.15)",
            border: "1px solid #9E9E9E",
            width: "100%",
          }}
        >
          <Grid
            sx={{
              height: "59px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "29px 29px 0px 0px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "18px", fontWeight: "600", padding: "20px" }}
            >
              Edit User
            </Typography>
          </Grid>
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
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  width: "100%",
                  minHeight: "500px",
                }}
              >
                {isFetching ? (
                  ""
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "640px",
                    }}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        marginBottom: "40px",
                        width: "80%",
                      }}
                    >
                      <TextField
                        label="Username"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        sx={{
                          width: "397px",
                          color: "black",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      />
                      {isSuperAdmin ? (
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          sx={{
                            width: "397px",
                            color: "black",
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderRadius: "19px",
                              },
                          }}
                        />
                      ) : (
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          // value={formData.email}
                          disabled
                          defaultValue="**********"
                          // onChange={handleInputChange}
                          sx={{
                            width: "397px",
                            color: "black",
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderRadius: "19px",
                              },
                          }}
                        />
                      )}
                      {/* <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{
                          width: "397px",
                          color: "black",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      /> */}
                    </Grid>

                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        marginBottom: "40px",
                        width: "80%",
                      }}
                    >
                      {isSuperAdmin ? (
                        <TextField
                          label="Phone"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleInputChange}
                          sx={{
                            width: "397px",
                            color: "black",
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderRadius: "19px",
                              },
                          }}
                        />
                      ) : (
                        <TextField
                          label="Phone"
                          name="phone"
                          type="text"
                          disabled
                          defaultValue="**********"
                          // value={formData.phone}
                          // onChange={handleInputChange}
                          sx={{
                            width: "397px",
                            color: "black",
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderRadius: "19px",
                              },
                          }}
                        />
                      )}
                      {/* <TextField
                        label="Phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        sx={{
                          width: "397px",
                          color: "black",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      /> */}
                      <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        sx={{
                          width: "397px",
                          color: "black",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      />
                    </Grid>

                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        width: "80%",
                        // marginBottom: "40px",
                      }}
                    />

                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        width: "80%",
                        marginBottom: "40px",
                      }}
                    >
                      <FormControl
                        sx={{
                          minWidth: "397px",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      >
                        <InputLabel
                          id="parent-label"
                          sx={{ color: "#757575", fontSize: "14px" }}
                        >
                          Choose one role
                        </InputLabel>
                        <Select
                          labelId="parent-label"
                          id="parent"
                          name="role"
                          displayEmpty
                          value={selectedValues.role}
                          label="Choose one role"
                          onChange={(e) => handleChange("role", e.target.value)}
                          MenuProps={{ disableScrollLock: true }}
                        >
                          {(subOrdinateRole || []).map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {priorUser ? (
                        ""
                      ) : (
                        <FormControl
                          sx={{
                            width: "397px",
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderRadius: "19px",
                              },
                          }}
                        >
                          <InputLabel id="demo-projects-label">
                            project
                          </InputLabel>

                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            name="projects"
                            multiple
                            value={selectedValues.projects}
                            onChange={(e) =>
                              handleChange("projects", e.target.value)
                            }
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="project"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected?.map((value) => (
                                  <Chip
                                    sx={{
                                      backgroundColor:
                                        "rgba(250, 185, 0, 0.28)",
                                      borderRadius: "10px",
                                    }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={{ disableScrollLock: true }}
                          >
                            {userData?.projects?.map((p) => (
                              <MenuItem
                                key={p}
                                value={p}
                                sx={{
                                  "&.Mui-selected": {
                                    backgroundColor: "white",
                                    color: "orange",
                                    fontWeight: "800",
                                  },
                                }}
                              >
                                {p}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                    {priorUser ? (
                      ""
                    ) : (
                      // <FormControl
                      //   sx={{
                      //     minWidth: "397px",
                      //     "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      //       {
                      //         borderRadius: "19px",
                      //       },
                      //   }}
                      // >
                      //   <InputLabel
                      //     id="parent-label"
                      //     sx={{ color: "#757575", fontSize: "14px" }}
                      //   >
                      //     Choose one parent
                      //   </InputLabel>
                      //   <Select
                      //     labelId="parent-label"
                      //     id="parent"
                      //     name="parent"
                      //     displayEmpty
                      //     value={selectedValues.parent}
                      //     label="Choose one parent"
                      //     onChange={(e) => handleChange("parent", e.target.value)}
                      //     MenuProps={{ disableScrollLock: true }}
                      //   >
                      //     {parentResult?.data?.result.map((parent, index) => (
                      //       <MenuItem key={index} value={parent.name}>
                      //         {parent.name}
                      //       </MenuItem>
                      //     ))}
                      //   </Select>
                      // </FormControl>
                      <FormControl
                        sx={{
                          minWidth: "397px",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderRadius: "19px",
                            },
                        }}
                      >
                        {parentResult?.isSuccess &&
                          parentResult?.data?.result?.length > 0 && (
                            <InputLabel
                              id="parent-label"
                              sx={{ color: "#757575", fontSize: "14px" }}
                            >
                              Select Parent
                            </InputLabel>
                          )}
                        {parentResult?.isSuccess ? (
                          parentResult?.data?.result?.length > 0 ? (
                            <Select
                              labelId="parent-label"
                              id="parentId"
                              name="parentId"
                              displayEmpty
                              value={selectedValues?.parentId}
                              label="select parent"
                              onChange={(e) =>
                                handleChange("parentId", e.target.value)
                              }
                              MenuProps={{ disableScrollLock: true }}
                            >
                              {parentResult?.data?.result?.map(
                                (option, index) => (
                                  <MenuItem key={index} value={option.name}>
                                    {option?.name}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          ) : (
                            <FormControl
                              disabled
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderRadius: "19px",
                                  },
                              }}
                            >
                              <InputLabel
                                id="parent-label"
                                sx={{
                                  color: "#757575",
                                  fontSize: "14px",
                                }}
                              >
                                No options available for parents
                              </InputLabel>
                              <Select
                                labelId="parent-label"
                                id="parentId"
                                value=""
                                displayEmpty
                                disabled
                                MenuProps={{ disableScrollLock: true }}
                              />
                            </FormControl>
                          )
                        ) : (
                          <FormControl
                            disabled
                            sx={{
                              width: "100%",
                              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                {
                                  borderRadius: "19px",
                                },
                            }}
                          >
                            <InputLabel
                              id="parent-label"
                              sx={{
                                color: "red",
                                fontSize: "14px",
                                textAlign: "center",
                                letterSpacing: "1px",
                              }}
                              style={{ color: "red" }}
                            >
                              No Parent User Found!
                            </InputLabel>
                            <Select
                              labelId="parent-label"
                              id="parentId"
                              value=""
                              displayEmpty
                              disabled
                              MenuProps={{ disableScrollLock: true }}
                            />
                          </FormControl>
                        )}
                      </FormControl>
                    )}

                    <Grid sx={{ marginTop: "40px" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          marginLeft: "20px",
                          width: "145px",
                          backgroundColor: "#F9B800",
                          color: "black",
                          height: "43px",
                          borderRadius: "12px",
                          boxShadow: "none",
                          border: "none",
                          "&:hover": {
                            backgroundColor: "#F9B800",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Update
                      </Button>
                    </Grid>
                  </form>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}
