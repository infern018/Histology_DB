import React, { useEffect, useRef, useState } from "react"; // Import useState
import * as d3 from "d3";

const ParallelCoordinatesChart = ({ data }) => {
	const svgRef = useRef();
	const [highlightedIndex, setHighlightedIndex] = useState(null); // State to track the highlighted line

	useEffect(() => {
		const transformedData = data.map((entry) => ({
			developmentalStage: entry.physiologicalInformation.age.developmentalStage || "Unknown",
			brainWeight: entry.physiologicalInformation.brainWeight || 0,
			brainPart: entry.histologicalInformation.brainPart || "Unknown",
			sectionThickness: parseInt(entry.histologicalInformation.sectionThickness, 10) || 0,
			stainingMethod: entry.histologicalInformation.stainingMethod || "Unknown",
			interSectionDistance: entry.histologicalInformation.interSectionDistance || "Unknown",
		}));

		if (transformedData.length === 0) return;

		const margin = { top: 30, right: 0, bottom: 60, left: 0 }; // Increased top and bottom margins
		const width = window.innerWidth - margin.left - margin.right;
		const height = 600 - margin.top - margin.bottom; // Increased height

		d3.select(svgRef.current).selectAll("*").remove();

		const svg = d3
			.select(svgRef.current)
			.attr("width", "100vw")
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const dimensions = ["developmentalStage", "brainWeight", "brainPart", "sectionThickness", "stainingMethod", "interSectionDistance"];

		const y = {};
		dimensions.forEach((dim) => {
			if (dim === "brainWeight" || dim === "sectionThickness") {
				y[dim] = d3
					.scaleLinear()
					.domain(d3.extent(transformedData, (d) => +d[dim]))
					.range([height, 0]);
			} else {
				y[dim] = d3
					.scalePoint()
					.domain([...new Set(transformedData.map((d) => d[dim]))])
					.range([height, 0]);
			}
		});

		const x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

		function path(d) {
			return d3.line()(dimensions.map((p) => [x(p), y[p](d[p])]));
		}

		// Color scale for the lines
		const colorScale = d3.scaleOrdinal(d3.schemeSet1);

		svg.selectAll("myPath")
			.data(transformedData)
			.join("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", (d, i) =>
				highlightedIndex === i
					? d3.rgb(colorScale(i % dimensions.length)).darker(1)
					: colorScale(i % dimensions.length)
			) // Darker color for highlighted lines
			.style("opacity", 0.8)
			.on("click", (event, d) => {
				const index = transformedData.indexOf(d);
				setHighlightedIndex(highlightedIndex === index ? null : index); // Toggle highlight
			}); // Add click event

		svg.selectAll("myAxis")
			.data(dimensions)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${x(d)})`)
			.each(function (d) {
				d3.select(this).call(d3.axisLeft().scale(y[d]));
			})
			.append("text")
			.style("text-anchor", "middle")
			.attr("y", -12) // Increased vertical position for axis labels
			.text((d) => d)
			.style("fill", "#f5f5f5") // Set label color to off-white
			.style("font-size", "20px"); // Increased font size for axis labels

		// Change font size for axis tick values
		svg.selectAll(".tick text") // Select all text elements in ticks
			.style("font-size", "15px"); // Set the font size for tick values
	}, [data, highlightedIndex]); // Add highlightedIndex to dependencies

	return (
		<div
			style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100vw" }}>
			{" "}
			{/* Increased height for the container */}
			<svg ref={svgRef}></svg>
		</div>
	);
};

export default ParallelCoordinatesChart;
