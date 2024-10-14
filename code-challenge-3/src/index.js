document.addEventListener('DOMContentLoaded', () => {
    fetchAllMovies();
});
function fetchAllMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(allMovies => {
            console.log(allMovies)
            renderMovieList(allMovies);
            if (allMovies.length > 0) {
                fetchMovieDetails(allMovies[0].id);
            }
        });
}
// movie details
function fetchMovieDetails(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(selectedMovie => {
            console.log(selectedMovie)
            displayMovieDetails(selectedMovie);
        });
}
//displaymovie details
function displayMovieDetails(film) {
    const currentCapacity = film.capacity;
    const ticketsSold = film.tickets_sold; 
    const availableTickets = currentCapacity - ticketsSold;
//poster
    const posterImage = document.querySelector('#poster');
    posterImage.src = film.poster;
    console.log(film.poster);
//title
    const filmTitle = document.querySelector('#title');
    filmTitle.textContent = film.title;
    console.log(film.title);
//runtime
    const filmDuration = document.querySelector('#runtime');
    filmDuration.textContent = `${film.runtime} minutes`;
    console.log(film.runtime);
// film info
    const filmDescription = document.querySelector('#film-info');
    filmDescription.textContent = film.description;
    console.log(film.description);
// showtime
    const movieShowdown = document.querySelector('#showtime');
    movieShowdown.textContent = film.showtime;
    console.log(film.showtime)
   // ticket num 
    const availableTicketCount = document.querySelector('#ticket-num');
    availableTicketCount.textContent = `${availableTickets} remaining tickets`;
    console.log(availableTicketCount);
// buy ticket
    const purchaseTicketButton = document.querySelector('#buy-ticket');
    purchaseTicketButton.disabled = availableTickets <= 0;
    if (availableTickets > 0) {
        purchaseTicketButton.textContent = 'Buy Ticket';
    } else {
        purchaseTicketButton.textContent = 'Sold Out';
    }
       
    purchaseTicketButton.dataset.filmId = film.id;
    purchaseTicketButton.onclick = () => {
        purchaseTicket(purchaseTicketButton.dataset.filmId);
    };
}
// render movie list
function renderMovieList(films) {
    const filmList = document.querySelector('#films');
    filmList.textContent = ''; 

    films.forEach(film => {
        const listItem = document.createElement('li');
        listItem.className = "film item";
        listItem.textContent = film.title;
        listItem.dataset.id = film.id;

        listItem.addEventListener("click", () => {
            fetchMovieDetails(film.id);
        });

        filmList.appendChild(listItem);
    });
}
// purchase ticket
function purchaseTicket(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            if (film.tickets_sold < film.capacity) {
                film.tickets_sold++;

                return fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tickets_sold: film.tickets_sold }),
                });
            } else {
                alert("No more tickets available!");
            }
        })
        .then(() => {
            fetchMovieDetails(filmId);
        })
}