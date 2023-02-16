let counterContainer = document.querySelector(".website-counter");

async function post_visit_and_get_count() {
  const response = await fetch(
    "https://noc1qi04ah.execute-api.us-east-2.amazonaws.com/prod/visits",
    { method: "POST" }
  );
  console.log(response);
  const resp_json = await response.json();
  const number_of_visits = resp_json.visits;
  return number_of_visits;
}

async function updateCounter() {
  const visits = await post_visit_and_get_count();
  counterContainer.innerHTML = visits;
}

updateCounter();
