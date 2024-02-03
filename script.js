let timer = null;
let time = 0;

// Planet Info
document.getElementById('planetName').addEventListener('input', function(e) {
  document.getElementById('planetNameDisplay').textContent = e.target.value;
});

let planet = getInitialPlanetState();
const MAX_RESOURCES = 1000000; // Assuming 100 is the max resources your planet can have

function getInitialPlanetState() {
  return {
    resources: 1000000,
  };
}

function resetPlanet() {
    planet.resources = MAX_RESOURCES;
    document.getElementById('resources').textContent = planet.resources.toFixed(2);
    document.getElementById('healthBar').style.width = '100%'; // Reset health bar width
}







//Species Info
function getInitialSpeciesState() {
  return {
    population: 2,
    consumeRate: 0.05,
    reproduceRate: 1.1,
  };
}

let species = getInitialSpeciesState();

function updateSpeciesInfo() {
  document.getElementById('speciesPopulation').textContent = species.population.toFixed(2);
  document.getElementById('consumeRate').textContent = species.consumeRate.toFixed(2);
  document.getElementById('reproduceRate').textContent = species.reproduceRate.toFixed(2);
}

// Call this function as soon as the page loads
updateSpeciesInfo();











//Buttons
document.getElementById('playButton').addEventListener('click', function() {
  if (!timer) {
    timer = setInterval(function() {
      time++;
      document.getElementById('time').textContent = time;
      updateGame(); // Update game state each second
    }, 1000);
  }
});

document.getElementById('pauseButton').addEventListener('click', function() {
  clearInterval(timer);
  timer = null;
});

document.getElementById('restartButton').addEventListener('click', function() {
  clearInterval(timer);
  timer = null;
  time = 0;
  document.getElementById('time').textContent = time;

  // Reset species and planet to their initial states
  species = getInitialSpeciesState();
  planet = getInitialPlanetState();

  // Update the UI to reflect the reset state
  document.getElementById('speciesPopulation').textContent = species.population.toFixed(2);
  document.getElementById('resources').textContent = planet.resources.toFixed(2);
  resetPlanet();
  
  document.getElementById('depletionTime').textContent = calculateProjectedDepletionTime();
});



//Projection Data
function calculateProjectedDepletionTime() {
    let tempPopulation = species.population;
    let tempResources = planet.resources;
    let timeUnits = -1;

    while (tempResources > 0) {
        tempResources -= tempPopulation * species.consumeRate;
        tempPopulation *= species.reproduceRate;
        timeUnits++;

        if (timeUnits > 10000) { // Safety break to avoid infinite loops
            return "Extremely long";
        }
    }

    return timeUnits;
}






//Game Timing Calculation
function updateGame() {
  // Calculate new population
  species.population *= species.reproduceRate;
  document.getElementById('speciesPopulation').textContent = species.population.toFixed(2);

  // Calculate resources consumed
  let resourcesConsumed = species.population * species.consumeRate;
  planet.resources -= resourcesConsumed;
  document.getElementById('resources').textContent = planet.resources.toFixed(2);

  // Check for negative resources
  if (planet.resources <= 0) {
    clearInterval(timer);
    alert("Planet's resources depleted! Game Over.");
  }
  
  // Update health bar width
    let healthBarWidth = (planet.resources / MAX_RESOURCES) * 100;
    healthBarWidth = Math.max(0, Math.min(100, healthBarWidth)); // Ensure it's between 0% and 100%
    document.getElementById('healthBar').style.width = healthBarWidth + '%';
    
    // Update projected depletion time
    let projectedTime = calculateProjectedDepletionTime();
    document.getElementById('depletionTime').textContent = projectedTime;


}

