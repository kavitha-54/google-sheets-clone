import React, { useState } from 'react';
import { evaluateFormula } from '../utils/formulaEvaluator';

const Spreadsheet = () => {
    // Store cell data: { '0-0': '5', '1-0': '=SUM(A1:A5)' }
    const [cellData, setCellData] = useState({});

    // Update cell and auto-evaluate formulas
    const updateCell = (row, col, value) => {
        const key = `${row}-${col}`;

        setCellData((prevData) => {
            const newData = { ...prevData, [key]: value };

            // Evaluate all formulas after update
            Object.keys(newData).forEach((cellKey) => {
                if (newData[cellKey].startsWith('=')) {
                    newData[cellKey] = evaluateFormula(newData[cellKey], newData);
                }
            });

            return newData;
        });
    };

    // Generate Column Labels (A, B, C…)
    const getColumnLabel = (index) => String.fromCharCode(65 + index);

    return (
        <div>
            <h1>📊 Google Sheets Clone</h1>

            {/* Spreadsheet */}
            <div style={gridStyle}>
                {/* Header Row */}
                <div></div>
                {Array.from({ length: 5 }).map((_, col) => (
                    <div key={col} style={headerStyle}>{getColumnLabel(col)}</div>
                ))}

                {/* Cells */}
                {Array.from({ length: 5 }).map((_, row) => (
                    <React.Fragment key={row}>
                        {/* Row Numbers */}
                        <div style={headerStyle}>{row + 1}</div>

                        {Array.from({ length: 5 }).map((_, col) => {
                            const key = `${row}-${col}`;
                            return (
                                <input
                                    key={key}
                                    value={cellData[key] || ''}
                                    onChange={(e) => updateCell(row, col, e.target.value)}
                                    style={cellStyle}
                                    placeholder={getColumnLabel(col) + (row + 1)}
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            {/* Formula Guide */}
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
