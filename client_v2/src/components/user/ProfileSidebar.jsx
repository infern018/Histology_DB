import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Person, Storage } from "@mui/icons-material";

const ProfileSidebar = ({ activeTab, onTabChange }) => {
  const theme = useTheme();

  const menuItems = [
    { id: "profile", label: "Profile", icon: Person },
    { id: "mydata", label: "My Data", icon: Storage },
  ];

  return (
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
                    fontSize: "0.875rem",
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
    </Box>
  );
};

export default ProfileSidebar;
