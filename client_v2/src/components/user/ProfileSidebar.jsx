import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Person, Storage, Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/reducers/authSlice";

const ProfileSidebar = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems = [
    { id: "profile", label: "Profile", icon: Person },
    { id: "mydata", label: "My Data", icon: Storage },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setLogoutDialogOpen(false);
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          width: "15rem",
          height: "fit-content",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "0.5rem",
          boxShadow: `0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)`,
          overflow: "hidden",
        }}
      >
        <List sx={{ padding: 0 }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => onTabChange(item.id)}
                  sx={{
                    "padding": "0.75rem 1rem",
                    "backgroundColor": isActive
                      ? theme.palette.action.selected
                      : "transparent",
                    "borderLeft": isActive
                      ? `0.25rem solid ${theme.palette.primary.main}`
                      : "0.25rem solid transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "transition": "all 0.2s ease-in-out",
                  }}
                >
                  <IconComponent
                    sx={{
                      marginRight: "0.75rem",
                      fontSize: "1.25rem",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  />
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Logout Button Section */}
        <Divider sx={{ margin: "0.5rem 0" }} />
        <Box sx={{ padding: "0.75rem 1rem" }}>
          <Button
            onClick={() => setLogoutDialogOpen(true)}
            startIcon={<Logout />}
            size="small"
            fullWidth
            sx={{
              fontWeight: 500,
              justifyContent: "flex-start",
              paddingLeft: "1rem",
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
        >
          <DialogTitle
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            Leaving so soon...
          </DialogTitle>
          <DialogContent sx={{ bgcolor: theme.palette.background.paper }}>
            <Typography sx={{ color: theme.palette.text.primary }}>
              Are you sure you want to log out? Any unsaved changes may be lost.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
            <Button
              onClick={() => setLogoutDialogOpen(false)}
              sx={{ color: theme.palette.text.secondary }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              sx={{ color: theme.palette.error.main }}
            >
              Yes, Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ProfileSidebar;
