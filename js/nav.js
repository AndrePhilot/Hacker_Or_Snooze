"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();

  if (currentUser) {
    $mainNavLinks.show();
  }

  fillStars();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $mainNavLinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Write a function in nav.js that is called when 
 * users click that navbar link. Look at the other 
 * function names in that file that do similar 
 * things and pick something descriptive and 
 * similar. */

function navSubmitStoryClick() {
  hidePageComponents();
  $mainNavLinks.show();
  $submitForm.slideToggle(1000);
  $allStoriesList.show();
  fillStars();
}

$navSubmitStory.on("click", navSubmitStoryClick);

/* Allow logged in users to see a separate list of 
favorited stories. */

function navFavoritesClick() {
  $navFavorites.addClass('active');
  hidePageComponents();
  $mainNavLinks.show();
  putFavStoriesOnPage();
  fillStars();
}

$navFavorites.on('click', navFavoritesClick);

function navMyStoriesClick() {
  $navFavorites.removeClass('active');
  hidePageComponents();
  $mainNavLinks.show();
  putMyStoriesOnPage();
  fillStars();
  $('.fa-trash-can').removeClass("hidden");
}

$navMyStories.on('click', navMyStoriesClick);