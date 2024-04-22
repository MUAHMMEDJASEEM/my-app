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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [numPlacesToVisit, setNumPlacesToVisit] = useState(3); // Default to 3 places
  const [shortestPath, setShortestPath] = useState([]);

  const findShortestPath = () => {
    const startingLocationIndex = locations.indexOf(selectedLocation);
    if (startingLocationIndex !== -1) {
      // Generate all permutations of locations except the starting location
      const permutationIndices = [...Array(locations.length).keys()].filter(index => index !== startingLocationIndex);
      const allPermutations = permute(permutationIndices);

      // Initialize the shortest distance and shortest path
      let minDistance = Infinity;
      let minPath = [];

      // Iterate through all permutations
      allPermutations.forEach((perm) => {
        // Insert the selected location index at the beginning
        const path = [startingLocationIndex, ...perm.slice(0, numPlacesToVisit - 1)]; // Add the starting location and the required number of places
        const totalDistance = calculateTotalDistance(path);
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          minPath = path;
        }
      });

      // Set the shortest path
      setShortestPath(minPath);
    } else {
      alert('Please select a valid location from the list.');
    }
  };

  // Function to format the output in the desired narrative-like format
  const formatPathDescription = (path) => {
    const formattedPath = [];
    for (let i = 0; i < path.length; i++) {
      const location = locations[path[i]];
      const nextLocation = locations[path[i + 1]] || 'Its Final Destination';

      formattedPath.push(
        <div>
          <div key={i} className="transition-card">
            <h3>{location}</h3>
            <div className="tt" style={{ position: 'relative' }}>
              <img
                src={`${process.env.PUBLIC_URL}/${location}.jpg`} // Use backticks for string interpolation
                alt={location}
                className="location-image"
              />
            </div></div>
          <div key={i} className="transition-card">
            <p>Next: {nextLocation}</p>
            <p>Distance: {calculateTotalDistance([path[i], path[i + 1]]) || 0} km</p>
          </div>
        </div>
      );
    }

    return formattedPath;
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Path Planner</h1>
      </nav>
      <div className="container">
        <div>
          Select a location
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
          <br />
          No of locations need to visit
          <select value={numPlacesToVisit} onChange={(e) => setNumPlacesToVisit(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
              <option key={index} value={num}>{num}</option>
            ))}
          </select>
          <button onClick={findShortestPath}>Find Best Path</button>
          {shortestPath.length > 0 && (
            <div className="path-container">
              <h2>Best Path from {selectedLocation}:</h2>
              <div className="path">{formatPathDescription(shortestPath)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
