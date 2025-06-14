import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomTextField from "../mui/CustomTextField";

const CollectionEditForm = ({ collection, onSubmit }) => {
  const theme = useTheme();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (collection) {
      setValue("name", collection.name || "");
      setValue("description", collection.description || "");
      setValue("contact.name", collection.contact?.name || "");
      setValue("contact.email", collection.contact?.email || "");
      setValue("contact.phone", collection.contact?.phone || "");
      setValue("contact.doi", collection.contact?.doi || "");
    }
  }, [collection, setValue]);

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
              {collection ? "Edit Collection" : "New Collection"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              {collection
                ? "Update your collection details"
                : "Create a new collection to organize your data"}
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

            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  marginBottom: "1rem",
                }}
              >
                Contact Information
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <CustomTextField
                  required
                  id="contact-name"
                  label="Contact Name"
                  {...register("contact.name")}
                />

                <CustomTextField
                  required
                  id="contact-email"
                  label="Contact Email"
                  type="email"
                  {...register("contact.email")}
                />

                <CustomTextField
                  id="contact-phone"
                  label="Contact Phone"
                  {...register("contact.phone")}
                />

                <CustomTextField
                  required
                  id="contact-doi"
                  label="Contact DOI"
                  {...register("contact.doi")}
                />
              </Box>
            </Box>

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
                "marginTop": "1rem",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {collection ? "Save Changes" : "Create Collection"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollectionEditForm;
