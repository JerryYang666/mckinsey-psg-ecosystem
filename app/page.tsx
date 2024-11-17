//@ts-nocheck
"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EcosystemSimulator = () => {
  const initialSpecies = Array(8).fill().map(() => ({
    name: '',
    calProvided: 0,
    calNeeded: 0,
    eats: '',
    isDead: false,
    hasEatenThisStep: false
  }));

  const [species, setSpecies] = useState(initialSpecies);
  const [stepHistory, setStepHistory] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newSpecies = [...species];
    newSpecies[index] = { ...newSpecies[index], [field]: value };
    setSpecies(newSpecies);
  };

  const handleSaveInitialValues = () => {
    setInitialValues(species.map(s => ({...s})));
  };

  const handleReset = () => {
    if (initialValues) {
      setSpecies(initialValues.map(s => ({...s, isDead: false, hasEatenThisStep: false})));
      setStepHistory([]);
    }
  };

  const findHighestCalorieProvider = () => {
    return species
      .map((s, index) => ({ ...s, index }))
      .filter(s => !s.isDead && !s.hasEatenThisStep && s.calNeeded > 0)
      .reduce((max, current) => 
        (current.calProvided > max.calProvided) ? current : max,
        { calProvided: -1, index: -1 });
  };

  const findHighestCalorieFoodSources = (eater) => {
    const foodSources = eater.eats.split(',').map(name => name.trim());
    const availableSources = species
      .map((s, index) => ({ ...s, index }))
      .filter(s => !s.isDead && foodSources.includes(s.name));
    
    if (availableSources.length === 0) return [];
    
    const maxCalProvided = Math.max(...availableSources.map(s => s.calProvided));
    return availableSources.filter(s => s.calProvided === maxCalProvided);
  };

  const runOneStep = () => {
    const newSpecies = [...species];
    
    // Reset hasEatenThisStep for all species
    newSpecies.forEach(s => s.hasEatenThisStep = false);
    
    // Find the species with highest calories provided that hasn't eaten
    const eater = findHighestCalorieProvider();
    if (eater.index === -1) return; // No valid eaters found
    
    // Find its food sources with highest calories
    const foodSources = findHighestCalorieFoodSources(eater);
    if (foodSources.length === 0) return; // No valid food sources found
    
    // Calculate how much each food source will provide
    const caloriesNeededPerSource = eater.calNeeded / foodSources.length;
    
    // Process eating
    foodSources.forEach(source => {
      const newCalProvided = Math.max(0, source.calProvided - caloriesNeededPerSource);
      newSpecies[source.index] = {
        ...newSpecies[source.index],
        calProvided: newCalProvided,
        isDead: newCalProvided === 0
      };
    });
    
    // Update eater
    newSpecies[eater.index] = {
      ...newSpecies[eater.index],
      calNeeded: Math.max(0, eater.calNeeded - (caloriesNeededPerSource * foodSources.length)),
      hasEatenThisStep: true
    };
    
    setSpecies(newSpecies);
    setStepHistory([...stepHistory, {
      eater: eater.name,
      foodSources: foodSources.map(s => s.name),
      caloriesConsumed: caloriesNeededPerSource * foodSources.length
    }]);
  };

  const FoodChainDisplay = () => (
    <div className="fixed top-2 right-2 w-[600px] h-[90vh] border rounded-lg bg-white p-6">
      <div className="absolute top-2 right-2 flex gap-2">
        <Button 
          onClick={handleReset}
          variant="outline"
        >
          Reset
        </Button>
        <Button 
          onClick={runOneStep}
        >
          Run One Step
        </Button>
      </div>
      <h3 className="text-lg font-bold mb-8">Food Chain Display</h3>
      <div className="h-[50vh] flex flex-col justify-between">
        {/* Top row - Animals 1 & 2 */}
        <div className="flex justify-around mb-2">
          {[0, 1].map(index => (
            <Card key={index} className={`w-64 h-48 p-4 ${species[index].isDead ? 'bg-red-200' : 'bg-yellow-100'}`}>
              <CardContent className="p-0">
                <div className="text-xs font-bold">Animal #{index + 1}</div>
                <div className="text-sm font-medium">{species[index].name || 'Unnamed'}</div>
                <div className="text-xs mt-1">Provides: {species[index].calProvided || 0} cal</div>
                <div className="text-xs">Needs: {species[index].calNeeded || 0} cal</div>
                <div className="text-xs truncate">Eats: {species[index].eats || 'None'}</div>
                {species[index].hasEatenThisStep && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Has eaten this step
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Middle row - Animals 3, 4, 5 */}
        <div className="flex justify-around mb-2">
          {[2, 3, 4].map(index => (
            <Card key={index} className={`w-56 h-44 p-4 ${species[index].isDead ? 'bg-red-200' : 'bg-yellow-100'}`}>
              <CardContent className="p-0">
                <div className="text-sm font-bold mb-2">Animal #{index + 1}</div>
                <div className="text-base font-medium mb-2">{species[index].name || 'Unnamed'}</div>
                <div className="text-sm mt-2">Provides: {species[index].calProvided || 0} cal</div>
                <div className="text-sm">Needs: {species[index].calNeeded || 0} cal</div>
                <div className="text-sm mt-1">Eats: {species[index].eats || 'None'}</div>
                {species[index].hasEatenThisStep && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Has eaten this step
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom row - Producers */}
        <div className="flex justify-around">
          {[5, 6, 7].map(index => (
            <Card key={index} className={`w-48 h-40 p-4 ${species[index].isDead ? 'bg-red-200' : 'bg-green-100'}`}>
              <CardContent className="p-0">
                <div className="text-sm font-bold mb-2">Producer #{index - 4}</div>
                <div className="text-base font-medium mb-2">{species[index].name || 'Unnamed'}</div>
                <div className="text-sm mt-2">Provides: {species[index].calProvided || 0} cal</div>
                <div className="text-sm">Needs: {species[index].calNeeded || 0} cal</div>
                <div className="text-sm mt-1">Eats: {species[index].eats || 'None'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Step History */}
      <div className="fixed bottom-2 right-1/2 w-72 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4 border">
        <h4 className="text-sm font-bold mb-2">Step History</h4>
        <div className="space-y-2">
          {stepHistory.map((step, index) => (
            <div key={index} className="text-xs bg-white p-2 rounded border">
              <strong>{step.eater}</strong> ate {step.caloriesConsumed.toFixed(1)} calories from{' '}
              {step.foodSources.join(' and ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className="p-2 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ecosystem Builder</h2>
          <Button 
            onClick={handleSaveInitialValues}
            variant="outline"
            className="text-sm"
          >
            Save Initial Values
          </Button>
        </div>
        <div className="space-y-2">
          {species.map((species, index) => (
            <Card key={index} className={`p-2 ${index < 5 ? 'bg-yellow-100' : 'bg-green-100'}`}>
              <CardContent className="space-y-1 p-0">
                <div className="text-xs font-medium">
                  {index < 5 ? 'Animal' : 'Producer'} #{index + 1}
                </div>
                <div className="space-y-1">
                  <div>
                    <label className="block text-xs font-medium">Name:</label>
                    <input
                      type="text"
                      value={species.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Calories Provided:</label>
                    <input
                      type="number"
                      value={species.calProvided}
                      onChange={(e) => handleInputChange(index, 'calProvided', parseFloat(e.target.value))}
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Calories Needed:</label>
                    <input
                      type="number"
                      value={species.calNeeded}
                      onChange={(e) => handleInputChange(index, 'calNeeded', parseFloat(e.target.value))}
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">What I Eat:</label>
                    <input
                      type="text"
                      value={species.eats}
                      onChange={(e) => handleInputChange(index, 'eats', e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <FoodChainDisplay />
    </div>
  );
};

export default EcosystemSimulator;