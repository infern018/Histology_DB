import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const ValidationReportDialog = ({ open, onClose, collection }) => {
  if (!collection || !collection.validationReport) {
    return null;
  }

  const report = collection.validationReport;

  const getValidationSummary = () => {
    const brainPartsValid =
      report.validationResults.brainParts.standardized.length;
    const brainPartsInvalid =
      report.validationResults.brainParts.nonStandardized.length;
    const stainingValid =
      report.validationResults.stainingMethods.standardized.length;
    const stainingInvalid =
      report.validationResults.stainingMethods.nonStandardized.length;
    const totalIssues = report.issues.length;

    return {
      brainPartsValid,
      brainPartsInvalid,
      stainingValid,
      stainingInvalid,
      totalIssues,
      overallScore: Math.round(
        ((brainPartsValid + stainingValid) /
          (brainPartsValid +
            brainPartsInvalid +
            stainingValid +
            stainingInvalid)) *
          100
      ),
    };
  };

  const summary = getValidationSummary();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
        className: "admin-panel-paper",
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">
            Validation Report: {collection.name}
          </Typography>
          <Chip
            label={`${summary.overallScore}% Standardized`}
            color={
              summary.overallScore >= 90
                ? "success"
                : summary.overallScore >= 70
                ? "warning"
                : "error"
            }
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card className="admin-metrics-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Collection Overview
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Total Entries:</Typography>
                  <Typography fontWeight="bold">
                    {report.totalEntries}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Total Issues:</Typography>
                  <Typography
                    fontWeight="bold"
                    color={
                      summary.totalIssues > 0 ? "error.main" : "success.main"
                    }
                  >
                    {summary.totalIssues}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Standardization Score:</Typography>
                  <Typography
                    fontWeight="bold"
                    color={
                      summary.overallScore >= 70 ? "success.main" : "error.main"
                    }
                  >
                    {summary.overallScore}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Card className="admin-metrics-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Validation Status
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography>Ready for Publication</Typography>
                  <Typography fontWeight="bold">
                    {summary.totalIssues === 0 && summary.overallScore >= 90
                      ? "Yes"
                      : "No"}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <WarningIcon color="warning" fontSize="small" />
                  <Typography>Requires Attention</Typography>
                  <Typography fontWeight="bold">
                    {summary.totalIssues > 0 || summary.overallScore < 70
                      ? "Yes"
                      : "No"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>

        {/* Issues Section */}
        {report.issues.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="h6">
                  Critical Issues ({report.issues.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="error" sx={{ mb: 2 }}>
                These issues must be resolved before publication
              </Alert>
              <List>
                {report.issues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={issue}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Brain Parts Validation */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">Brain Parts Validation</Typography>
              <Chip
                size="small"
                label={`${summary.brainPartsValid} standardized, ${summary.brainPartsInvalid} non-standardized`}
                color={summary.brainPartsInvalid === 0 ? "success" : "warning"}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  color="success.main"
                  gutterBottom
                >
                  ✓ Standardized Brain Parts ({summary.brainPartsValid})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {report.validationResults.brainParts.standardized.map(
                    (part, index) => (
                      <Chip
                        key={index}
                        label={part}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  color="warning.main"
                  gutterBottom
                >
                  ⚠ Non-standardized Brain Parts ({summary.brainPartsInvalid})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {report.validationResults.brainParts.nonStandardized.map(
                    (part, index) => (
                      <Chip
                        key={index}
                        label={part}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Staining Methods Validation */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">Staining Methods Validation</Typography>
              <Chip
                size="small"
                label={`${summary.stainingValid} standardized, ${summary.stainingInvalid} non-standardized`}
                color={summary.stainingInvalid === 0 ? "success" : "warning"}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  color="success.main"
                  gutterBottom
                >
                  ✓ Standardized Staining Methods ({summary.stainingValid})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {report.validationResults.stainingMethods.standardized.map(
                    (method, index) => (
                      <Chip
                        key={index}
                        label={method}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  color="warning.main"
                  gutterBottom
                >
                  ⚠ Non-standardized Staining Methods ({summary.stainingInvalid}
                  )
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {report.validationResults.stainingMethods.nonStandardized.map(
                    (method, index) => (
                      <Chip
                        key={index}
                        label={method}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Recommendations */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recommendations for Publication:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {summary.totalIssues > 0 && (
              <li>Address all critical issues listed above</li>
            )}
            {summary.brainPartsInvalid > 0 && (
              <li>
                Consider standardizing non-standardized brain part terminology
              </li>
            )}
            {summary.stainingInvalid > 0 && (
              <li>
                Consider standardizing non-standardized staining method
                terminology
              </li>
            )}
            {summary.overallScore < 70 && (
              <li>
                Improve overall standardization to at least 70% before
                publication
              </li>
            )}
          </ul>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationReportDialog;
