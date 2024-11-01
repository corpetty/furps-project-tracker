import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const handleSquareClick = (furpsCategory, stage, furpsItems) => {
    // Find milestone associated with these FURPS items
    const relevantMilestone = milestones.find(milestone =>
      milestone.furps_items?.some(item =>
        furpsItems.some(furp => furp.id === item.id)
      )
    );
    setSelectedMilestone(relevantMilestone);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">FURPS Project Tracker</h1>
        <FURPSMatrix 
          milestones={milestones} 
          furps={furps} 
          onSquareClick={handleSquareClick} 
        />
        {selectedMilestone && (
          <div className="mt-8">
            <MilestoneDetails milestone={selectedMilestone} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
