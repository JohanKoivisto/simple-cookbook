const fs = require("fs");
http = require("http");
const url = require("url");

/// SERVER //////////////////////////////////
// LOAD DATA
const replaceTemplate = (temp, recipe) => {
  let output = temp.replace(/{%RECIPENAME%}/g, recipe.recipeName);
  output = output.replace(/{%RECIPEICON%}/g, recipe.icon);
  output = output.replace(/{%RECIQUANTITY%}/g, recipe.quantity);
  instructionsHTML = ""
  ingredientsHTML = ""
  recipe.instructions.forEach((el, index) => {
    instructionsHTML += `<p>${index+1}. ${el}</p>`
  });
  recipe.ingredients.forEach(el => {
    ingredientsHTML += `<p>${el}</p>`
  });


  console.log(instructionsHTML);
  output = output.replace(/{%RECIPEINSTRUCTIONS%}/g, instructionsHTML);
  output = output.replace(/{%RECIPEINGREDIENTS%}/g, ingredientsHTML);
  output = output.replace(/{%RECIPEID%}/g, recipe.id);

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);
const tempRecipe = fs.readFileSync(
  `${__dirname}/templates/template-recipe.html`,
  "utf8"
);
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf8");
const recipeData = JSON.parse(data);

// ROUTING
const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);
  // OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const recipeHTML = recipeData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%RECIPE_CARDS%}", recipeHTML);

    res.end(output);

    // RECIPE PAGE
  } else if (pathname === "/recipe") {
    res.writeHead(200, { "content-type": "text/html" });
    const recipe = recipeData[query.id]
    output = replaceTemplate(tempRecipe, recipe)

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    // PAGE NOT FOUND
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
