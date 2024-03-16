let api;

window.addEventListener("load", function () {
  api = axios.create({
    baseURL: "https://www.themealdb.com/api/json/v1/1/",
  });

  handleFormSubmission();
  togglePlaceholderFade();
  getAllMealCategories();
  getAllRecipes();
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

function openRecipe(element) {
  $("#recipeLightbox .modal-body").empty();

  const card = $(element);
  const recipeTitle = card.find(".card-body .card-text").text();
  const image = card.find(".image-container .card-img-top").attr("src");

  $("<img>", {
    src: image,
    class: "card-recipe-image",
    alt: "Recipe Image",
  }).appendTo("#recipeLightbox .modal-body");

  $("<ul>", { class: "list-of-ingredients" })
    .append("<li>Ingredient 1</li>")
    .append("<li>Ingredient 2</li>")
    .append("<li>Ingredient 3</li>")
    .appendTo("#recipeLightbox .modal-body");

  $("<p>", {
    class: "recipe-description",
    text: "This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish.",
  }).appendTo("#recipeLightbox .modal-body");

  $("#recipeLightboxTitle").text(recipeTitle);
  $("#recipeLightbox").modal("show");
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
    const meals = response.data.meals.slice(0, 8);
    const recipeGrid = $(".recipe-grid");

    recipeGrid.empty();

    if (meals.length > 0) {
      meals.forEach((recipe) => {
        const cardHtml = `
          <div class="card card-homepage" onClick="openRecipe(this)">
            <div class="image-container">
              <img
                class="card-img-top"
                src="${recipe.strMealThumb}"
                alt="${recipe.strMeal}"
              />
              <img
                src="./Assets/heart.svg"
                alt="Favorite"
                class="heart-icon"
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
  $(".recipe-grid").html(spinnerHtml);
};
