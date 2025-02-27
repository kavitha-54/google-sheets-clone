// utils/formulaEvaluator.js

// Evaluate formulas like =SUM(A1:A5)
export const evaluateFormula = (formula, cellData) => {
  if (!formula.startsWith('=')) return formula; // Return normal value if no '='

  try {
      const formulaBody = formula.slice(1).toUpperCase();

      if (formulaBody.startsWith('SUM')) {
          return sumFunction(formulaBody, cellData);
      } else if (formulaBody.startsWith('AVERAGE')) {
          return averageFunction(formulaBody, cellData);
      } else if (formulaBody.startsWith('MAX')) {
          return maxFunction(formulaBody, cellData);
      } else if (formulaBody.startsWith('MIN')) {
          return minFunction(formulaBody, cellData);
      } else if (formulaBody.startsWith('COUNT')) {
          return countFunction(formulaBody, cellData);
      }

      return evaluateFormulaExtended(formula, cellData);
  } catch (error) {
      console.error('Formula evaluation error:', error);
      return 'Error';
  }
};

// Helper: Convert A1 to row/col index
const parseCell = (cell) => {
  const col = cell.charCodeAt(0) - 65; // 'A' = 65
  const row = parseInt(cell.slice(1)) - 1;
  return [row, col];
};

// Helper: Extract cell range (e.g., A1:A5)
const getRangeValues = (range, cellData) => {
  const [start, end] = range.split(':');
  const [startRow, startCol] = parseCell(start);
  const [endRow, endCol] = parseCell(end);

  let values = [];
  for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
          const key = `${r}-${c}`;
          if (!isNaN(cellData[key])) values.push(parseFloat(cellData[key]));
      }
  }
  return values;
};

// Data Validation: Ensure numeric cells contain only numbers
export const validateCellData = (value, type) => {
  if (type === 'number' && isNaN(value)) return 'Invalid Number';
  return value;
};

// SUM Function
const sumFunction = (formulaBody, cellData) => {
  const range = formulaBody.match(/\((.*?)\)/)[1];
  const values = getRangeValues(range, cellData);
  return values.reduce((acc, val) => acc + val, 0);
};

// AVERAGE Function
const averageFunction = (formulaBody, cellData) => {
  const range = formulaBody.match(/\((.*?)\)/)[1];
  const values = getRangeValues(range, cellData);
  return values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
};

// MAX Function
const maxFunction = (formulaBody, cellData) => {
  const range = formulaBody.match(/\((.*?)\)/)[1];
  const values = getRangeValues(range, cellData);
  return Math.max(...values);
};

// MIN Function
const minFunction = (formulaBody, cellData) => {
  const range = formulaBody.match(/\((.*?)\)/)[1];
  const values = getRangeValues(range, cellData);
  return Math.min(...values);
};

// COUNT Function
const countFunction = (formulaBody, cellData) => {
  const range = formulaBody.match(/\((.*?)\)/)[1];
  const values = getRangeValues(range, cellData);
  return values.length;
};

// Extended Formula Evaluation
export function evaluateFormulaExtended(formula, cellData) {
  const args = formula.slice(1).match(/([A-Z]+\d+|\".*?\"|\d+)/g) || [];

  const parseCellReference = (cellRef) => {
    const col = cellRef[0].toUpperCase().charCodeAt(0) - 65;
    const row = parseInt(cellRef.slice(1), 10) - 1;
    return { row, col };
  };

  const getCellValue = (cellRef) => {
    const { row, col } = parseCellReference(cellRef);
    return cellData[`${row}-${col}`] ?? '';
  };

  const getValuesFromRange = (range) => {
    const [start, end] = range.split(':');
    const { row: startRow, col: startCol } = parseCellReference(start);
    const { row: endRow, col: endCol } = parseCellReference(end);

    let values = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        values.push(cellData[`${r}-${c}`] || '');
      }
    }
    return values;
  };

  try {
    switch (formula.split('(')[0].toUpperCase().slice(1)) {
      case 'TRIM':
        return getCellValue(args[0]).trim();
      case 'UPPER':
        return getCellValue(args[0]).toUpperCase();
      case 'LOWER':
        return getCellValue(args[0]).toLowerCase();
      case 'CONCAT':
        return args.map(getCellValue).join('');
      case 'LEN':
        return getCellValue(args[0]).length;
      case 'LEFT':
        return getCellValue(args[0]).substring(0, parseInt(args[1], 10));
      case 'RIGHT':
        return getCellValue(args[0]).slice(-parseInt(args[1], 10));
      case 'MID':
        return getCellValue(args[0]).substring(
          parseInt(args[1], 10) - 1,
          parseInt(args[1], 10) - 1 + parseInt(args[2], 10)
        );
      case 'FIND_AND_REPLACE':
        return getCellValue(args[0]).replaceAll(args[1].replace(/\"/g, ''), args[2].replace(/\"/g, ''));
      case 'REMOVE_DUPLICATES':
        return [...new Set(getValuesFromRange(args[0]))].join(', ');
      default:
        return 'Unknown Function';
    }
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 'ERROR';
  }

  return formula;
}
