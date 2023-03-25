window.onload = (event) => {
      const token = localStorage.getItem("token")
      console.log(token)
    const routes = [
        { path: "/", handler: homeHandler },
        { path: "/index.html", handler: homeHandler },
        { path: "/login.html", handler: loginHandler },
        { path: "/signup.html", handler: signupHandler },
    ]

    handleRoutes();

    function handleRoutes () {
        const currentPath = window.location.pathname;
        const routeData = routes.find(route => route.path === currentPath);

        if (routeData) {
            routeData.handler();
        } else {
            homeHandler();
        }
    }

    function homeHandler () {
        const today = new Date();
        const today_date = today.toISOString();
        const logoutButton = document.getElementById("logout-button");
        const eventForm = document.getElementById("event-form");
        const eventUrl = "http://127.0.0.1:5000/create_event"

        logoutButton.addEventListener("click", (event) => logout() )

        getEventsBy(today_date)
        .then(data => showEvents(data, today))

        eventForm.addEventListener('submit', (event) => {
          event.preventDefault();

          sendRequestToServer(eventForm, eventUrl)
          .then(data => console.log(data))
        });

    }

    function loginHandler () {
        const form = document.getElementById("login-form");
        const url = "http://127.0.0.1:5000/login";

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            sendRequestToServer(form, url)
            .then(data => {
                localStorage.setItem("token", data["token"]);
                console.log(data["token"]);
                location.replace("/index.html");
            })
            .catch(error => console.error(error))
        });
    }

    function signupHandler () {
    console.log("testlog")
        const form = document.getElementById("signup-form");
        console.log(form)
        const url = "http://127.0.0.1:5000/signup";

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            sendRequestToServer(form, url)
            .then(response => {
                console.log(response);
                location.replace("/login.html");
            })
            .catch(error => console.error(error))
        });
    }


    function sendRequestToServer (form, url) {

      const formData = new FormData(form);
      const data = {};
      const token = localStorage.getItem("token")
      console.log(token)

      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return new Promise ((resolve, reject) => {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => resolve(data))
          .catch( (error) => {
              console.log(error, "errorrrrrrrrrrr");
              reject(error);
          })
      })
    }


//    form.addEventListener('submit', (event) => {
//      event.preventDefault();
//    });

    function getEventsBy(date) {

        const apiUrl = `http://127.0.0.1:5000/get_events_by/${date}`

        return fetch(apiUrl, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}`}
                })
              .then(response => response.json())
              .catch(error => {
                console.error('Error:', error);
              });
    }


    function logout() {
        localStorage.removeItem("token");
        location.replace("/login.html")
    }

function showEvents(eventsFromApi,date){
const eventsDiv = document.getElementById('events-for-5days');

const dayEventsDiv = document.createElement("div");
const dateDisplay = document.createElement("h2");

console.log(eventsFromApi, "eventsFromApi");
dayEventsDiv.classList.add("single-day");

dateDisplay.textContent = date;
dayEventsDiv.appendChild(dateDisplay);

eventsFromApi.forEach(function (event){
event = JSON.parse(event);
const header = document.createElement("h3")
header.textContent = event.header;
header.role = "button";
const deleteButton = document.createElement("button");
deleteButton.value = "Delete"
deleteButton.setAttribute("id", event.header)

const time = document.createElement("span");
if (event.time !== undefined) {time.textContent = event.time}

const description = document.createElement("p");
description.textContent = event.description;
description.style.display = "none";
header.addEventListener("click", function(){
description.style.display = description.style.display === "none"? "block" : "none"
})
deleteButton.addEventListener("click", function() {
                const token = localStorage.getItem("token");
                const classList = deleteButton.classList;
                fetch(`http://localhost:5000/delete_event_by/${classList}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}`}
                })
            });
const eventDiv = document.createElement("div");
eventDiv.classList.add("single-event");
eventDiv.appendChild(header);
eventDiv.appendChild(time);
eventsDiv.appendChild(deleteButton)
eventDiv.appendChild(description);
dayEventsDiv.appendChild(eventDiv);
})
eventsDiv.appendChild(dayEventsDiv);
}
}
