/**
 * Utility functions for exporting data
 */

/**
 * Convert entries data to CSV format
 * @param {Array} entries - Array of entry objects
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (entries) => {
  if (!entries || entries.length === 0) {
    return "";
  }

  // Define the headers and their corresponding paths in the entry object
  const headers = [
    { label: "Species Name", path: "identification.bionomialSpeciesName" },
    { label: "NCBI Taxonomy Code", path: "identification.NCBITaxonomyCode" },
    { label: "Order", path: "identification.order" },
    { label: "Item Code", path: "identification.itemCode" },
    { label: "Individual Code", path: "identification.individualCode" },
    {
      label: "Wikipedia Species Name",
      path: "identification.wikipediaSpeciesName",
    },
    { label: "Microdraw Link", path: "identification.microdraw_link" },
    { label: "Source Link", path: "identification.source_link" },
    { label: "Thumbnail", path: "identification.thumbnail" },
    {
      label: "Archival Species Code",
      path: "archivalIdentification.archivalSpeciesCode",
    },
    {
      label: "Developmental Stage",
      path: "physiologicalInformation.age.developmentalStage",
    },
    { label: "Age Number", path: "physiologicalInformation.age.number" },
    { label: "Age Unit", path: "physiologicalInformation.age.unitOfNumber" },
    { label: "Age Origin", path: "physiologicalInformation.age.origin" },
    { label: "Body Weight", path: "physiologicalInformation.bodyWeight" },
    { label: "Brain Weight", path: "physiologicalInformation.brainWeight" },
    { label: "Sex", path: "physiologicalInformation.sex" },
    {
      label: "Staining Method",
      path: "histologicalInformation.stainingMethod",
    },
    {
      label: "Section Thickness",
      path: "histologicalInformation.sectionThickness",
    },
    {
      label: "Plane of Sectioning",
      path: "histologicalInformation.planeOfSectioning",
    },
    {
      label: "Inter Section Distance",
      path: "histologicalInformation.interSectionDistance",
    },
    { label: "Brain Part", path: "histologicalInformation.brainPart" },
    { label: "Comments", path: "histologicalInformation.comments" },
    { label: "Collection ID", path: "collectionID" },
    { label: "Created At", path: "createdAt" },
    { label: "Updated At", path: "updatedAt" },
  ];

  // Helper function to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Create CSV header row
  const csvHeaders = headers.map((header) => `"${header.label}"`).join(",");

  // Create CSV data rows
  const csvRows = entries.map((entry) => {
    return headers
      .map((header) => {
        const value = getNestedValue(entry, header.path);
        // Handle different data types and escape quotes
        if (value === null || value === undefined) {
          return '""';
        }
        const stringValue = String(value).replace(/"/g, '""'); // Escape quotes
        return `"${stringValue}"`;
      })
      .join(",");
  });

  // Combine headers and rows
  return [csvHeaders, ...csvRows].join("\n");
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = "search_results.csv") => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Format current date for filename
 * @returns {string} Formatted date string
 */
export const formatDateForFilename = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}`;
};
