// Base URL for the API
const API_BASE_URL = 'http://localhost:8000/api/v1';


// Generic function to fetch movies
async function fetchMovies(URI, moviesListSize) {
    try {
        // Log the request we're making for debugging
        console.log(`Fetching movies from ${API_BASE_URL}${URI}, requesting ${moviesListSize}`);
        
        const response = await fetch(`${API_BASE_URL}${URI}`);
        const data = await response.json();
        
        // Log the raw response
        console.log('API response:', data);
        
        if (data.results && data.results.length > 0) {
            console.log(`Received ${data.results.length} movies from API`);
            
            // Check if we need to fetch more due to pagination
            let allResults = [...data.results];
            let nextPage = data.next;
            
            // If we don't have enough results and there's a next page, fetch more
            while (allResults.length < moviesListSize && nextPage) {
                console.log(`Fetching next page: ${nextPage}`);
                const nextResponse = await fetch(nextPage);
                const nextData = await nextResponse.json();
                allResults = [...allResults, ...nextData.results];
                nextPage = nextData.next;
            }
            
            // Get only the requested number of movies
            const movies = allResults.slice(0, moviesListSize);
            console.log(`After pagination, we have ${movies.length} movies`);
            
            // Fetch complete details for each movie
            const moviePromises = movies.map(movie => 
                fetch(`${API_BASE_URL}/titles/${movie.id}`)
                    .then(response => response.json())
            );
            
            return await Promise.all(moviePromises);
        }
        return [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Function to fetch best rated movie
async function fetchBestMovie() {
    try {
        // Use the generic fetchMovies function to get the best rated movie
        const movies = await fetchMovies('/titles/?sort_by=-imdb_score', 1);
        
        if (movies.length > 0) {
            // Update the DOM with the best movie details
            displayBestMovie(movies[0]);
        }
    } catch (error) {
        console.error('Error fetching best movie:', error);
    }
}

// Function to display the best movie in the featured section
function displayBestMovie(movie) {
    const featuredSection = document.querySelector('.featured-movie');
    
    // Update the content
    featuredSection.innerHTML = `
        <img src="${movie.image_url}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <button onclick="showMovieDetails(${movie.id})">Détails</button>
    `;
}

// Function to fetch next best rated movies
async function fetchNextBestMovies() {
    try {
        // Increase from 8 to 20 to ensure we get enough movies
        const movies = await fetchMovies('/titles/?sort_by=-imdb_score', 20); 
        
        if (movies.length > 0) {
            console.log(`Total movies fetched: ${movies.length}`);
            
            // Remove the first movie (already displayed in featured section) and take the next 6
            // If there aren't 7 movies, just skip the first and take whatever remains
            const nextMovies = movies.length >= 7 
                ? movies.slice(1, 7)  
                : movies.slice(1);
                
            console.log(`Displaying ${nextMovies.length} movies in the best rated section`);
            displayNextBestMovies(nextMovies);
        } else {
            console.warn("No movies returned from API");
        }
    } catch (error) {
        console.error('Error fetching next best movies:', error);
    }
}

// Function to display the next best movies in the grid
function displayNextBestMovies(movies) {
    const moviesGrid = document.querySelector('section:nth-of-type(2) .movies-grid');
    
    // Clear existing content
    moviesGrid.innerHTML = '';
    
    // Add each movie to the grid
    movies.forEach(movie => {
        const article = document.createElement('article');
        article.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='nopic.png';">
            <h3>${movie.title}</h3>
            <button onclick="showMovieDetails(${movie.id})">Détails</button>
        `;
        moviesGrid.appendChild(article);
    });
    
    // Debug information
    console.log(`Displaying ${movies.length} movies in the grid`);
}


// Function to display the next best movies in the grid
function displayCategory2Movies(movies) {
    const moviesGrid = document.querySelector('section:nth-of-type(3) .movies-grid');
    
    // Clear existing content
    moviesGrid.innerHTML = '';
    
    // Add each movie to the grid
    movies.forEach(movie => {
        const article = document.createElement('article');
        article.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}"  onerror="this.src='nopic.png';">
            <h3>${movie.title}</h3>
            <button onclick="showMovieDetails(${movie.id})">Détails</button>
        `;
        moviesGrid.appendChild(article);
    });
    
    // Debug information
    console.log(`Displaying ${movies.length} movies in the grid`);
}

// Function to display the next best movies in the grid
function displayCategory3Movies(movies) {
    const moviesGrid = document.querySelector('section:nth-of-type(4) .movies-grid');
    
    // Clear existing content
    moviesGrid.innerHTML = '';
    
    // Add each movie to the grid
    movies.forEach(movie => {
        const article = document.createElement('article');
        article.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='nopic.png';">
            <h3>${movie.title}</h3>
            <button onclick="showMovieDetails(${movie.id})">Détails</button>
        `;
        moviesGrid.appendChild(article);
    });
    
    // Debug information
    console.log(`Displaying ${movies.length} movies in the grid`);
}

async function fetchCategory1() {
    // const moviesGrid = document.querySelector('section:nth-of-type(3) .movies-grid');
    // moviesGrid.innerHTML = '';

    try {
        const movies = await fetchMovies('/titles/?sort_by=-imdb_score&genre=action', 6);
        
        if (movies.length > 0) {
            console.log(`Total action movies fetched: ${movies.length}`);
            displayCategory2Movies(movies);
        } else {
            console.warn("No action movies returned from API");
        }
    } catch (error) {
        console.error('Error fetching action movies:', error);
    }
}

async function fetchCategory2() {
    try {
        const movies = await fetchMovies('/titles/?sort_by=-imdb_score&genre=biography', 6);
        
        if (movies.length > 0) {
            console.log(`Total biography movies fetched: ${movies.length}`);
            displayCategory3Movies(movies);
        } else {
            console.warn("No biography movies returned from API");
        }
    } catch (error) {
        console.error('Error fetching biography movies:', error);
    }
}

// Function to check viewport width and log button visibility
function checkViewportAndButtons() {
  const viewportWidth = window.innerWidth;
  const buttons = document.querySelectorAll('.voir-plus-btn');
  
  console.log(`Viewport width: ${viewportWidth}px`);
  console.log(`Found ${buttons.length} "Voir plus" buttons`);
  
  buttons.forEach((button, index) => {
    const computedStyle = window.getComputedStyle(button);
    console.log(`Button ${index} display: ${computedStyle.display}`);
    
    // Force display if we're in tablet mode
    if (viewportWidth <= 768) {
      button.style.display = 'block';
      console.log(`Forced display for button ${index}`);
    }
  });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchBestMovie();
    fetchNextBestMovies();
    fetchCategory1();
    fetchCategory2();
    
    // Initialize modal
    initializeModal();
    
    // Initialize "Voir plus" buttons
    initializeVoirPlusButtons();
    
    // Check viewport and buttons
    checkViewportAndButtons();
});

// Listen for window resize events
window.addEventListener('resize', checkViewportAndButtons);

// Function to handle the "Voir plus" buttons
function initializeVoirPlusButtons() {
    const voirPlusButtons = document.querySelectorAll('.voir-plus-btn');
    
    voirPlusButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent section and its movies-grid
            const section = this.closest('section');
            const moviesGrid = section.querySelector('.movies-grid');
            
            // Toggle the class to show all movies
            moviesGrid.classList.toggle('show-all-movies');
            
            // Update button text based on viewport width
            const isMobile = window.innerWidth <= 480;
            const currentText = moviesGrid.classList.contains('show-all-movies');
            
            // Use appropriate wording
            if (currentText) {
                this.textContent = 'Voir moins';
            } else {
                this.textContent = 'Voir plus';
            }
            
            // Log for debugging
            console.log(`Button clicked: ${isMobile ? 'mobile' : 'tablet'} view, now ${currentText ? 'showing' : 'hiding'} additional movies`);
        });
    });
}

// Function to initialize modal functionality
function initializeModal() {
    // Get the modal
    var modal = document.getElementById("movie-modal");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close-button")[0];
    
    // Function to close the modal
    function closeModal() {
        console.log("Closing modal");
        modal.classList.remove("show");
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = closeModal;
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

// Function to show movie details and open modal
function showMovieDetails(movieId) {
    console.log('Show details for movie:', movieId);
    
    // Get the modal
    var modal = document.getElementById("movie-modal");
    
    // Open the modal
    modal.classList.add("show");
    
    // Set placeholder text (in a real app, you would fetch the movie details)
    document.getElementById("modal-text").innerText = 
        "Détails du film ID: " + movieId + "\nLorem ipsum dolor sit amet, consectetur adipiscing elit.";
}

// Get the modal
var modal = document.getElementById("movie-modal");

// Get the button that opens the modal
var detailsButtons = document.querySelectorAll(".details");

// Log the number of details buttons found
console.log(`Found ${detailsButtons.length} details buttons`);

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[0];

// Function to open the modal
function openModal() {
    console.log("Opening modal");
    modal.classList.add("show");
    document.getElementById("modal-text").innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
}

// Function to close the modal
function closeModal() {
    console.log("Closing modal");
    modal.classList.remove("show");
}

// When the user clicks on the button, open the modal
detailsButtons.forEach(function(button) {
    button.onclick = function(event) { // Add event parameter
        console.log("Details button clicked");
        event.preventDefault(); // Prevent default action
        openModal();
    };
});

// When the user clicks on <span> (x), close the modal
span.onclick = closeModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}