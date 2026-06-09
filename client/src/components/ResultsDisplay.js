import React, { useState } from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ results = [] }) {

  const [expandedIndex, setExpandedIndex] =
    useState(null);

  const toggleExpanded = (index) => {

    setExpandedIndex(

      expandedIndex === index
        ? null
        : index

    );
  };

  const copyToClipboard = (text) => {

    navigator.clipboard.writeText(
      String(text)
    );
  };

  const isTableMode =

    results.length > 0 &&
    results[0]?.values;

  const avgConfidence =

    !isTableMode &&
    results.length > 0

      ? (

          results.reduce(

            (sum, item) =>

              sum +
              Number(
                item.confidence || 0
              ),

            0

          ) / results.length

        ).toFixed(1)

      : 0;

  return (

    <div className="results-display">

      <div className="results-stats">

        <div className="stat-item">

          <span className="stat-label">
            Total Items
          </span>

          <span className="stat-value">
            {results.length}
          </span>

        </div>

        {!isTableMode && (

          <div className="stat-item">

            <span className="stat-label">
              Avg Confidence
            </span>

            <span className="stat-value">
              {avgConfidence}%
            </span>

          </div>

        )}

      </div>

      {/* ======================
         TABLE MODE
      ====================== */}

      {isTableMode ? (

        <div className="table-container">

          <table className="results-table">

            <thead>

              <tr>

                <th>#</th>

                <th>File Type</th>

                <th>Name</th>

                <th>Size</th>

                <th>Batch</th>

                <th>Project</th>

                <th>Status</th>

                <th>Color Hex</th>

                <th>Color Name</th>

                <th>Confidence</th>

                <th>RGB</th>

              </tr>

            </thead>

            <tbody>

              {results.map(
                (row, rowIndex) => (

                  <tr key={rowIndex}>

                    <td>
                      {row.rowNumber || rowIndex + 1}
                    </td>

                    <td>
                      {row.values?.[0]?.text}
                    </td>

                    <td>
                      {row.values?.[1]?.text}
                    </td>

                    <td>
                      {row.values?.[2]?.text}
                    </td>

                    <td>
                      {row.values?.[3]?.text}
                    </td>

                    <td>
                      {row.values?.[4]?.text}
                    </td>

                    <td>
                      {row.values?.[5]?.text}
                    </td>

                    <td>
                      <span
                        style={{
                          backgroundColor:
                            row.backgroundColor,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: '#000'
                        }}
                      >
                        {row.backgroundColor}
                      </span>
                    </td>

                    <td>
                      {row.colorName}
                    </td>

                    <td>
                      {row.confidence}%
                    </td>

                    <td>
                      {row.rgb
                        ? row.rgb.join(',')
                        : ''}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      ) : (

        /* ======================
           NORMAL OCR MODE
        ====================== */

        <div className="results-list">

          {results.map(
            (item, index) => (

              <div
                key={index}
                className="result-item"
              >

                <div
                  className="result-header"
                  onClick={() =>
                    toggleExpanded(index)
                  }
                >

                  <div
                    className="result-color-indicator"
                    style={{
                      backgroundColor:
                        item.backgroundColor ||
                        '#cccccc'
                    }}
                  >
                    {item.backgroundColor}
                  </div>

                  <div className="result-text">

                    <strong>
                      {item.text}
                    </strong>

                  </div>

                  <div className="result-toggle">

                    {expandedIndex === index
                      ? '▼'
                      : '▶'}

                  </div>

                </div>

                {expandedIndex === index && (

                  <div className="result-details">

                    <div className="detail-row">

                      <span className="detail-label">
                        Text:
                      </span>

                      <span className="detail-value">

                        {item.text}

                        <button
                          className="copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              item.text
                            )
                          }
                        >
                          📋
                        </button>

                      </span>

                    </div>

                    <div className="detail-row">

                      <span className="detail-label">
                        Background Color:
                      </span>

                      <span className="detail-value">

                        {item.backgroundColor}

                        <button
                          className="copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              item.backgroundColor
                            )
                          }
                        >
                          📋
                        </button>

                      </span>

                    </div>

                    <div className="detail-row">

                      <span className="detail-label">
                        Color Name:
                      </span>

                      <span className="detail-value">
                        {item.colorName}
                      </span>

                    </div>

                    <div className="detail-row">

                      <span className="detail-label">
                        RGB:
                      </span>

                      <span className="detail-value">

                        {item.rgb
                          ? item.rgb.join(',')
                          : ''}

                      </span>

                    </div>

                    <div className="detail-row">

                      <span className="detail-label">
                        Confidence:
                      </span>

                      <span className="detail-value">

                        {Number(
                          item.confidence || 0
                        ).toFixed(2)}
                        %

                      </span>

                    </div>

                    {item.bbox && (

                      <div className="detail-row">

                        <span className="detail-label">
                          Bounding Box:
                        </span>

                        <span className="detail-value">

                          X:{item.bbox.x}
                          , Y:{item.bbox.y}
                          , W:{item.bbox.width}
                          , H:{item.bbox.height}

                        </span>

                      </div>

                    )}

                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>

  );
}

export default ResultsDisplay;