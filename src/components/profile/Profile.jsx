import React, { useEffect, useState } from "react";
import { useAuth } from "../../features/AuthContext"; // Используем AuthContext
import {
  Avatar,
  Box,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { user, loading, logout } = useAuth(); // Получаем данные из контекста
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <CircularProgress color="inherit" />;
  }

  if (!user) {
    return (
      <Alert
        sx={{ backgroundColor: "transparent", color: "#fff" }}
        color="error"
      >
        {t("User not found or unauthorized")}
      </Alert>
    );
  }

  const cachedPhoto = localStorage.getItem("userPhoto");
  const profilePhoto = user?.photo?.startsWith("http")
    ? user.photo
    : cachedPhoto || `http://localhost:5000${user.photo}`;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Tooltip title={t("Account settings")}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            src={profilePhoto}
            alt={user.name}
            sx={{ width: 50, height: 50 }}
            imgProps={{ referrerPolicy: "no-referrer" }}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("Logout")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
