// Globals
let employeeArray = [];
const numberOfUsers = 12;
const apiUrl = `https://randomuser.me/api/?results=${numberOfUsers}`;

const search = (function() {
  // TODO: Implement search feature.

  const searchContainerDiv = () => {
    return `<form action="#" method="get">
              <input type="search" id="search-input" class="search-input" placeholder="Search...">
              <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
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
  let employeeLastName = "";

  const getEmployeeLastName = employeeDiv => {
    return employeeDiv
      .querySelector("#name")
      .textContent.split(" ")
      .slice(1)
      .join();
  };

  const getEmployeeInfo = employeeName => {
    return R.prop(employeeName, employeeArray);
  };

  const getNeighboringEmployee = (employeeName, stepFunction) => {
    const employeeNames = R.keys(employeeArray);

    return R.pipe(
      R.findIndex(R.equals(employeeName)),
      stepFunction,
      index => employeeNames[index],
      lastName => (employeeLastName = lastName),
      getEmployeeInfo
    )(employeeNames);
  };

  const createModalElement = employee => {
    // TODO: Make this FP
    let modalDiv = document.querySelector(".modal-container");

    if (!modalDiv) {
      modalDiv = document.createElement("div");
      modalDiv.classList.add("modal-container");
    }

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

  const renderModalElement = modalElement => {
    document.body.appendChild(modalElement);

    return modalElement;
  };

  const addModalCloseEventListener = modal => {
    const closeBtn = document.getElementById("modal-close-btn");
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    return modal;
  };

  const addModalPrevEventListener = modal => {
    const prevBtn = document.getElementById("modal-prev");
    prevBtn.addEventListener("click", () => {
      const getPreviousEmployee = R.ifElse(
        R.equals(R.length(R.keys(employeeArray))),
        () => 0,
        index => R.subtract(index, 1)
      );

      createModal(
        getNeighboringEmployee(employeeLastName, getPreviousEmployee)
      );
    });

    return modal;
  };

  const addModalNextEventListener = modal => {
    const nextBtn = document.getElementById("modal-next");
    const getNextEmployee = R.ifElse(
      R.equals(R.length(R.keys(employeeArray))),
      () => 0,
      R.add(1)
    );

    nextBtn.addEventListener("click", () => {
      createModal(getNeighboringEmployee(employeeLastName, getNextEmployee));
    });

    return modal;
  };

  const createModal = R.pipe(
    createModalElement,
    renderModalElement,
    addModalCloseEventListener,
    addModalPrevEventListener,
    addModalNextEventListener
  );

  const openModal = R.pipe(
    e => e.target.closest(".card"),
    lastName => (employeeLastName = getEmployeeLastName(lastName)),
    getEmployeeInfo,
    createModal
  );

  return {
    openModal
  };
})();

const employees = (function() {
  const createEmployeeElement = employee => {
    const employeeCardDiv = document.createElement("div");
    employeeCardDiv.classList.add("card");

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

  const renderEmployees = R.pipe(
    R.map(createEmployeeElement),
    R.map(addEmployeeEventListener),
    R.map(renderEmployeeElement)
  );

  return {
    renderEmployees
  };
})();

const getData = (function() {
  /**
   * (Object a → String) → {k: {k: v}}
   *
   * @param {Object} responseJson
   * @returns {*}
   */
  const createEmployeeArr = responseJson => {
    return R.pipe(
      R.prop("results"),
      R.indexBy(R.path(["name", "last"]))
    )(responseJson);
  };

  const fetchEmployees = R.pipe(
    fetch(apiUrl)
      .then(response => response.json())
      .then(jsonData => (employeeArray = createEmployeeArr(jsonData)))
      .then(employees.renderEmployees)
  );

  return {
    fetchEmployees
  };
})();

getData.fetchEmployees();
search.render();
