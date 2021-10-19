/* === ELEMENT SELECTION === */
const body = document.querySelector("body");
const searchContainer = document.querySelector(".search-container");
const gallery = document.querySelector("#gallery");

const modalRight = document.querySelector("#modal-next");
const modalLeft = document.querySelector("#modal-prev");
const modalClose = document.querySelector("#modal-close-btn");

/* === VARIABLES === */
const employeeNum = 12;
const apiUrl = `https://randomuser.me/api/?results=${employeeNum}&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;

let employees = [];
let modalPlace = 0;


/* === FUNCTIONS === */
function checkStatus(response) {
    if (response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
 }

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log("There was a problem connecting to the server. Please try again later.", error))
}

function displayEmployees(data) {
    employees = data.results;
    employees.forEach((employee, index) => {
        const { name: { first, last }, email, location: { city, state }, picture: { large } } = employee; // deconstruction for each employee

        const employeeHTML = 
        `
            <div class='card' data-index='${index}'>
                <div class="card-img-container">
                    <img class='card-img' src='${large}' alt='a profile picture of ${first} ${last}'>
                </div>
                <div class='card-info-container'>
                    <h3 id="name" class="card-name cap">${first} ${last}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${city}, ${state}</p>
                </div>
            </div>
        `;

        gallery.insertAdjacentHTML("beforeend", employeeHTML);
    })
}

function displayModal(index){
    const { name: { first, last }, dob, phone, email, location: { street, city, state, postcode }, picture: { large } } = employees[index]; 
    const date = new Date(dob.date); // creates a new date object so we can call proper functions
    const formattedDate = dateFormat(date.getMonth()+1, date.getDate(), date.getFullYear());

    const modalHTML = 
    `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${first} ${last}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${street.name}, ${city}, ${state} ${postcode}</p>
                <p class="modal-text">Birthday: ${formattedDate}</p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `
    
    body.insertAdjacentHTML("beforeend",modalHTML); // insertAdjacentHTML is more efficient than innerHTML += 
}

function leadZero(num, length) {
    let dateString = num.toString();
    if (dateString.length < length) { dateString = "0" + dateString};
    return dateString;
}

function dateFormat( month, day, year ) {
    let format = leadZero( month , 2 ) + "/" + leadZero( day, 2 ) + "/" + year.toString();
    return format;
}

function updateModal(index) {
    const { name: { first, last }, dob, phone, email, location: { street, city, state, postcode }, picture: { large } } = employees[index]; 
    const info = document.querySelector(".modal-info-container");
    const date = new Date(dob.date);
    const formattedDate = dateFormat(date.getMonth()+1, date.getDate(), date.getFullYear());

    info.innerHTML = 
    `
        <img class="modal-img" src="${large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${first} ${last}</h3>
        <p class="modal-text">${email}</p>
        <p class="modal-text cap">${city}</p>
        <hr>
        <p class="modal-text">${phone}</p>
        <p class="modal-text">${street.name}, ${city}, ${state} ${postcode}</p>
        <p class="modal-text">Birthday: ${formattedDate}</p>
    `;
}

function deleteModal() {
    const modal = document.querySelector(".modal-container");
    modal.remove();
}

/* === FETCH === */
fetchData(apiUrl)
    .then(displayEmployees)
    .catch(error => console.log(error))


/* === INIT === */
searchContainer.innerHTML = 
` 
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`

/* === LISTENERS === */
gallery.addEventListener("click", (e) => {
    if (e.target.className != "gallery") {
        const card = e.target.closest(".card"); // .closest allows any element inside of the card to fire the event
        const index = card.getAttribute("data-index");
        modalPlace = parseInt(index);
        displayModal(index);
    }
});

document.addEventListener("click", (e) => { // event delegation
    const modalMax = employeeNum - 1; // since array starts at zero modalMax will always be one less than total Employees
    if (e.target.closest(".modal-close-btn")){
        deleteModal();
    } else if (e.target.id === "modal-next") {
        if (modalPlace === modalMax){
            modalPlace = 0;
        }
        else {
            modalPlace++;
        }
        updateModal(modalPlace);
    } else if (e.target.id === "modal-prev"){
        if (modalPlace === 0){
            modalPlace = modalMax;
        }
        else {
            modalPlace--;
        }
        updateModal(modalPlace);
    }
});

/* === SEARCH BAR === */

const searchBar = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-submit");

searchButton.addEventListener("click", () => {
    let allEmployees = document.querySelectorAll(".card-name");
    let search = searchBar.value.toLowerCase();

    allEmployees.forEach( employeeName => {
        if (!employeeName.textContent.toLowerCase().includes(search)) {
            employeeName.closest(".card").style.display = "none";
        } else { employeeName.closest(".card").style.display = "flex" }
    })
});