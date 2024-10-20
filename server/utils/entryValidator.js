const validateRowAgainstSchema = (row, schema, parentKey = "") => {
	const rowErrors = [];

	const paths = schema.paths;

	// Recursive function to validate nested fields
	const validateField = (fieldValue, path, key) => {
		const { instance, options } = path;

		// Check for required fields
		if (options.required && (fieldValue === undefined || fieldValue === null || fieldValue === "")) {
			rowErrors.push(`${key} is required.`);
		}

		// Check for enum values
		if (
			options.enum &&
			(fieldValue === undefined || fieldValue === null || fieldValue === "" || !options.enum.includes(fieldValue))
		) {
			rowErrors.push(`${key} must be one of: ${options.enum.join(", ")}`);
		}

		// Check for correct data types
		if (
			instance === "Number" &&
			(fieldValue === undefined || fieldValue === null || isNaN(parseFloat(fieldValue)))
		) {
			rowErrors.push(`${key} must be a valid number.`);
		}
		if (instance === "String" && fieldValue && typeof fieldValue !== "string") {
			rowErrors.push(`${key} must be a string.`);
		}

		// Additional checks can be added here, such as min/max values, string length, etc.
	};

	// Loop through each schema path to validate
	for (const key in paths) {
		if (!paths.hasOwnProperty(key)) continue;

		const path = paths[key];

		// Build the full key for nested fields
		const fullKey = parentKey ? `${parentKey}.${key}` : key;

		// Get the field value from the row
		let fieldValue = row;
		const keyParts = fullKey.split(".");
		for (const part of keyParts) {
			if (fieldValue === undefined || fieldValue === null) break;
			fieldValue = fieldValue[part];
		}

		// If the path has a nested schema, validate recursively
		if (path.schema) {
			// Call the function recursively for nested objects
			validateRowAgainstSchema(fieldValue || {}, path.schema, fullKey);
		} else {
			// Validate the current field
			validateField(fieldValue, path, fullKey);
		}
	}

	// If there are errors, log them out
	if (rowErrors.length > 0) {
		console.log("ROW ERRORS");
		console.log(rowErrors);
	}

	return rowErrors;
};

module.exports = validateRowAgainstSchema;