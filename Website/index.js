window.addEventListener(
  "load",
  function () {
    let forms = document.getElementsByClassName("needs-validation");
    let validation = Array.prototype.filter.call(forms, function (form) {
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
    });
  },
  false
);

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

  // Append a dummy list of ingredients
  $("<ul>", { class: "list-of-ingredients" })
    .append("<li>Ingredient 1</li>")
    .append("<li>Ingredient 2</li>")
    .append("<li>Ingredient 3</li>")
    .appendTo("#recipeLightbox .modal-body");

  // Append a dummy recipe paragraph
  $("<p>", {
    class: "recipe-description",
    text: "This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish. This is a dummy recipe description. Follow the steps to make your delicious dish.",
  }).appendTo("#recipeLightbox .modal-body");

  $("#recipeLightboxTitle").text(recipeTitle);
  $("#recipeLightbox").modal("show");
}
