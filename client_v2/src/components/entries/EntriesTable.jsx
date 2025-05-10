import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Paper,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageCell from '../utils/ImageSkeleton';
import stainingGroups from '../utils/stainingGroups.json';
import brainParts from '../utils/brainParts.json';
import categoryColors from '../utils/categoryColor.json';

const EntriesTable = ({
  entries,
  selectedEntries,
  onSelectEntry,
  onSelectAll,
  currUserMode,
  isPublic,
  handleSort,
}) => {
  const [sortField, setSortField] = useState(
    'identification.bionomialSpeciesName'
  );
  const [sortOrder, setSortOrder] = useState('asc'); // "asc" or "desc"
  const navigate = useNavigate();

  // Helper function to get the category and color for a staining method
  const getStainingCategory = (stainingMethod) => {
    for (const [category, methods] of Object.entries(stainingGroups)) {
      if (methods.includes(stainingMethod)) {
        return { category, color: categoryColors[category] || '#9e9e9e' };
      }
    }
    return { category: 'Unknown', color: '#9e9e9e' };
  };

  // Helper function to get the category and color for a brain part
  const getBrainPartCategory = (brainPart) => {
    for (const [category, parts] of Object.entries(brainParts)) {
      if (parts.includes(brainPart)) {
        return { category, color: categoryColors[category] || '#9e9e9e' };
      }
    }
    return { category: 'Unknown', color: '#9e9e9e' };
  };

  const handleFieldSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    handleSort(field, newSortOrder);
  };

  const handleSelectAll = (event) => {
    onSelectAll(event);
  };

  const handleSelectEntry = (entryId) => {
    onSelectEntry(entryId);
  };

  const handleRowClick = (entryId) => {
    navigate(`/entry/${entryId}?isPublic=${isPublic}`);
  };

  const tableRowHeight = 65;
  const tableHeaderRowHeight = 52;

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        maxWidth: '100%',
        maxHeight: '900px',
        overflowY: 'auto',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Table sx={{ width: '100%' }} size="small">
        <TableHead>
          <TableRow
            sx={{ height: tableHeaderRowHeight, backgroundColor: '#262626' }}
          >
            {currUserMode !== 'view' && (
              <TableCell padding="checkbox">
                <Checkbox
                  sx={{
                    'color': '#ffffff',
                    '&.Mui-checked': {
                      color: '#4caf50',
                    },
                    '&.Mui-checked:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  checked={
                    selectedEntries.length === entries.length &&
                    entries.length !== 0
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
            )}
            {[
              { label: 'Specimen ID' },
              { label: 'Brain Part' },
              { label: 'Thumbnail' },
              {
                label: 'Bionomial Species Name',
                sortField: 'identification.bionomialSpeciesName',
              },
              {
                label: 'Developmental Stage',
                sortField: 'physiologicalInformation.age.developmentalStage',
              },
              {
                label: 'Sex',
                sortField: 'physiologicalInformation.sex',
              },
              {
                label: 'Staining Method',
                sortField: 'histologicalInformation.stainingMethod',
              },
              {
                label: 'Order',
                sortField: 'identification.order',
              },
            ].map((column, index) => (
              <TableCell key={index}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="white"
                  onClick={() =>
                    column.sortField && handleFieldSort(column.sortField)
                  }
                  sx={{
                    cursor: column.sortField ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {column.label}
                  {column.sortField && sortField === column.sortField && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry._id}
              hover
              onClick={() => handleRowClick(entry._id)}
              sx={{
                'height': tableRowHeight,
                'cursor': 'pointer',
                'backgroundColor': '#1e1e1e',
                '&:hover': {
                  backgroundColor: '#333333',
                },
                'transition': 'background-color 0.3s ease',
              }}
            >
              {currUserMode !== 'view' && (
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{
                      'color': '#ffffff',
                      '&.Mui-checked': {
                        color: '#4caf50',
                      },
                      '&.Mui-checked:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                    checked={selectedEntries.includes(entry._id)}
                    onChange={() => handleSelectEntry(entry._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              )}
              <TableCell>
                <Typography variant="body2" color="white">
                  {entry.archivalIdentification?.archivalSpeciesCode || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                {/* Brain Part with Color Chip */}
                {entry.histologicalInformation.brainPart ? (
                  (() => {
                    const { color } = getBrainPartCategory(
                      entry.histologicalInformation.brainPart
                    );
                    return (
                      <Chip
                        label={entry.histologicalInformation.brainPart}
                        sx={{
                          backgroundColor: color,
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    );
                  })()
                ) : (
                  <Typography variant="body2" color="gray">
                    Unknown
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {entry.identification.thumbnail ? (
                  <ImageCell src={entry.identification.thumbnail} />
                ) : (
                  <Typography variant="body2" color="gray">
                    No Image
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="white">
                  {entry.identification.bionomialSpeciesName || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="white">
                  {entry.physiologicalInformation.age.developmentalStage || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="white">
                  {entry.physiologicalInformation.sex || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                {/* Staining Method with Color Chip */}
                {entry.histologicalInformation.stainingMethod ? (
                  (() => {
                    const { color } = getStainingCategory(
                      entry.histologicalInformation.stainingMethod
                    );
                    return (
                      <Chip
                        label={entry.histologicalInformation.stainingMethod}
                        sx={{
                          backgroundColor: color,
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    );
                  })()
                ) : (
                  <Typography variant="body2" color="gray">
                    Unknown
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="white">
                  {entry.identification.order || '-'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EntriesTable;
