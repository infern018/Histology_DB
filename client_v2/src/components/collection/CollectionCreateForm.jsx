import React from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const CollectionCreateForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 400,
        width: "100%",
        padding: 4,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "0 auto",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
        Add a new collection
      </Typography>
      <TextField
        required
        id="name"
        label="Collection Name"
        variant="filled"
        {...register("name")}
        sx={{ mb: 2, width: "100%", borderRadius: "10px" }}
        InputProps={{
          style: {
            borderRadius: "10px",
          },
          disableUnderline: true,
        }}
      />
      <TextField
        required
        id="description"
        label="Description"
        variant="filled"
        {...register("description")}
        sx={{ mb: 3, width: "100%", borderRadius: "10px" }}
        InputProps={{
          style: {
            borderRadius: "10px",
          },
          disableUnderline: true,
        }}
      />
      <Button
        variant="contained"
        type="submit"
        sx={{
          width: "100%",
          backgroundColor: "#0056b3",
          color: "#ffffff",
          borderRadius: "10px",
        }}
      >
        Add Collection
      </Button>
    </Box>
  );
};

export default CollectionCreateForm;
