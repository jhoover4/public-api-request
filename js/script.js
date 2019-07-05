// Globals
let employeeArray = [];
const numberOfUsers = 12;
const apiUrl = `https://randomuser.me/api/?results=${numberOfUsers}`;

const search = (function() {
  const searchContainerDiv = () => {
    return `<form action="#" method="get">
              <input type="search" id="search-input" class="search-input" placeholder="Search...">
              <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
          </form>`;
  };

  const renderSearchContainerDiv = markup => {
    const resultsElement = document.querySelector(".search-container");
    resultsElement.innerHTML = markup;
  };

  const render = renderSearchContainerDiv(searchContainerDiv());

  return {
    render
  };
})();

const employeeModal = (function() {
  const getEmployeeInfo = employeeDiv => {
    const employeeId = parseInt(employeeDiv.dataset.id);
    return employeeArray[employeeId];
  };

  const createModalElement = employee => {
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modal-container");

    modalDiv.innerHTML = `<div class="modal">
                  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                  <div class="modal-info-container">
                      <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                      <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                      <p class="modal-text">${employee.email}</p>
                      <p class="modal-text cap">${employee.location.city}</p>
                      <hr>
                      <p class="modal-text">${employee.phone}</p>
                      <p class="modal-text">${employee.location.street}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                      <p class="modal-text">Birthday: ${employee.dob.date}</p>
                  </div>
              </div>

              <div class="modal-btn-container">
                  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                  <button type="button" id="modal-next" class="modal-next btn">Next</button>
              </div>`;

    return modalDiv;
  };

  const renderModalElement = markup => {
    document.body.appendChild(markup);

    return markup;
  };

  const addModalCloseEventListener = () => {
    const closeBtn = document.getElementById("modal-close-btn");
    closeBtn.addEventListener("click", e => {
      e.target.closest(".modal-container").remove();
    });
  };

  const openModal = R.pipe(
    e => e.target.closest(".card"),
    getEmployeeInfo,
    createModalElement,
    renderModalElement,
    addModalCloseEventListener
  );

  return {
    openModal
  };
})();

const employees = (function() {
  const createEmployeeElement = (employee, index) => {
    const employeeCardDiv = document.createElement("div");
    employeeCardDiv.classList.add("card");
    employeeCardDiv.dataset.id = index;

    employeeCardDiv.innerHTML = `
            <div class="card-img-container">
                  <img class="card-img" src="${employee.picture.large}" alt="profile picture">
              </div>
              <div class="card-info-container">
                  <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                  <p class="card-text">${employee.email}</p>
                  <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
              </div>`;

    return employeeCardDiv;
  };

  const addEmployeeEventListener = employeeCard => {
    employeeCard.addEventListener("click", employeeModal.openModal);
    return employeeCard;
  };

  const renderEmployeeElement = employeeCard => {
    const galleryElement = document.getElementById("gallery");
    galleryElement.appendChild(employeeCard);

    return galleryElement;
  };

  const renderEmployeesFromApi = R.pipe(
    fetch(apiUrl)
      .then(response => response.json())
      .then(response => (employeeArray = response.results))
      .then(R.addIndex(R.map())(createEmployeeElement))
      .then(R.map(addEmployeeEventListener))
      .then(R.map(renderEmployeeElement))
  );

  return {
    renderEmployeesFromApi
  };
})();

search.render();
employees.renderEmployeesFromApi();
