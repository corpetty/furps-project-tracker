import React, { useState } from 'react';
import './FURPSMatrix.css';
import Modal from './Modal';

function FURPSMatrix({ milestones, furps, onSquareClick }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [highlightedFurps, setHighlightedFurps] = useState([]);
  const [activeMilestone, setActiveMilestone] = useState(null);

  // Define FURPS categories and stages
  const furpsCategories = ['Functionality', 'Usability', 'Reliability', 'Performance', 'Supportability'];
  const stages = ['Research', 'MVP', 'Private Testnet', 'Public Testnet', 'Production'];

  const handleSquareClick = (category, stage) => {
    const matchingFurps = furps.filter(
      f => f.category.toLowerCase() === category.toLowerCase() && 
      f.stage.toLowerCase() === stage.toLowerCase()
    );
    
    if (matchingFurps.length > 0) {
      setSelectedContent({
        category,
        stage,
        descriptions: matchingFurps.map(f => f.description),
        furps: matchingFurps // Add the full FURPS objects
      });
      setModalOpen(true);
    }
    
    if (onSquareClick) {
      onSquareClick(category, stage);
    }
  };

  const handleMilestoneClick = (milestone, index) => {
    if (activeMilestone === index) {
      // If clicking the active milestone, clear the highlighting
      setActiveMilestone(null);
      setHighlightedFurps([]);
    } else {
      // Set the new active milestone and highlight its FURPS
      setActiveMilestone(index);
      const associatedFurps = furps.filter(furp => 
        furp.milestone_id === milestone.id
      );
      setHighlightedFurps(associatedFurps);
    }
  };

  const isFurpHighlighted = (furp) => {
    return highlightedFurps.some(highlighted => 
      highlighted.id === furp.id
    );
  };

  return (
    <>
      <div className="furps-matrix">
        {/* Render the stages row */}
        <div className="matrix-row header-row">
          <div className="matrix-cell header-cell"></div>
          {stages.map((stage) => (
            <div key={stage} className="matrix-cell header-cell">
              {stage}
            </div>
          ))}
        </div>

        {/* Render the matrix rows */}
        {furpsCategories.map((category) => (
          <div key={category} className="matrix-row">
            <div className="matrix-cell header-cell">{category}</div>
            {stages.map((stage) => {
              const cellFurps = furps.filter(f => 
                f.category.toLowerCase() === category.toLowerCase() && 
                f.stage.toLowerCase() === stage.toLowerCase()
              );
              
              return (
                <div
                  key={`${category}-${stage}`}
                  className="matrix-cell"
                  onClick={() => handleSquareClick(category, stage)}
                >
                  {cellFurps.length > 0 && (
                    <ul className="furp-list">
                      {cellFurps.map((furp, index) => (
                        <li 
                          key={index} 
                          className={`furp-content ${isFurpHighlighted(furp) ? 'highlighted' : ''}`}
                        >
                          {furp.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Render milestone titles */}
      {milestones && milestones.length > 0 && (
        <div className="milestone-section">
          <h3 className="milestone-header">Milestones</h3>
          <div className="milestone-list">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`milestone-item ${activeMilestone === index ? 'active' : ''}`}
                onClick={() => handleMilestoneClick(milestone, index)}
              >
                {milestone.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
      >
        {selectedContent && (
          <div className="modal-furp-content">
            <h2>{selectedContent.category} - {selectedContent.stage}</h2>
            <ul className="modal-furp-list">
              {selectedContent.descriptions.map((description, index) => (
                <li 
                  key={index}
                  className={selectedContent.furps[index] && isFurpHighlighted(selectedContent.furps[index]) ? 'highlighted' : ''}
                >
                  {description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
}

export default FURPSMatrix;
