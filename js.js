const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('input');
const suggBox = searchWrapper.querySelector('.auto-box');
const addedRepositories = document.getElementById('addedRepositories');

let debounceTimer;

inputBox.onkeyup = (e) => {
  clearTimeout(debounceTimer);
  let userData = e.target.value;
  let emptyArray = [];

  debounceTimer = setTimeout(async () => {
    if (userData.trim()) {
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${userData}&per_page=5`);
        const data = await response.json();
        console.log(data);
        emptyArray = data.items.map(repo => {
          return {
            name: repo.name,
            owner: repo.owner.login,
            stars: repo.stargazers_count
          };
        });

        emptyArray = emptyArray.map(data => {
          return '<li data-name="' + data.name + '" data-owner="' + data.owner + '" data-stars="' + data.stars + '">' + data.name;
        });

        searchWrapper.classList.add('active');
        showSuggestions(emptyArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      searchWrapper.classList.remove('active');
    }
  }, 500);
};

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = `<li>${userValue}</li>`;
  } else {
    listData = list.join('')
  }
  suggBox.innerHTML = listData;

  const deleteButtons = suggBox.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      this.parentElement.remove();
    });
  });

  const listItems = suggBox.querySelectorAll('li');
  listItems.forEach(item => {
    item.addEventListener('click', function() {
      const name = this.dataset.name;
      const owner = this.dataset.owner;
      const stars = this.dataset.stars;
      addRepositoryToList(name, owner, stars);
      inputBox.value = ''; 
      searchWrapper.classList.remove('active');
    });
  });
}

function addRepositoryToList(name, owner, stars) {
  const listItem = document.createElement('div');
  const btn = document.createElement('button');
  listItem.classList.add('repositorys');
  listItem.insertAdjacentHTML('beforeend', `<div><p>Name: ${name}</p> <p>Owner: ${owner}</p> <p>Stars: ${stars}</p></div> <button class="delete-btn"></button>`);
  addedRepositories.appendChild(listItem);

  const deleteButton = listItem.querySelector('.delete-btn');
  deleteButton.addEventListener('click', function() {
    listItem.remove();
  });
}


