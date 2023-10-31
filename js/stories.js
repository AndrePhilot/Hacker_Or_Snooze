"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  hidePageComponents();
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();

  /* Include code that will make the favorite
  stories that match between localStorage and the
  currentUser to be filled */
  fillStars();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-solid fa-trash-can hidden"></i>
        <i class="fa-regular fa-star hidden"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <br>
        <small class="story-author">by ${story.author}</small>
        <br>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/* Write a function in stories.js that is called when 
users submit the form. Pick a good name for it. This 
function should get the data from the form, call the 
.addStory method you wrote, and then put that new story 
on the page. */

async function submitNewStory(evt) {
  evt.preventDefault();

  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();

  await storyList.addStory(currentUser, {author, title, url});

  putStoriesOnPage();
  fillStars();

  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

/* Using the localStorage data on favorites, 
update the stories that are favorited to a filled
star */

function fillStars() {
  if (currentUser) {
    $('.fa-star').removeClass("hidden");
    const localArrayOfFavorites = localStorage.favorites.split(',');

    for (let i = 0; i < storyList.stories.length; i++) {
      if (localArrayOfFavorites.indexOf(storyList.stories[i].storyId) !== -1) {
        const starThatIsFav = $(`#${storyList.stories[i].storyId} > .fa-star`);
        starThatIsFav.removeClass('fa-regular');
        starThatIsFav.addClass('fa-solid');
        }
      }
  }
}

/* Generate a separate list of favorited stories. */

function putFavStoriesOnPage() {
  if (currentUser.favorites.length === 0) {
    $allStoriesList.empty();
    const $story = "No favorites added!";
    $allStoriesList.append($story);
    $allStoriesList.show();
  } else {
    $allStoriesList.empty();

    /* loop through all of the favorite stories and
    generate HTML for them */
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }

    $allStoriesList.show();
  }
}

/* Generate a separate list of stories created by
current user */

function putMyStoriesOnPage() {
  if (currentUser.ownStories.length === 0) {
    $allStoriesList.empty();
    const $story = "No stories added by user yet!";
    $allStoriesList.append($story);
    $allStoriesList.show();
  } else {
    $allStoriesList.empty();
    /* loop through all of my own stories and
    generate HTML for them */
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  
    $allStoriesList.show();
  }
}

async function deleteOwnStory(evt) {
  /* Declaring HTML element as constants based on
  a click event */
  const storyId = $(evt.target).parents()[0].id;

  /* Call deleteStory with the story Id associated
  with the trash can that was clicked */
  await storyList.deleteStory(storyId);

  /* Update My Stories Pages */
  putMyStoriesOnPage();
  fillStars();
  $('.fa-trash-can').removeClass("hidden");
}


$body.on('click', '.fa-trash-can', deleteOwnStory);