import React from 'react';
import './FURPSMatrix.css';

const furpsCategories = ['Functionality', 'Usability', 'Reliability', 'Performance', 'Supportability'];
const stages = ['Research/PoC', 'MVP', 'Private Testnet', 'Public Testnet', 'Production'];

function FURPSMatrix({ milestones, onSquareClick }) {
  const getSquareColor = (furpsCategory, stage) => {
    const milestone = milestones.find(m => 
      m[furpsCategory.toLowerCase()] && 
      m[furpsCategory.toLowerCase()].some(item => item.includes(`(${stage})`))
    );

    return milestone ? '#4CAF50' : '#ddd';
  };

  return (
    <div className="furps-matrix">
      <div className="matrix-header">
        {stages.map(stage => (
          <div key={stage} className="matrix-header-item">{stage}</div>
        ))}
      </div>
      {furpsCategories.map(category => (
        <div key={category} className="matrix-row">
          <div className="matrix-row-label">{category}</div>
          {stages.map(stage => (
            <div
              key={`${category}-${stage}`}
              className="matrix-square"
              style={{ backgroundColor: getSquareColor(category, stage) }}
              onClick={() => onSquareClick(category, stage, milestones.find(m => 
                m[category.toLowerCase()] && 
                m[category.toLowerCase()].some(item => item.includes(`(${stage})`))
              ))}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default FURPSMatrix;
