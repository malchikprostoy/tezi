import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Typography, Box, Alert } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("User not found or invalid token");
        } else {
          setError(err.message || "An error occurred while fetching user data");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <Alert
        sx={{ backgroundColor: "transparent", color: "#fff" }}
        color="error"
      >
        {error}
      </Alert>
    );
  }

  if (!user) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            src={`http://localhost:5000${user.photo}`}
            alt={user.name}
            sx={{ width: 50, height: 50 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {/* <Typography variant="h5" fontWeight="bold">
        {user.name}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {user.email}
      </Typography> */}
    </Box>
  );
};

export default Profile;
