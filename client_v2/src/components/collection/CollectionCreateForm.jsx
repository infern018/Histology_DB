import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomTextField from "../mui/CustomTextField";

const CollectionCreateForm = ({ onSubmit }) => {
  const theme = useTheme();
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          width: "32rem",

          backgroundColor: theme.palette.background.paper,
          borderRadius: "0.75rem",

          border: `0.0625rem solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ padding: "2.5rem" }}>
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              New Collection
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              Create a new collection to organize your data
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
            noValidate
            autoComplete="off"
          >
            <CustomTextField
              required
              id="name"
              label="Collection Name"
              {...register("name")}
            />

            <CustomTextField
              required
              id="description"
              label="Description"
              multiline
              rows={3}
              {...register("description")}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                "backgroundColor": theme.palette.primary.main,
                "color": theme.palette.primary.contrastText,
                "fontWeight": 600,
                "borderRadius": "0.5rem",
                "padding": "0.75rem",
                "textTransform": "none",
                "fontSize": "1rem",
                "marginTop": "0.5rem",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Create Collection
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollectionCreateForm;
