import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Import your step components
import IdentificationForm from "../../components/entries/IdentificationForm";
import ArchivalIdentificationForm from "../../components/entries/ArchivalIdentificationForm";
import PhysiologicalInformationForm from "../../components/entries/PhysiologicalInformationForm";
import HistologicalInformationForm from "../../components/entries/HistologicalInformationForm";
import Layout from "../../components/utils/Layout";

import { createEntryAPI, getEntryAPI, updateEntryAPI } from "../../utils/apiCalls";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

// Define the steps
const steps = ["Identification", "Archival Identification", "Physiological Information", "Histological Information"];

export default function CreateEntryStepper() {
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
						onChange={(data) => handleFormChange("archivalIdentification", data)}
					/>
				);
			case 2:
				return (
					<PhysiologicalInformationForm
						values={formValues.physiologicalInformation}
						onChange={(data) => handleFormChange("physiologicalInformation", data)}
					/>
				);
			case 3:
				return (
					<HistologicalInformationForm
						values={formValues.histologicalInformation}
						onChange={(data) => handleFormChange("histologicalInformation", data)}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Layout>
			{loading && <p>Loading...</p>}
			{error && <p>{error}</p>}
			<Box sx={{ width: "100%", backgroundColor: "#f0f0f0", padding: 5 }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{activeStep === steps.length ? (
					<React.Fragment>
						<Typography sx={{ mt: 2, mb: 1, color: "#0f0f0f" }}>
							All steps completed - you're good to go!
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
							<Button onClick={handleReset}>Reset</Button>
							<Button onClick={handleSubmit}>Submit</Button>
						</Box>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Typography sx={{ mt: 2, mb: 1, color: "#0f0f0f" }}>Step {activeStep + 1}</Typography>
						{renderStepContent(activeStep)}
						<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
							<Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
								Back
							</Button>
							<Box sx={{ flex: "1 1 auto" }} />
							<Button onClick={handleNext}>{activeStep === steps.length - 1 ? "Finish" : "Next"}</Button>
						</Box>
					</React.Fragment>
				)}
			</Box>
		</Layout>
	);
}
