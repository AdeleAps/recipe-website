let api;

window.addEventListener("load", function () {
  const path = window.location.pathname;
  api = axios.create({
    baseURL: "https://www.themealdb.com/api/json/v1/1/",
  });

  handleFormSubmission();
  togglePlaceholderFade();
  getAllMealCategories();
  getAllRecipes();

  if (path.endsWith("/myrecipes.html")) {
    getFavoriteRecipes();
  } else {
    getAllRecipes();
  }
});

function handleFormSubmission() {
  const form = document.querySelector(".needs-validation");

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        $("#feedbackModalLabel").removeClass("failure success");

        if (form.checkValidity() === true) {
          form.classList.add("was-validated");
          $("#feedbackModalLabel").addClass("success");
          $("#feedbackModalLabel").text(
            "Your recipe has been submitted. Thank you!"
          );
        } else {
          $("#feedbackModalLabel").addClass("failure");
          $("#feedbackModalLabel").text(
            "Invalid input data, please try again."
          );
        }
        $("#feedbackModal").modal("show");
      },
      false
    );
  }
}

async function openRecipe(element) {
  $("#recipeLightbox .modal-body").empty();

  try {
    const card = $(element);
    const recipeTitle = card.find(".card-body .card-text").text();
    const image = card.find(".image-container .card-img-top").attr("src");
    const response = await api.get(`search.php?s=${recipeTitle}`);
    const meal = response.data.meals[0];
    const ingredients = extractIngredients(meal);

    $("<img>", {
      src: image,
      class: "card-recipe-image",
      alt: "Recipe Image",
    }).appendTo("#recipeLightbox .modal-body");

    const $ul = $("<ul>", { class: "list-of-ingredients" });
    ingredients.forEach((ingredient) => {
      $ul.append($("<li>").text(ingredient));
    });

    $ul.appendTo("#recipeLightbox .modal-body");

    $("<p>", {
      class: "recipe-description",
      text: meal.strInstructions,
    }).appendTo("#recipeLightbox .modal-body");

    $("#recipeLightboxTitle").text(recipeTitle);
    $("#recipeLightbox").modal("show");
  } catch (error) {
    console.error(error);
  }
}

function togglePlaceholderFade() {
  $(
    '#recipe-submit-form input[type="text"], #recipe-submit-form input[type="email"], #recipe-submit-form input[type="tel"], #recipe-submit-form textarea'
  ).hover(
    function () {
      $(this).addClass("input-placeholder-fade");
    },
    function () {
      $(this).removeClass("input-placeholder-fade");
    }
  );
}

const getAllMealCategories = async () => {
  try {
    const response = await api.get("list.php?a=list");
    const mealCategories = response.data.meals.map((item) => item.strArea);
    const dropdownMenu = $(".dropdown-menu");

    if (dropdownMenu) {
      dropdownMenu.empty();

      if (mealCategories.length > 0) {
        mealCategories.forEach((category) => {
          dropdownMenu.append(
            `<li onClick="handleSwitchCategory('${category}')" class="dropdown-item clickable" >${category}</li>`
          );
        });
      } else {
        dropdownMenu.append(
          `<li class="dropdown-item"> No categories found. </li>`
        );
      }
    }
  } catch (error) {
    console.error(error);
    const dropdownMenu = $(".dropdown-menu");
    dropdownMenu.append(`<li class="dropdown-item"> Server error. </li>`);
  }
};

const getAllRecipes = async (category = "American") => {
  try {
    showLoadingSpinner();

    const response = await api.get(`filter.php?a=${category}`);
    const meals = response.data.meals.slice(0, 10);
    const recipeGrid = $(".recipe-grid");
    const dropdownMenuItems = document.querySelectorAll(
      ".dropdown-menu .dropdown-item"
    );
    const favoriteRecipes =
      JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    dropdownMenuItems.forEach((item) => {
      item.style.fontWeight = "normal";
    });

    const selectedCategoryItem = Array.from(dropdownMenuItems).find(
      (item) => item.textContent === category
    );
    if (selectedCategoryItem) {
      selectedCategoryItem.style.fontWeight = "bold";
    }

    recipeGrid.empty();

    if (meals.length > 0) {
      meals.forEach((recipe) => {
        const isFavoriteRecipe = favoriteRecipes.includes(recipe.idMeal);
        const heartSVG = isFavoriteRecipe
          ? "./Assets/heart-filled.svg"
          : "./Assets/heart.svg";

        const cardHtml = `
          <div class="card card-homepage" onClick="openRecipe(this)">
            <div class="image-container">
              <img
                class="card-img-top"
                src="${recipe.strMealThumb}"
                alt="${recipe.strMeal}"
              />
              <img
                src=${heartSVG}
                alt="Favorite"
                class="heart-icon"
                onClick="toggleFavoriteRecipe(event, '${recipe.idMeal}')"
                />
              <div class="card-body">
                <p class="card-text">${recipe.strMeal}</p>
              </div>
            </div>
          </div>`;
        recipeGrid.append(cardHtml);
      });
    } else {
      recipeGrid.append(`<p>No recipes found for ${category}.</p>`);
    }
  } catch (error) {
    console.error(error);
    $(".recipe-grid").html(`<p>Error loading recipes.</p>`);
  }
};

const handleSwitchCategory = (category) => {
  getAllRecipes(category);
};

const showLoadingSpinner = () => {
  const spinnerHtml = `
  <div class="loading-spinner-container">
  <div id="loading-spinner">
    <span class="sr-only">Loading...</span>
  </div>
  </div>`;

  const recipeGrid = $(".recipe-grid");

  if (recipeGrid) {
    $(".recipe-grid").html(spinnerHtml);
  } else {
    $("#favorites").html(spinnerHtml);
  }
};

function extractIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    if (recipe[ingredientKey] && recipe[ingredientKey].trim() !== "") {
      ingredients.push(recipe[ingredientKey].trim());
    }
  }
  return ingredients;
}

const toggleFavoriteRecipe = (event, recipeId) => {
  event.stopPropagation();
  let favoriteRecipes =
    JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
  const heartIcon = event.target;

  if (!favoriteRecipes.includes(recipeId)) {
    favoriteRecipes.push(recipeId);
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    heartIcon.src = "./Assets/heart-filled.svg";
  } else {
    favoriteRecipes = favoriteRecipes.filter((id) => id !== recipeId);
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    heartIcon.src = "./Assets/heart.svg";
  }
};

const getFavoriteRecipes = async () => {
  try {
    const contentSection = $("#favorites");
    showLoadingSpinner();
    const favoriteRecipes =
      JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    const recipes = [];
    const recipeGridHTML = `<div class="recipe-grid"></div>`;

    if (favoriteRecipes.length > 0) {
      for (const recipeId of favoriteRecipes) {
        const response = await api.get(`lookup.php?i=${recipeId}`);
        const recipe = response.data.meals[0];
        recipes.push(recipe);
      }

      contentSection.empty();
      contentSection.css("margin-block", "unset");
      contentSection.append(recipeGridHTML);
      const recipeGrid = $(".recipe-grid");

      recipes.forEach((recipe) => {
        const isFavoriteRecipe = favoriteRecipes.includes(recipe.idMeal);
        const heartSVG = isFavoriteRecipe
          ? "./Assets/heart-filled.svg"
          : "./Assets/heart.svg";

        const cardHtml = `
          <div class="card " onClick="openRecipe(this)">
            <div class="image-container">
              <img
                class="card-img-top"
                src="${recipe.strMealThumb}"
                alt="${recipe.strMeal}"
              />
              <img
                src=${heartSVG}
                alt="Favorite"
                class="heart-icon"
                onClick="toggleFavoriteRecipe(event, '${recipe.idMeal}')"
                />
              <div class="card-body">
                <p class="card-text">${recipe.strMeal}</p>
              </div>
            </div>
          </div>`;

        recipeGrid.append(cardHtml);
      });
    } else {
      const recipeGridHelpHTML = `<h3>My Recipes</h3>
      <div class="no-recipes">
        <div>No recipes have been added yet!</div>
        <p>
          <button
            class="btn btn-info"
            type="button"
            data-toggle="collapse"
            data-target="#infoCollapse"
            aria-expanded="false"
            aria-controls="infoCollapse"
          >
            How To Add a Recipe
          </button>
        </p>
        <div class="collapse" id="infoCollapse">
          <div class="card card-body">
            It's very easy! Just find a recipe you like and click on the
            heart icon.
          </div>
        </div>
      </div>`;

      contentSection.append(recipeGridHelpHTML);
    }
  } catch (error) {
    console.error(error);
    $(".content-section").html(`<p>Error loading recipes.</p>`);
  }
};
