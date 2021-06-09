/**
 * - Github graphql single api endpoint.
 */

window.addEventListener("hashchange", function () {
  console.log("hashchange event");
});

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const errorPanel = document.querySelector(".error__pane");

const form = document.querySelector(".username__form");
const input = document.querySelector(".username_input");
const button = document.querySelector(".username_button");
const loadingIndicator = document.querySelector(".loading");

function clearError() {
  errorPanel.innerHTML = "";
  errorPanel.classList.remove("is__error");
}

let userData = [];
let loading;

//async function to run our http request
async function getUserRepo(evt) {
  evt.preventDefault();
  const username = input.value;
  if (username === "") return;

  //add class to the loading indictor element
  loadingIndicator.classList.add("loading__indicator");

  //graphql query
  const data = {
    query: `
query GetUserGithubDetails($username: String!){
  user(login: $username) {  
    avatarUrl(size: 250)
    bio
    name
    login
    allRepos: repositories {
        totalCount
    }  
    repositories(privacy: PUBLIC, first: 20) {
      totalCount
      nodes {
        name
        description
        forkCount
        updatedAt
        stargazers {
          totalCount
        }
         languages(first: 1) {
          nodes {
            color
            name
          }
        }
        forks {
          totalCount
        }
      }
    }
    
  }
}
    `,
    variables: {
      username: `${username}`,
    },
  };

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "post",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer ${GITHUB_ACCESS_TOKEN}",
    },
    body: JSON.stringify(data),
  });

  /**
   * Execute the query, and await the response
   */
  const json = await response.json();

  /**
   * Check if the query produced errors, otherwise use the results
   */
  if (json.errors) {
    errorPanel.classList.add("is__error");
    errorPanel.innerHTML = `
        <p>${json.errors[0].message}</p> 
        <span onClick="clearError()" class="cancel__error">
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </span>
        `;
    loadingIndicator.classList.remove("loading__indicator");
    loadingIndicator.innerHTML = "";
  } else {
    userData.push(json.data);
    window.location.href = "profile.html";
    window.history.pushState(userData, "profile", "/profile.html");
    clearError();
    form.reset();
    loadingIndicator.classList.remove("loading__indicator");
    loadingIndicator.innerHTML = "";
  }
}

form.addEventListener("submit", getUserRepo);
