import React from 'react';
import './FURPSMatrix.css';

function FURPSMatrix({ milestones, furps, onSquareClick }) {
  console.log('FURPSMatrix props:', { milestones, furps }); // Debugging line

  // Define FURPS categories and stages
  const furpsCategories = ['Functionality', 'Usability', 'Reliability', 'Performance', 'Supportability'];
  const stages = ['Research', 'MVP', 'Private Testnet', 'Public Testnet', 'Production'];

  return (
    <div className="furps-matrix">
      {/* Render the matrix headers */}
      <div className="matrix-row header-row">
        <div className="matrix-cell header-cell"></div>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="matrix-cell header-cell">
            {milestone.name}
          </div>
        ))}
      </div>

      {/* Render the matrix rows */}
      {furpsCategories.map((category) => (
        <div key={category} className="matrix-row">
          <div className="matrix-cell header-cell">{category}</div>
          {stages.map((stage) => (
            <div
              key={`${category}-${stage}`}
              className="matrix-cell"
              onClick={() => onSquareClick(category, stage)}
            >
              {furps.find(f => f.category.toLowerCase() === category.toLowerCase() && f.stage.toLowerCase() === stage.toLowerCase()) ? (
                <div className="furp-content">
                  {furps.find(f => f.category.toLowerCase() === category.toLowerCase() && f.stage.toLowerCase() === stage.toLowerCase()).description}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FURPSMatrix;
