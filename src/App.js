import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

// Distance matrix representing the distances between locations (in km)
const DistanceMatrix = [
  [0, 1, 4, 14, 21, 4, 10, 17],
  [1, 0, 4, 14, 21, 4, 10, 17],
  [4, 4, 0, 10, 21, 2, 7, 13],
  [14, 14, 10, 0, 27, 10, 10, 8],
  [21, 21, 21, 27, 0, 21, 20, 26],
  [4, 4, 2, 10, 21, 0, 6, 13],
  [10, 10, 7, 10, 20, 6, 0, 8],
  [17, 17, 13, 8, 26, 13, 8, 0]
];

const locations = [
  'Fort Kochi', 'Santa Cruz Basilica & Kerala Kathakali Centre',
  'Marine Drive & Broadway MetharBazar', 'Hill Palace Museum',
  'Cherai Beach', 'Mangalavanam Bird Sanctuary', 'Lulumall Kochi',
  'Wonderla Amusement Park'
];

// Function to calculate the total distance of a path
const calculateTotalDistance = (path) => {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += DistanceMatrix[path[i]][path[i + 1]];
  }
  return totalDistance;
};

// Function to generate all permutations of a given array
const permute = (arr) => {
  const result = [];

  const permuteHelper = (arr, startIndex) => {
    if (startIndex === arr.length - 1) {
      result.push([...arr]);
      return;
    }

    for (let i = startIndex; i < arr.length; i++) {
      [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]]; // Swap elements
      permuteHelper(arr, startIndex + 1);
      [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]]; // Restore the original order
    }
  };

  permuteHelper(arr, 0);
  return result;
};

const App = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);

  const handleLocationClick = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  const findShortestPath = () => {
    const selectedIndices = selectedLocations.map((loc) => locations.indexOf(loc));
    if (selectedIndices.length > 1) {
      // Generate all permutations of the selected locations
      const allPermutations = permute(selectedIndices);

      // Initialize the shortest distance and shortest path
      let minDistance = Infinity;
      let minPath = [];

      // Iterate through all permutations
      allPermutations.forEach((perm) => {
        const totalDistance = calculateTotalDistance(perm);
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          minPath = perm;
        }
      });

      // Set the shortest path
      setShortestPath(minPath);
    } else {
      alert('Please select at least two locations.');
    }
  };

  // Function to format the output in the desired narrative-like format
  const formatPathDescription = (path) => {
    const formattedPath = [];
    const averageSpeed = 25; // Average speed in km/h

    for (let i = 0; i < path.length; i++) {
      const location = locations[path[i]];
      const nextLocation = locations[path[i + 1]] || 'Its Final Destination';
      const distance = i < path.length - 1 ? DistanceMatrix[path[i]][path[i + 1]] : 0;
      const timeInHours = distance / averageSpeed;
      const timeInMinutes = timeInHours * 60; // Convert hours to minutes

      formattedPath.push(
        <div key={i} className="transition-card">
          <h3>{location}</h3>
          <div className="tt" style={{ position: 'relative' }}>
            <img
              src={`${process.env.PUBLIC_URL}/${location}.jpg`} // Use backticks for string interpolation
              alt={location}
              className="location-image"
            />
          </div>
          {i < path.length - 1 && (
            <div className="transition-card">
              <p>
                Distance to {nextLocation}: {distance} km
              </p>
              <p>
                Approximate Time: {timeInMinutes.toFixed(0)} minutes
              </p>
            </div>
          )}
        </div>
      );
    }
    return formattedPath;
  };

  return (
    <div>
      <div className="navbar">
        <h1>Kochi Tourist Route Planner</h1>
      </div>
      <div className="container">
        <h2>Select Locations to Visit</h2>
        <div className="locations-grid">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`location-card ${selectedLocations.includes(location) ? 'selected' : ''}`}
              onClick={() => handleLocationClick(location)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/${location}.jpg`} // Use backticks for string interpolation
                alt={location}
                className="location-image"
              />
              <p>{location}</p>
            </div>
          ))}
        </div>
        <button onClick={findShortestPath}>Find Best Path</button>
        {shortestPath.length > 0 && (
          <div className="path-container">
            <h2>Best Path to Follow</h2>
            <div className="path">
              {formatPathDescription(shortestPath)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
