// Fetch the data from the randomuser API
fetch("https://randomuser.me/api/?results=12&nat=us")
  .then(res => res.json()) // Converts the string to json
  .then(data => createGallery(data.results)); // Calls the createGallery function

// Capitalizes the first letter of what ever string it is called on
const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
const employees = [];

// Creates the html for the gallery
function createGallery(data) {
  let galleryHTML = ``;

  // Loops over each user
  $.each(data, (index, item) => {
    const htmlCard = `
      <div class="card" id="${index}">
        <div class="card-img-container">
          <img class="card-img" src="${item.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${capitalize(item.name.first)} ${capitalize(item.name.last)}</h3>
          <p class="card-text">${item.email}</p>
          <p class="card-text cap">${capitalize(item.location.city)}, ${capitalize(item.location.state)}</p>
        </div>
      </div>
    `;

    // Adds each employee and the employee information to the employees array
    employees.push({
      image: item.picture.large,
      first: item.name.first,
      last: item.name.last,
      email: item.email,
      city: item.location.city,
      phone: item.phone,
      address: {
        street: item.location.street,
        state: item.location.state,
        postcode: item.location.postcode
      },
      id: index,
      html: htmlCard
    });

    galleryHTML += htmlCard;
  });

  // Appends the gallery html to #gallery
  $("#gallery").append(galleryHTML);

  $(".card").on("click", e => displayModalWindow(e));

  // Adds the search form
  $(".search-container").append(`
    <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `);

  // Submit event listener on the form
  $("form").on("submit", e => searchUsers(e));
}

// Searches through the users and displays them based on the search term
function searchUsers(e) {
  e.preventDefault();

  const search = $("#search-input").val().toLowerCase().trim();
  let html = "";

  // Loops through the array of employees
  $.each(employees, (index, item) => {
    const name = `${item.first} ${item.last}`.toLowerCase().trim();

    // Decides if the search term matches any part of the employee name
    if (name.indexOf(search) !== -1) {
      html += item.html;
    } else if (search === "") {
      html = "";
      $("#gallery").append(item.html);
      $(".card").on("click", e => displayModalWindow(e));
    }
  });

  if (html) {
    $("#gallery").html(html);
    $(".card").on("click", e => displayModalWindow(e));
  }
}

// Holds the code for displaying the modal window
function modalWindow(id) {
  // Loops through the employee cards
  $.each(employees, (index, employee) => {
    // If an employee if matches the clicked card
    if (id === employee.id) {
      // Append the modal
      $("body").append(`
        <div class="modal-container">
          <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
              <img class="modal-img" src="${employee.image}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${employee.first} ${employee.last}</h3>
              <p class="modal-text">${employee.email}</p>
              <p class="modal-text cap">${employee.city}</p>
              <hr>
              <p class="modal-text">${employee.phone}</p>
              <p class="modal-text">${capitalize(employee.address.street)}, ${capitalize(employee.address.state)} ${employee.address.postcode}</p>
              <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
          </div>

          <div class="modal-btn-container">
              <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
              <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
        </div>
      `);

      // Event listener for the close button on the modal window
      $(".modal-close-btn").on("click", () => $(".modal-container").remove());

      $("#modal-prev").on("click", () => {
        $(".modal-container").remove();
        modalWindow(id - 1);
      });

      $("#modal-next").on("click", () => {
        $(".modal-container").remove();
        modalWindow(id + 1);
      });
    }
  });
}

// Displays the modal window
function displayModalWindow(e) {
  let id = parseInt(e.currentTarget.id);

  modalWindow(id);
}
