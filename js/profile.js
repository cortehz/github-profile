//tabs for top navigation

//select all tab dom items/links
const tabs = document.querySelectorAll(".tabs li");

//select all tab link content
const sections = document.querySelectorAll(".nav__tabs__content .tab__content");

// click handler to all tabs that removes the current active tab and
// adds the currently clicked one as active
tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    removeActiveTab();
    addActiveTab(tab);
  });
});

//loop through tab links and content and remove the is__active class
const removeActiveTab = () => {
  tabs.forEach((tab) => {
    tab.classList.remove("is__active");
  });
  sections.forEach((section) => {
    section.classList.remove("is__active");
  });
};

//add active class to currently clicked one and match the href to the tab section
//href on each tab link maps to the id of the content then adds an is__active class to that element
const addActiveTab = (tab) => {
  tab.classList.add("is__active");
  const href = tab.querySelector("a").getAttribute("href");
  const matchingSection = document.querySelector(href);
  matchingSection.classList.add("is__active");
};

//using object destructuring to get needed data coming from our pushState in main.js
const { allRepos, avatarUrl, bio, login, name, repositories } =
  window.history.state[0].user;

const avatar = document.querySelector(".profile__avatar"),
  headerProfilehumbnail = document.querySelector(".profile__thumbnail"),
  fullName = document.querySelector(".user__name"),
  username = document.querySelector(".username"),
  userBio = document.querySelector(".user__bio"),
  allRepoCount = document.querySelector(".repo__total"),
  repoResultShowing = document.querySelector(".repos__showing"),
  repoDetailsContainer = document.querySelector(".repository__container");

avatar.src = avatarUrl;
headerProfilehumbnail.src = avatarUrl;
fullName.innerHTML = name;
username.innerHTML = login;
userBio.innerHTML = bio;
allRepoCount.innerHTML = allRepos.totalCount;
repoResultShowing.innerHTML = `<strong>${repositories.totalCount}</strong> results for <strong>public</strong> repositories`;

// showing repos logic
const repoList = repositories.nodes
  .map(({ name, description, stargazers, updatedAt, languages, forks }) => {
    return `<li class="repository__container_list">
      <div class="repo__detail">
        <a href="#">${name}</a>
        <p class="repo__description">${description ? description : ""}</p>
        <span class="repo__tags">
          <div class="tag">
          <span class="language__color" style="background: ${
            languages.nodes.length ? languages.nodes[0].color : ""
          }">
          </span>
          ${languages.nodes.length ? languages.nodes[0].name : ""}
          </div>
          <div class="tag">
          <img alt="star icon for stars count" src="/assets/images/star-regular.svg"/>
          ${stargazers.totalCount}
          </div>
           <div class="tag">
          ${forks.totalCount}
          </div>
          <div class="tag">
          ${updatedAt}
          </div>
        </span>
      </div>
      <button class="star__button"> <img alt="star icon for stars count" src="/assets/images/star-regular.svg"/> star</button>
    </li>`;
  })
  .join("");

repoDetailsContainer.innerHTML = repoList;
