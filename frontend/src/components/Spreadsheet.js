import React, { useState } from 'react';
import { evaluateFormula } from '../utils/formulaEvaluator';
import '../App.css';

const Spreadsheet = () => {
    const [cellData, setCellData] = useState({});
    const [rows, setRows] = useState(5);
    const [cols, setCols] = useState(5);
    const [selectedCell, setSelectedCell] = useState(null);
    const [boldCells, setBoldCells] = useState(new Set());
    const [italicCells, setItalicCells] = useState(new Set());
    const [cellColor, setCellColor] = useState({});

    const updateCell = (row, col, value) => {
        const key = `${row}-${col}`;
        setCellData((prevData) => {
            const newData = { ...prevData, [key]: value };
            Object.keys(newData).forEach((cellKey) => {
                if (newData[cellKey].startsWith('=')) {
                    newData[cellKey] = evaluateFormula(newData[cellKey], newData);
                }
            });
            return newData;
        });
    };

    const getColumnLabel = (index) => String.fromCharCode(65 + index);

    const addRow = () => setRows((prev) => prev + 1);
    const addColumn = () => setCols((prev) => prev + 1);
    const deleteRow = () => setRows((prev) => (prev > 1 ? prev - 1 : 1));
    const deleteColumn = () => setCols((prev) => (prev > 1 ? prev - 1 : 1));

    const toggleBold = () => {
        if (selectedCell) {
            setBoldCells((prev) => {
                const newSet = new Set(prev);
                newSet.has(selectedCell) ? newSet.delete(selectedCell) : newSet.add(selectedCell);
                return newSet;
            });
        }
    };

    const toggleItalic = () => {
        if (selectedCell) {
            setItalicCells((prev) => {
                const newSet = new Set(prev);
                newSet.has(selectedCell) ? newSet.delete(selectedCell) : newSet.add(selectedCell);
                return newSet;
            });
        }
    };

    return (
        <div>
            <h1>📊 Google Sheets Clone</h1>
            <div className="toolbar">
                <button onClick={addRow}>➕ Add Row</button>
                <button onClick={addColumn}>➕ Add Column</button>
                <button onClick={deleteRow}>➖ Delete Row</button>
                <button onClick={deleteColumn}>➖ Delete Column</button>
                <button onClick={toggleBold}><b>Bold</b></button>
                <button onClick={toggleItalic}><i>Italic</i></button>
            </div>
            <div style={gridStyle}>
                <div></div>
                {Array.from({ length: 5 }).map((_, col) => (
                    <div key={col} style={headerStyle}>{getColumnLabel(col)}</div>
                ))}
                {Array.from({ length: 5 }).map((_, row) => (
                    <React.Fragment key={row}>
                        <div style={headerStyle}>{row + 1}</div>
                        {Array.from({ length: 5 }).map((_, col) => {
                            const key = `${row}-${col}`;
                            return (
                                <input
                                    key={key}
                                    value={cellData[key] || ''}
                                    onChange={(e) => updateCell(row, col, e.target.value)}
                                    style={{
                                        ...cellStyle,
                                        fontWeight: boldCells.has(key) ? 'bold' : 'normal',
                                        fontStyle: italicCells.has(key) ? 'italic' : 'normal',
                                        backgroundColor: cellColor[key] || 'white',
                                    }}
                                    placeholder={getColumnLabel(col) + (row + 1)}
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>🧮 Supported Formulas:</h2>
                <ul>
                    <li><code>=SUM(A1:A5)</code> – Add cells</li>
                    <li><code>=AVERAGE(A1:A5)</code> – Average value</li>
                    <li><code>=MAX(A1:A5)</code> – Maximum value</li>
                    <li><code>=MIN(A1:A5)</code> – Minimum value</li>
                    <li><code>=COUNT(A1:A5)</code> – Count numeric cells</li>
                    <li><code>=TRIM(A1)</code> – Remove leading/trailing spaces</li>
                    <li><code>=UPPER(A1)</code> – Convert to uppercase</li>
                    <li><code>=LOWER(A1)</code> – Convert to lowercase</li>
                    <li><code>=CONCAT(A1,B1)</code> – Concatenate cells</li>
                    <li><code>=LEN(A1)</code> – Length of cell content</li>
                    <li><code>=LEFT(A1,3)</code> – Left substring</li>
                    <li><code>=RIGHT(A1,3)</code> – Right substring</li>
                    <li><code>=MID(A1,2,3)</code> – Middle substring</li>
                    <li><code>=FIND_AND_REPLACE(A1,"old","new")</code> – Find and replace text</li>
                    <li><code>=REMOVE_DUPLICATES(A1:A5)</code> – Remove duplicate rows</li>
                </ul>
            </div>
        </div>
    );
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '50px repeat(5, 100px)',
};

const cellStyle = {
    width: '100px',
    height: '40px',
    textAlign: 'center',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    border: '1px solid #ccc',
    background: '#f0f0f0',
};

export default Spreadsheet;
