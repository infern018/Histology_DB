import React from "react";
import Plot from "react-plotly.js";
import { Box } from "@mui/material";
import { COLORS } from "../../theme";

const PlotlyChart = ({ data }) => {
  // Enhanced data transformation with proper null handling
  const transformedData = data.map((entry, index) => ({
    originalIndex: index,
    originalEntry: entry,
    order: entry.identification?.order || "Unknown",
    brainWeight: entry.physiologicalInformation?.brainWeight || 0,
    bodyWeight: entry.physiologicalInformation?.bodyWeight || 0,
    brainPart: entry.histologicalInformation?.brainPart || "Unknown",
    sectionThickness:
      parseInt(entry.histologicalInformation?.sectionThickness, 10) || 0,
    stainingMethod: entry.histologicalInformation?.stainingMethod || "Unknown",
    interSectionDistance:
      entry.histologicalInformation?.interSectionDistance || "Unknown",
    sex: entry.physiologicalInformation?.sex || "Unknown",
    speciesName: entry.identification?.bionomialSpeciesName || "Unknown",
  }));

  // Utility functions
  const distinctValues = (rows, key) => {
    const values = [...new Set(rows.map((row) => row[key]))];
    return values.sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return a.toString().localeCompare(b.toString());
    });
  };

  const unpack = (rows, key) => rows.map((row) => row[key]);

  // Create categorical mappings for string values
  const createCategoricalMapping = (rows, key) => {
    const distinctVals = distinctValues(rows, key);
    const mapping = {};
    distinctVals.forEach((val, index) => {
      mapping[val] = index;
    });
    return { mapping, distinctVals };
  };

  // Get mappings for categorical data
  const orderMapping = createCategoricalMapping(transformedData, "order");
  const brainPartMapping = createCategoricalMapping(
    transformedData,
    "brainPart"
  );
  const stainingMapping = createCategoricalMapping(
    transformedData,
    "stainingMethod"
  );
  const sexMapping = createCategoricalMapping(transformedData, "sex");

  // Prepare the data for Plotly with modern theme colors
  const plotData = [
    {
      type: "parcoords",
      pad: [150, 80, 80, 80],
      line: {
        color: unpack(transformedData, "brainWeight"),
        colorscale: [
          [0, "#3B82F6"], // Blue
          [0.25, "#10B981"], // Green
          [0.5, "#F59E0B"], // Yellow
          [0.75, "#EF4444"], // Red
          [1, "#8B5CF6"], // Purple
        ],
        showscale: true,
        colorbar: {
          title: {
            text: "Brain Weight (g)",
            font: { color: COLORS.textPrimary, size: 16 },
          },
          titlefont: { color: COLORS.textPrimary, size: 16 },
          tickfont: { color: COLORS.textPrimary, size: 14 },
          bgcolor: COLORS.backgroundPaper,
          bordercolor: COLORS.divider,
          borderwidth: 1,
          thickness: 20,
          len: 0.8,
        },
      },
      dimensions: [
        {
          range: [0, orderMapping.distinctVals.length - 1],
          label: "Taxonomic Order",
          values: unpack(transformedData, "order").map(
            (order) => orderMapping.mapping[order]
          ),
          tickvals: Array.from(
            { length: orderMapping.distinctVals.length },
            (_, i) => i
          ),
          ticktext: orderMapping.distinctVals,
        },
        {
          range: [0, Math.max(...unpack(transformedData, "brainWeight")) || 1],
          label: "Brain Weight (g)",
          values: unpack(transformedData, "brainWeight"),
        },
        {
          range: [0, Math.max(...unpack(transformedData, "bodyWeight")) || 1],
          label: "Body Weight (g)",
          values: unpack(transformedData, "bodyWeight"),
        },
        {
          range: [0, brainPartMapping.distinctVals.length - 1],
          label: "Brain Part",
          values: unpack(transformedData, "brainPart").map(
            (part) => brainPartMapping.mapping[part]
          ),
          tickvals: Array.from(
            { length: brainPartMapping.distinctVals.length },
            (_, i) => i
          ),
          ticktext: brainPartMapping.distinctVals,
        },
        {
          range: [
            0,
            Math.max(...unpack(transformedData, "sectionThickness")) || 1,
          ],
          label: "Section Thickness (μm)",
          values: unpack(transformedData, "sectionThickness"),
        },
        {
          range: [0, stainingMapping.distinctVals.length - 1],
          label: "Staining Method",
          values: unpack(transformedData, "stainingMethod").map(
            (method) => stainingMapping.mapping[method]
          ),
          tickvals: Array.from(
            { length: stainingMapping.distinctVals.length },
            (_, i) => i
          ),
          ticktext: stainingMapping.distinctVals,
        },
        {
          range: [0, sexMapping.distinctVals.length - 1],
          label: "Sex",
          values: unpack(transformedData, "sex").map(
            (sex) => sexMapping.mapping[sex]
          ),
          tickvals: Array.from(
            { length: sexMapping.distinctVals.length },
            (_, i) => i
          ),
          ticktext: sexMapping.distinctVals,
        },
      ],
    },
  ];

  const layout = {
    paper_bgcolor: COLORS.background,
    plot_bgcolor: COLORS.background,
    font: {
      color: COLORS.textPrimary,
      size: 16,
      family: "'Geist', sans-serif",
    },
    margin: { t: 80, b: 80, l: 120, r: 80 },
    title: {
      font: {
        color: COLORS.textPrimary,
        size: 20,
        family: "'Geist', sans-serif",
      },
      x: 0.5,
    },
  };

  return (
    <Box sx={{ width: "100%", height: "77vh", bgcolor: COLORS.background }}>
      <Plot
        data={plotData}
        layout={layout}
        style={{ width: "100%", height: "100%" }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ["pan2d", "lasso2d"],
          displaylogo: false,
        }}
      />
    </Box>
  );
};

export default PlotlyChart;
