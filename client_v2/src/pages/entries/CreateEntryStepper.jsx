import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, CardContent, LinearProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Import your step components
import IdentificationForm from "../../components/entries/IdentificationForm";
import ArchivalIdentificationForm from "../../components/entries/ArchivalIdentificationForm";
import PhysiologicalInformationForm from "../../components/entries/PhysiologicalInformationForm";
import HistologicalInformationForm from "../../components/entries/HistologicalInformationForm";
import Layout from "../../components/utils/Layout";

import {
  createEntryAPI,
  getEntryAPI,
  updateEntryAPI,
} from "../../utils/apiCalls";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

// Define the steps
const steps = [
  "Identification",
  "Archival Identification",
  "Physiological Information",
  "Histological Information",
];

export default function CreateEntryStepper() {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const { collectionID, entryID } = useParams();
  const isEditMode = Boolean(entryID); // Determines if it's edit mode
  const [loading, setLoading] = useState(isEditMode);

  const [error, setError] = React.useState(null);

  const [activeStep, setActiveStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState({
    identification: {},
    archivalIdentification: {},
    physiologicalInformation: {},
    histologicalInformation: {},
    collectionID: collectionID,
  });

  // Fetch entry data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchEntry = async () => {
        try {
          const response = await getEntryAPI(entryID, user.accessToken);
          setFormValues(response);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchEntry();
    }
  }, [entryID, isEditMode, user.accessToken]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFormChange = (step, data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [step]: data,
    }));
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (isEditMode) {
        response = await updateEntryAPI(entryID, formValues, user.accessToken);
      } else {
        response = await createEntryAPI(formValues, user.accessToken);
      }

      if (response.status === 200) {
        navigate(`/collection/${response.data.collectionID}/entries`);
      } else {
        setError(response.data.message || "Operation  failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Render the form component based on the active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <IdentificationForm
            values={formValues.identification}
            onChange={(data) => handleFormChange("identification", data)}
          />
        );
      case 1:
        return (
          <ArchivalIdentificationForm
            values={formValues.archivalIdentification}
            onChange={(data) =>
              handleFormChange("archivalIdentification", data)
            }
          />
        );
      case 2:
        return (
          <PhysiologicalInformationForm
            values={formValues.physiologicalInformation}
            onChange={(data) =>
              handleFormChange("physiologicalInformation", data)
            }
          />
        );
      case 3:
        return (
          <HistologicalInformationForm
            values={formValues.histologicalInformation}
            onChange={(data) =>
              handleFormChange("histologicalInformation", data)
            }
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Card
            sx={{
              backgroundColor: theme.palette.background.default,
              p: 4,
              minWidth: 300,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Loading Entry...
              </Typography>
              <LinearProgress />
            </CardContent>
          </Card>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Card
            sx={{
              backgroundColor: theme.palette.background.default,
              p: 4,
              minWidth: 300,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.error.main, mb: 2 }}
              >
                Error
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {error}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        {/* Header */}
        <Card sx={{ backgroundColor: theme.palette.background.default, mb: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{ color: theme.palette.text.primary, mb: 1 }}
            >
              {isEditMode ? "Edit Entry" : "Create New Entry"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary, mb: 3 }}
            >
              {isEditMode
                ? "Update the entry information"
                : "Fill in the details to create a new entry"}
            </Typography>

            {/* Progress Indicator */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mb: 1 }}
              >
                Step {activeStep + 1} of {steps.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(activeStep / (steps.length - 1)) * 100}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{
                "& .MuiStepLabel-label": {
                  "color": theme.palette.text.secondary,
                  "&.Mui-active": {
                    color: theme.palette.primary.main,
                  },
                  "&.Mui-completed": {
                    color: theme.palette.text.primary,
                  },
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card sx={{ backgroundColor: theme.palette.background.default }}>
          <CardContent sx={{ p: 4 }}>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ color: theme.palette.text.primary, mb: 2 }}
                  >
                    All steps completed!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary, mb: 4 }}
                  >
                    Review your information and submit the entry.
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      sx={{
                        color: theme.palette.text.secondary,
                        borderColor: theme.palette.text.secondary,
                      }}
                    >
                      Reset
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                      {isEditMode ? "Update Entry" : "Create Entry"}
                    </Button>
                  </Box>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.primary, mb: 3 }}
                >
                  {steps[activeStep]}
                </Typography>

                {renderStepContent(activeStep)}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{
                      "color": theme.palette.text.secondary,
                      "borderColor": theme.palette.text.secondary,
                      "&:disabled": {
                        color: theme.palette.text.disabled,
                        borderColor: theme.palette.text.disabled,
                      },
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="contained">
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
