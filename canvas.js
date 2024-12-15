const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

let animationProgress = 0; // Progress of the animation (0 to 1)
const animationDuration = 2000; // Animation duration in milliseconds
let startTime = null; // To track animation start time

let angle = 0; // Used for the floating effect

// Resize canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Easing function for ease-out effect
function easeOutQuad(t) {
    return t * (2 - t); // Quadratic easing out
}

// Draw the splash effect
function drawSplash(animatedRadius, offsetX = 0, offsetY = 0, scale = 1) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a radial gradient
    const gradient = ctx.createRadialGradient(
        offsetX + canvas.width * 0.1, // Moving X position
        offsetY + canvas.height * 0.1, // Moving Y position
        100, // Start radius
        offsetX + canvas.width * 0.1, 
        offsetY + canvas.height * 0.1, 
        animatedRadius * scale // End radius
    );
    gradient.addColorStop(0.2, "#9BC19F"); // Bright green in the center
    gradient.addColorStop(0.3, "rgba(133,171,147,255)"); // Intermediate softer green
    gradient.addColorStop(1, "rgba(9, 33, 73, 0.5)"); // Semi-transparent blue

    // Adjust gradient to a smaller height
    ctx.save(); // Save the current context state
    ctx.scale(1, 0.8); // Scale height to 80%
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 0.8); // Adjust fill to compensate for scaling
    ctx.restore(); // Restore the original context state
}

// Animate the splash gradient
function animateSplash(timestamp) {
    if (!startTime) startTime = timestamp; // Record the start time
    const elapsedTime = timestamp - startTime; // Calculate elapsed time
    const rawProgress = Math.min(elapsedTime / animationDuration, 1); // Normalize progress (0 to 1)

    animationProgress = easeOutQuad(rawProgress); // Apply ease-out easing

    const maxRadius = canvas.width * 0.5; // Maximum gradient radius (ensure this matches expectations)
    const animatedRadius = 100 + (maxRadius - 100) * animationProgress; // Interpolate radius

    drawSplash(animatedRadius); // Draw the splash with the animated radius

    if (rawProgress < 1) {
        requestAnimationFrame(animateSplash); // Continue animation until complete
    } else {
        // Start the continuous floating animation after expansion completes
        requestAnimationFrame(() => floatingSplash(maxRadius)); // Pass the maxRadius
    }
}

// Continuous floating animation after the initial expansion
function floatingSplash(maxRadius) {
    // Floating effect calculations
    const offsetX = 0; // Keep the horizontal position fixed
    const offsetY = Math.sin(angle) * 15; // Subtle vertical floating
    const scale = 1 + Math.sin(angle) * 0.03; // Scale slightly smaller but never exceed the original size

    drawSplash(maxRadius, offsetX, offsetY, scale); // Keep the splash floating and scaling

    angle += 0.01; // Increment the angle for smooth animation

    requestAnimationFrame(() => floatingSplash(maxRadius)); // Loop the animation
}

// Listen for window resize to redraw the canvas
window.addEventListener("resize", resizeCanvas);

// Initial draw and animation
resizeCanvas();
requestAnimationFrame(animateSplash);


// Function to toggle the burger menu
function toggleMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.classList.toggle('show'); // Toggle the 'show' class
}

function applySorting(genreButtons, elements, genreAttribute) {
    genreButtons.forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");

            const activeGenres = Array.from(genreButtons)
                .filter((btn) => btn.classList.contains("active"))
                .map((btn) => btn.textContent.trim());

            elements.forEach((element) => {
                const genres = element.dataset[genreAttribute]
                    ? element.dataset[genreAttribute].split(",").map((g) => g.trim())
                    : [];

                if (
                    activeGenres.length === 0 || 
                    activeGenres.some((genre) => genres.includes(genre))
                ) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }
            });

            // Reapply button functionality after filtering
            reapplyButtonFunctionality();
        });
    });
}

function reapplyButtonFunctionality() {
    // Handle "Følg" button toggle
    const følgButtons = document.querySelectorAll('.følg-button');
    følgButtons.forEach(button => {
        button.removeEventListener('click', toggleFollow); // Prevent duplicate listeners
        button.addEventListener('click', toggleFollow);
    });

    // Handle "Afspil" button toggle
    const afspilButtons = document.querySelectorAll('.afspil-button');
    afspilButtons.forEach(button => {
        button.removeEventListener('click', togglePlay); // Prevent duplicate listeners
        button.addEventListener('click', togglePlay);
    });
}

function toggleFollow(event) {
    const button = event.currentTarget;
    button.classList.toggle('following');
    if (button.classList.contains('following')) {
        button.textContent = 'Følger';
        button.style.background = 'transparent';
        button.style.border = '1px solid white';
        button.style.color = 'white';
    } else {
        button.textContent = 'Følg';
        button.style.background = '#9BC19F';
        button.style.border = 'none';
        button.style.color = '#ffffff';
    }
}

function togglePlay(event) {
    const button = event.currentTarget;
    button.classList.toggle('paused');
    if (button.classList.contains('paused')) {
        button.innerHTML = 'Pause <i class="material-icons">pause</i>';
    } else {
        button.innerHTML = 'Afspil <i class="material-icons">play_arrow</i>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Artist Page
    const artistGenreButtons = document.querySelectorAll(".genre-btn");
    const artistCards = document.querySelectorAll(".new-artist-card");
    if (artistCards.length > 0) {
        applySorting(artistGenreButtons, artistCards, "genre");
    }

    // Event Page
    const eventGenreButtons = document.querySelectorAll(".genre-btn");
    const eventSections = document.querySelectorAll(".event-cards-section");
    if (eventSections.length > 0) {
        applySorting(eventGenreButtons, eventSections, "genre");
    }

    // Apply button functionality initially
    reapplyButtonFunctionality();
});
