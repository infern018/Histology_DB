import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Add } from "@mui/icons-material";
import CollectionTable from "./CollectionsTable";

const MyDataTab = ({ collections, loading }) => {
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
          Loading collections...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          My Collections
          <Typography
            component="span"
            variant="body2"
            sx={{
              marginLeft: "0.5rem",
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
          >
            ({collections.length})
          </Typography>
        </Typography>

        <Button
          component={Link}
          to="/collection/create"
          variant="contained"
          startIcon={<Add />}
          sx={{
            "backgroundColor": theme.palette.primary.main,
            "color": theme.palette.primary.contrastText,
            "fontWeight": 500,
            "borderRadius": "0.5rem",
            "padding": "0.5rem 1.25rem",
            "textTransform": "none",
            "boxShadow": `0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)`,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 0.25rem 0.5rem rgba(0, 0, 0, 0.15)`,
            },
          }}
        >
          Add Collection
        </Button>
      </Box>

      {/* Collections Table */}
      {collections.length === 0 ? (
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "0.75rem",
            boxShadow: `0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)`,
            border: `0.0625rem solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ padding: "3rem 2rem" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  marginBottom: "0.5rem",
                }}
              >
                No Collections Yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  marginBottom: "1.5rem",
                }}
              >
                Create your first collection to get started
              </Typography>
              <Button
                component={Link}
                to="/collection/create"
                variant="outlined"
                startIcon={<Add />}
                sx={{
                  "borderColor": theme.palette.primary.main,
                  "color": theme.palette.primary.main,
                  "borderRadius": "0.5rem",
                  "padding": "0.5rem 1.25rem",
                  "textTransform": "none",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.dark,
                  },
                }}
              >
                Create Collection
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <CollectionTable collections={collections} />
      )}
    </Box>
  );
};

export default MyDataTab;
