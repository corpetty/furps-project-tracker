import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import FURPSMatrix from './components/FURPSMatrix';
import MilestoneDetails from './components/MilestoneDetails';
import './App.css';

function App() {
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [furps, setFurps] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const fetchMilestones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/milestones');
        setMilestones(response.data);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    fetchMilestones();

    const fetchFurps = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/furps_items');
        console.log('Fetched FURPs:', response.data);
        setFurps(response.data);
      } catch (error) {
        console.error('Error fetching FURPs:', error);
      }
    };

    fetchFurps();
  }, []);

  const handleSquareClick = (furpsCategory, stage, milestone) => {
    setSelectedMilestone(milestone);
  };

  console.log('Current furps state:', furps); // Add this line for debugging

  return (
    <div className="App">
      <h1>FURPS Project Tracker</h1>
      <FURPSMatrix 
        milestones={milestones} 
        furps={furps} 
        onSquareClick={handleSquareClick} 
      />
      {selectedMilestone && (
        <MilestoneDetails milestone={selectedMilestone} />
      )}
    </div>
  );
}

export default App;
