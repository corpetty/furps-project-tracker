import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ChevronRight, Info } from 'lucide-react';

const FurpsProgressionMatrix = ({ milestones = [], furps = [], onSquareClick }) => {
  const [selectedTile, setSelectedTile] = useState(null);

  const stages = [
    { id: 'research', name: 'Research' },
    { id: 'mvp', name: 'MVP' },
    { id: 'private_testnet', name: 'Private Testnet' },
    { id: 'public_testnet', name: 'Public Testnet' },
    { id: 'production', name: 'Production' }
  ];

  const categories = [
    { id: 'functionality', name: 'Functionality' },
    { id: 'usability', name: 'Usability' },
    { id: 'reliability', name: 'Reliability' },
    { id: 'performance', name: 'Performance' },
    { id: 'supportability', name: 'Supportability' }
  ];

  // Calculate the current stage for each category based on FURPS items
  const getCurrentStage = (category) => {
    const categoryFurps = furps.filter(f => 
      f.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryFurps.length === 0) return 'research';
    
    const stageIds = stages.map(s => s.id);
    let maxStageIndex = 0;
    
    categoryFurps.forEach(furp => {
      const stageIndex = stageIds.indexOf(furp.stage.toLowerCase());
      if (stageIndex > maxStageIndex) {
        maxStageIndex = stageIndex;
      }
    });
    
    return stageIds[maxStageIndex];
  };

  // Get FURPS items for a specific category and stage
  const getFurpsForTile = (category, stage) => {
    return furps.filter(f => 
      f.category.toLowerCase() === category.toLowerCase() && 
      f.stage.toLowerCase() === stage.toLowerCase()
    );
  };

  const getTileState = (category, stage) => {
    const currentStage = getCurrentStage(category);
    const stageIndex = stages.findIndex(s => s.id === stage.toLowerCase());
    const currentStageIndex = stages.findIndex(s => s.id === currentStage);

    if (stageIndex === currentStageIndex) return 'current';
    if (stageIndex < currentStageIndex) return 'completed';
    return 'future';
  };

  const getTileColor = (state) => {
    switch (state) {
      case 'current':
        return 'bg-blue-100 border-blue-500';
      case 'completed':
        return 'bg-green-50 border-green-500';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleTileClick = (category, stage) => {
    const newSelectedTile = `${category}-${stage}`;
    setSelectedTile(selectedTile === newSelectedTile ? null : newSelectedTile);
    
    if (onSquareClick) {
      const tileFurps = getFurpsForTile(category, stage);
      onSquareClick(category, stage, tileFurps);
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>FURPS+ Progress Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 text-left w-32">Category</th>
                {stages.map(stage => (
                  <th key={stage.id} className="p-4 border-b-2 text-center w-40">
                    {stage.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="p-4 border-b font-medium">{category.name}</td>
                  {stages.map(stage => {
                    const state = getTileState(category.id, stage.id);
                    const tileFurps = getFurpsForTile(category.id, stage.id);
                    
                    return (
                      <td key={stage.id} className="p-2 border-b">
                        <div
                          className={`relative h-24 p-2 border-2 rounded-lg cursor-pointer transition-colors
                            ${getTileColor(state)}
                            ${selectedTile === `${category.id}-${stage.id}` ? 'ring-2 ring-blue-400' : ''}
                          `}
                          onClick={() => handleTileClick(category.id, stage.id)}
                        >
                          {tileFurps.length > 0 && (
                            <div className="absolute top-2 right-2">
                              <Info size={16} className="text-gray-500" />
                            </div>
                          )}
                          
                          {state === 'current' && (
                            <div className="absolute bottom-2 right-2">
                              <ChevronRight size={16} className="text-blue-500" />
                            </div>
                          )}

                          {selectedTile === `${category.id}-${stage.id}` && tileFurps.length > 0 && (
                            <div className="absolute z-10 top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-3">
                              <div className="font-medium mb-2">FURPS Items</div>
                              {tileFurps.map((furp, index) => (
                                <div key={index} className="mb-2 last:mb-0">
                                  <div className="text-sm">{furp.description}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-6 justify-end">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-500 rounded" />
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded" />
            <span className="text-sm">Current Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded" />
            <span className="text-sm">Future Stage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FurpsProgressionMatrix;
