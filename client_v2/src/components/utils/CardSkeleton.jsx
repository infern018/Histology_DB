import React from "react";
import { Skeleton, Card, CardContent, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "75%", mx: "auto", p: 3 }}>
      <Card
        sx={{
          backgroundColor: theme.palette.background.default,
          mb: 3,
        }}
      >
        <CardContent>
          <Skeleton
            variant="text"
            height={40}
            sx={{
              backgroundColor: theme.palette.action.hover,
              mb: 2,
            }}
          />
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1,
              mb: 2,
            }}
          />
          <Skeleton
            variant="text"
            height={20}
            sx={{
              backgroundColor: theme.palette.action.hover,
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            height={20}
            width="80%"
            sx={{
              backgroundColor: theme.palette.action.hover,
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardSkeleton;
