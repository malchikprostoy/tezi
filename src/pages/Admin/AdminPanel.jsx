import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  Avatar,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminLayout from "./AdminLayout"; // импорт layout

const roles = ["student", "teacher", "admin"];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Вы уверены, что хотите удалить пользователя?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при смене роли:", error);
    }
  };

  const columns = [
    {
      field: "photo",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <Avatar src={params.value} alt="avatar" />
        ) : (
          <Avatar>{params.row.name?.[0]}</Avatar>
        ),
      sortable: false,
      filterable: false,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Tooltip title="Email подтверждён">
            <CheckCircleIcon color="success" />
          </Tooltip>
        ) : (
          <Tooltip title="Email не подтверждён">
            <CancelIcon color="error" />
          </Tooltip>
        ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => changeUserRole(params.row._id, e.target.value)}
          size="small"
          sx={{ fontSize: 14 }}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          color="error"
          variant="contained"
          size="small"
          onClick={() => deleteUser(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Typography variant="h5" sx={{ mb: 2 }}>
        👥 Управление пользователями
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminPanel;
