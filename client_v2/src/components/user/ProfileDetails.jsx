import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Person, Email, CalendarToday } from "@mui/icons-material";

const ProfileDetails = ({ userInfo, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20rem",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  const profileItems = [
    {
      icon: Person,
      label: "Username",
      value: userInfo.username,
    },
    {
      icon: Email,
      label: "Email",
      value: userInfo.email,
    },
    {
      icon: CalendarToday,
      label: "Member Since",
      value: userInfo.createdAt,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: theme.palette.text.primary,
        }}
      >
        Profile Information
      </Typography>

      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "0.75rem",
          boxShadow: `0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)`,
          border: `0.0625rem solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          {/* Profile Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {profileItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 0",
                    borderBottom:
                      index < profileItems.length - 1
                        ? `0.0625rem solid ${theme.palette.divider}`
                        : "none",
                  }}
                >
                  <IconComponent
                    sx={{
                      marginRight: "1rem",
                      fontSize: "1.25rem",
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 400,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileDetails;
