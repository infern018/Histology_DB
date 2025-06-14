import React from "react";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import theme, { COLORS } from "../../theme";

const TableSkeleton = () => {
  const rows = 10; // Number of skeleton rows
  const columns = 8; // Adjust based on your table's column count
  const backgroundColor = theme.palette.background.default;
  const contentColor = theme.palette.background.light; // Slightly lighter than the background
  const tableRowHeight = 65;
  const tableHeaderRowHeight = 52;

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor,
        overflow: "hidden",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: COLORS.neutral800,
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              height: tableHeaderRowHeight,
              backgroundColor: backgroundColor,
            }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton
                  variant="text"
                  sx={{ backgroundColor: contentColor }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ height: tableRowHeight, backgroundColor: backgroundColor }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    variant="text"
                    sx={{ backgroundColor: contentColor }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
