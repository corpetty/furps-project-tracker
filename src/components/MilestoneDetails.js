import React from 'react';
import { marked } from 'marked';
import './MilestoneDetails.css';

function MilestoneDetails({ milestone }) {
  if (!milestone) return null;

  const renderMarkdown = (content) => {
    return { __html: marked(content) };
  };

  return (
    <div className="milestone-details">
      <h2>{milestone.title}</h2>
      <p><strong>Status:</strong> {milestone.status}</p>
      <p><strong>Completion Date:</strong> {milestone.date_of_completion}</p>
      <div dangerouslySetInnerHTML={renderMarkdown(milestone.description)} />
      <h3>FURPS Details</h3>
      {['functionality', 'usability', 'reliability', 'performance', 'supportability'].map(category => (
        milestone[category] && (
          <div key={category}>
            <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <ul>
              {milestone[category].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );
}

export default MilestoneDetails;
