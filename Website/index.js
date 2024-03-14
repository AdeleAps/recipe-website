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
