import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import FURPSMatrix from './components/FURPSMatrix';
import MilestoneDetails from './components/MilestoneDetails';
import './App.css';

function App() {
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const fetchMilestones = async () => {
      try {
        const response = await axios.get('/api/milestones');
        setMilestones(response.data);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    fetchMilestones();
  }, []);

  const handleSquareClick = (furpsCategory, stage, milestone) => {
    setSelectedMilestone(milestone);
  };

  return (
    <div className="App">
      <h1>FURPS Project Tracker</h1>
      <FURPSMatrix milestones={milestones} onSquareClick={handleSquareClick} />
      {selectedMilestone && (
        <MilestoneDetails milestone={selectedMilestone} />
      )}
    </div>
  );
}

export default App;
