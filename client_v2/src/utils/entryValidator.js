// Frontend validator for CSV entries
// Mimics the backend validation logic

// Constants matching the backend model
const developmentalStages = [
  "embryo",
  "fetus",
  "neonate",
  "infant",
  "juvenile",
  "adult",
];
const unitsOfNumber = ["days", "weeks", "months", "years"];
const origins = ["postNatal", "postConception"];
const genders = ["m", "f", "u"];

// Field validation rules based on the Entry schema
const validationSchema = {
  "identification.bionomialSpeciesName": {
    required: true,
    type: "string",
  },
  "identification.itemCode": {
    required: true,
    type: "string",
  },
  "identification.individualCode": {
    required: true,
    type: "string",
  },
  "identification.NCBITaxonomyCode": {
    required: false,
    type: "number",
  },
  "identification.wikipediaSpeciesName": {
    required: false,
    type: "string",
  },
  "identification.order": {
    required: false,
    type: "string",
  },
  "identification.source_link": {
    required: false,
    type: "string",
  },
  "identification.microdraw_link": {
    required: false,
    type: "string",
  },
  "identification.thumbnail": {
    required: false,
    type: "string",
  },
  "archivalIdentification.archivalSpeciesCode": {
    required: false,
    type: "string",
  },
  "physiologicalInformation.age.developmentalStage": {
    required: false,
    type: "string",
    enum: developmentalStages,
  },
  "physiologicalInformation.age.number": {
    required: false,
    type: "number",
  },
  "physiologicalInformation.age.unitOfNumber": {
    required: false,
    type: "string",
    enum: unitsOfNumber,
  },
  "physiologicalInformation.age.origin": {
    required: false,
    type: "string",
    enum: origins,
  },
  "physiologicalInformation.sex": {
    required: false,
    type: "string",
    enum: genders,
  },
  "physiologicalInformation.bodyWeight": {
    required: false,
    type: "number",
  },
  "physiologicalInformation.brainWeight": {
    required: false,
    type: "number",
  },
  "histologicalInformation.stainingMethod": {
    required: false,
    type: "string",
  },
  "histologicalInformation.sectionThickness": {
    required: false,
    type: "string",
  },
  "histologicalInformation.planeOfSectioning": {
    required: false,
    type: "string",
  },
  "histologicalInformation.interSectionDistance": {
    required: false,
    type: "string",
  },
  "histologicalInformation.brainPart": {
    required: false,
    type: "string",
  },
  "histologicalInformation.comments": {
    required: false,
    type: "string",
  },
};

// Helper function to get nested value from object
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Helper function to generate random alphanumeric string
const generateRandomAlphaNumeric = () => {
  return Math.random().toString(16).slice(2, 6);
};

// Transform CSV row to entry structure (mimics backend transformation)
const transformCSVRowToEntry = (csvRow, collectionID) => {
  const scientificName = csvRow.bionomialSpeciesName || "";

  const entry = {
    collectionID,
    identification: {
      bionomialSpeciesName: scientificName,
      itemCode: `${scientificName}_${
        csvRow.stainingMethod || ""
      }_${generateRandomAlphaNumeric()}`,
      individualCode: `${scientificName}_${generateRandomAlphaNumeric()}`,
      NCBITaxonomyCode: csvRow.NCBITaxonomyCode
        ? parseInt(csvRow.NCBITaxonomyCode)
        : null,
      wikipediaSpeciesName: scientificName
        ? `https://en.wikipedia.org/wiki/${scientificName}`
        : "",
      order: null, // Will be populated by backend
      source_link: csvRow.source_link || null,
      microdraw_link: csvRow.microdraw_link || null,
      thumbnail: csvRow.thumbnail || null,
    },
    archivalIdentification: {
      archivalSpeciesCode: csvRow.archivalCode || null,
    },
    physiologicalInformation: {
      age: {
        developmentalStage: csvRow.developmentalStage || null,
        number: csvRow.ageNumber ? parseFloat(csvRow.ageNumber) : null,
        unitOfNumber: csvRow.ageUnit || null,
        origin: csvRow.origin || "postNatal",
      },
      bodyWeight: csvRow.bodyWeight ? parseFloat(csvRow.bodyWeight) : null,
      brainWeight: csvRow.brainWeight ? parseFloat(csvRow.brainWeight) : null,
      sex: csvRow.sex || null,
    },
    histologicalInformation: {
      stainingMethod: csvRow.stainingMethod || null,
      sectionThickness: csvRow.sectionThickness || null,
      planeOfSectioning: csvRow.planeOfSectioning || null,
      interSectionDistance: csvRow.interSectionDistance || null,
      brainPart: csvRow.brainPart || null,
      comments: csvRow.comments || null,
    },
  };

  return entry;
};

// Main validation function
const validateEntry = (entry) => {
  const errors = [];
  const warnings = [];

  Object.entries(validationSchema).forEach(([fieldPath, rules]) => {
    const value = getNestedValue(entry, fieldPath);

    // Check required fields
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${fieldPath} is required`);
      return;
    }

    // If field is not required and empty, skip further validation
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      return;
    }

    // Type validation
    if (rules.type === "number" && value !== null && value !== undefined) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        errors.push(`${fieldPath} must be a valid number`);
      }
    }

    if (
      rules.type === "string" &&
      value !== null &&
      value !== undefined &&
      typeof value !== "string"
    ) {
      errors.push(`${fieldPath} must be a string`);
    }

    // Enum validation
    if (rules.enum && value !== null && value !== undefined && value !== "") {
      if (!rules.enum.includes(value)) {
        errors.push(`${fieldPath} must be one of: ${rules.enum.join(", ")}`);
      }
    }
  });

  return { errors, warnings };
};

// Validate CSV data function
export const validateCSVData = (csvData, collectionID) => {
  const results = [];
  const failedRows = [];
  const warningRows = [];

  csvData.forEach((row, index) => {
    try {
      // Transform CSV row to entry structure
      const entry = transformCSVRowToEntry(row, collectionID);

      // Validate the entry
      const validation = validateEntry(entry);
      const { errors, warnings } = validation;

      if (errors.length === 0) {
        results.push(entry);

        // If there are warnings but no errors, add to warning rows
        if (warnings.length > 0) {
          warningRows.push({
            rowNumber: index + 1,
            originalRow: row,
            transformedEntry: entry,
            warnings: warnings,
          });
        }
      } else {
        failedRows.push({
          rowNumber: index + 1,
          originalRow: row,
          transformedEntry: entry,
          errors: errors,
          warnings: warnings,
        });
      }
    } catch (error) {
      failedRows.push({
        rowNumber: index + 1,
        originalRow: row,
        transformedEntry: null,
        errors: [`Row processing error: ${error.message}`],
        warnings: [],
      });
    }
  });

  return {
    status:
      failedRows.length > 0
        ? "validation_errors"
        : warningRows.length > 0
        ? "validation_warnings"
        : "success",
    validEntries: results,
    invalidEntries: failedRows,
    warningEntries: warningRows,
    processedCount: results.length,
    failedCount: failedRows.length,
    warningCount: warningRows.length,
    totalCount: csvData.length,
  };
};

export default validateEntry;
