
fetch("example.json")
  .then(response => response.json())
  .then(json => console.log(json));

async function printJSON() {
    const response = await fetch("test.json");
    const json = await response.json();
    console.log(json);
}

//console.log(data);

document.body = document.createElement("body");
//document.body.innerHTML = data.title;
document.body.innerHTML = "<p>Hello World!</p>";

