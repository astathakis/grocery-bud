// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
//submit form
form.addEventListener('submit', addItem);
//clear items
clearBtn.addEventListener('click', clearItems);
//load items from localstorage when app opens up
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  //not in use as pro just a trick to add ids to items
  const id = new Date().getTime().toString();
  //shortcut with truthy falsy values
  if (value && !editFlag) {
    createListItem(id, value);
    //display alert
    displayAlert('item added to the list', 'success');
    //show container
    container.classList.add('show-container');
    //add to local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
    // console.log('adding');
  } else if (value && editFlag) {
    // doing the opposite of paragraph of item to value
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    //edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    // console.log('empty');
    displayAlert('please enter value', 'danger');
  }
}

//dispaly alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
//clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}
//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'edit';
}
//delete function
function deleteItem(e) {
  //targeting grocery-list
  const element = e.currentTarget.parentElement.parentElement;
  //unique identifier for each item
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('item removed', 'success');
  setBackToDefault();
  //remove from local storage
  removeFromLocalStorage(id);
}
// set back to default
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  //const grocery ={id:id,value:value}
  //ES6 short if names match
  const grocery = { id, value };
  //simply ternary
  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));

  //   console.log('added to local storage');
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id == id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

//local storage API from browser application tab
//setItem,getItem,removeItem
//gotcha save as strings use json.sringfy and json.parse methods
//saved values when app is closed
// localStorage.setItem('orange', JSON.stringify(['item', 'item2']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// localStorage.removeItem('fruits');
// localStorage.removeItem('friends');
// localStorage.removeItem('orange');
// console.log(oranges);

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  //add class
  element.classList.add('grocery-item');
  //and unique id dataset
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  //you can try this with bubbling the parent grocery-list as well
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');

  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  //apend child
  list.appendChild(element);
}
