import React from "react";
import Plot from "react-plotly.js";

const PlotlyChart = ({ data }) => {
	// Transform the data based on the provided transformation logic

	// ToDO check if unknown mappings are getting displayed correctly
	const transformedData = data.map((entry) => ({
		developmentalStage: entry.physiologicalInformation.age.developmentalStage || "Unknown",
		brainWeight: entry.physiologicalInformation.brainWeight || 0,
		brainPart: entry.histologicalInformation.brainPart || "Unknown",
		sectionThickness: parseInt(entry.histologicalInformation.sectionThickness, 10) || 0,
		stainingMethod: entry.histologicalInformation.stainingMethod || "Unknown",
		interSectionDistance: entry.histologicalInformation.interSectionDistance || "Unknown",
	}));

	// Print distinct values for each key
	const distinctValues = (rows, key) => [...new Set(rows.map((row) => row[key]))];

	// Function to unpack values from the transformed data
	const unpack = (rows, key) => rows.map((row) => row[key]);

	// Prepare the data for Plotly
	const plotData = [
		{
			type: "parcoords",
			pad: [80, 80, 80, 80],
			line: {
				color: unpack(transformedData, "interSectionDistance"),
				colorscale: [
					[0, "#00ccff"], // Electric blue
					[0.5, "#99ff33"], // Lime green
					[1, "#ffcc00"], // Bright yellow
				],
			},
			dimensions: [
				{
					range: [0, distinctValues(transformedData, "developmentalStage").length - 1],
					label: "Developmental Stage",
					values: unpack(transformedData, "developmentalStage").map((stage) =>
						distinctValues(transformedData, "developmentalStage").indexOf(stage)
					),
					tickvals: Array.from(
						{ length: distinctValues(transformedData, "developmentalStage").length },
						(_, i) => i
					),
					ticktext: distinctValues(transformedData, "developmentalStage"),
				},
				{
					range: [0, Math.max(...unpack(transformedData, "brainWeight")) || 1],
					label: "Brain Weight",
					values: unpack(transformedData, "brainWeight"),
				},
				{
					range: [0, distinctValues(transformedData, "brainPart").length - 1],
					label: "Brain Part",
					values: unpack(transformedData, "brainPart").map((part) =>
						distinctValues(transformedData, "brainPart").indexOf(part)
					),
					tickvals: Array.from({ length: distinctValues(transformedData, "brainPart").length }, (_, i) => i),
					ticktext: distinctValues(transformedData, "brainPart"),
				},
				{
					range: [0, Math.max(...unpack(transformedData, "sectionThickness")) || 1],
					label: "Section Thickness",
					values: unpack(transformedData, "sectionThickness"),
					thickness: 300,
				},
				{
					range: [0, distinctValues(transformedData, "stainingMethod").length - 1],
					label: "Staining Method",
					values: unpack(transformedData, "stainingMethod").map((method) =>
						distinctValues(transformedData, "stainingMethod").indexOf(method)
					),
					tickvals: Array.from(
						{ length: distinctValues(transformedData, "stainingMethod").length },
						(_, i) => i
					),
					ticktext: distinctValues(transformedData, "stainingMethod"),
				},
				{
					range: [0, distinctValues(transformedData, "interSectionDistance").length - 1],
					label: "Inter Section Distance",
					values: unpack(transformedData, "interSectionDistance").map((distance) =>
						distinctValues(transformedData, "interSectionDistance").indexOf(distance)
					),
					tickvals: Array.from(
						{ length: distinctValues(transformedData, "interSectionDistance").length },
						(_, i) => i
					),
					ticktext: distinctValues(transformedData, "interSectionDistance"),
				},
			],
		},
	];

	const layout = {
		paper_bgcolor: "#2e2e2e", // Gray background for the entire plot
		plot_bgcolor: "#2e2e2e", // Gray background for the chart area
		font: {
			color: "#ffffff", // White color for all text, including labels
			size: 17,
		},
	};

	return (
		<Plot
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "80vh",
				background: "#0f0f0f",
			}}
			layout={layout}
			data={plotData}
		/>
	);
};

export default PlotlyChart;
