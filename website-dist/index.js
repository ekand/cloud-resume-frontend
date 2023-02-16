var counterContainer = document.querySelector(".website-counter");

async function post_visit_and_get_count() {
  const response = await fetch(
    "https://noc1qi04ah.execute-api.us-east-2.amazonaws.com/prod/visits",
    { method: "POST" }
  );
  console.log(response);
}
post_visit_and_get_count();
