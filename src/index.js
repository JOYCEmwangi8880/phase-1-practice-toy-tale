let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Function to fetch toy data from the API
function fetchRequest() {
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((data) => {
      addNewToy(data);
    });
}

// Function to append toy information to the DOM
const appendImage = (toy) => {
  let number = toy.likes;
  card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${number} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);
  likeBtn = document.getElementById(`${toy.id}`);
  likeBtn.addEventListener("click", function () {
    updateCount(toy.id, number);
  });
};

// Function to add new toys to the DOM
function addNewToy(toys) {
  toys.map(appendImage);
}

// Event listener for the toy submission form
const form = document.getElementsByClassName("add-toy-form")[0];
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get toy name and image URL from the form
  let name = form[0].value;
  let imageSrc = form[1].value;

  // Create a new toy
  createToy(name, imageSrc);
});

// Function to create a new toy and send it to the API
function createToy(name, url) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: `${name}`,
      image: `${url}`,
      likes: 4,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      appendImage(data);
    });
}

// Function to update the like count of a toy
function updateCount(num, likesMade) {
  // Update the like count displayed on the card
  card.querySelector("p").textContent = `${likesMade++} Likes`;

  // Send a PATCH request to update the like count in the API
  fetch(`http://localhost:3000/toys/${num}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: likesMade,
    }),
  })
    .then(resp => resp.json())
    .then((data) => {
      console.log(data.likes);
    });
}
