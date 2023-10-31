"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  saveUserFavoritesInLocalStorage()
  updateUIOnUserLogin();
  fillStars();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  saveUserFavoritesInLocalStorage()
  updateUIOnUserLogin();
  fillStars();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {  
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/* Storing the currentUser favorites in localStorage
so when the page is refreshed (or the user revisits
the site later), they will still be marked as a
favorite story */
function saveUserFavoritesInLocalStorage() {
  if (currentUser) {
    localStorage.setItem("favorites", currentUser.favorites.map(favorite => favorite.storyId));
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  hidePageComponents();

  $allStoriesList.show();
  $('.fa-star').removeClass("hidden");

  updateNavOnLogin();
}

/* Toggle: adds a story to favorites and triggers
  a function that will change the star to indicate
  it was added to favorites */

async function toggleFavorite(evt) {

  /* Declaring some HTML elements that were clicked
  as a constant */
  const starClicked = $(evt.target);
  const storyId = $(evt.target).parents()[0].id;
  
if (starClicked.hasClass('fa-regular')) {

    /* Call addFavorites with the current user and
    the story Id associated with the star that was
    clicked */
    await currentUser.addFavorites(currentUser, storyId);

    /* Code that will change the star to
    indicate it was added to favorites */
    starClicked.removeClass('fa-regular');
    starClicked.addClass('fa-solid');

    // Update localStorage
    saveUserFavoritesInLocalStorage()

  } else {

    /* Call deleteFavorites with the current user 
    and the story Id associated with the star that 
    was clicked */
    await currentUser.deleteFavorites(currentUser, storyId);

    /* Code that will change the star to
    indicate it was deleted from favorites */
    starClicked.removeClass('fa-solid');
    starClicked.addClass('fa-regular');

    /* Remove the story element from the favorites
    list in the DOM */
    if($navFavorites.hasClass('active')) {
    $(`#${storyId}`).remove();
    }

    // Update localStorage
    saveUserFavoritesInLocalStorage()
  }

  /* If all stories are deleted, show a message */
  const listItems = document.querySelectorAll('li');

  if (listItems.length === 0) {
    $allStoriesList.empty();
    const $story = "No favorites added!";
    $allStoriesList.append($story);
    $allStoriesList.show();
  }
}

$body.on('click', '.fa-star', toggleFavorite);