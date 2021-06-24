$(document).ready(function () {
  $("form#pizza-order").submit(function (event) {
    event.preventDefault();
    var formAction = $("input#form-action").val(),
      validationFields = [];

    if (formAction === "place-new-order") {
      validationFields = ["pizza-size", "crust-type", "toppings"];
      var validated = validateUserInput(validationFields, "form-alerts");
      if (validated) {
        $(".btn-submit").addClass("hide-btn");
        $(".check-out-option").removeClass("hide-div");

        $(".order-details").addClass("hide-div");
        $("#form-action").val("");
        resetFieldValues(validationFields);
        // console.log("Continue coding");
      }
    } else if(formAction === "check-out"){
        validationFields = [""]
    }
  });

  $(".check-out-option ul li").click(function () {
      var action = "", btnText = "";
    if ($(this).data("action") === "addorder") {
      $(".order-details").removeClass("hide-div");
      action = "place-new-order"
      btnText = "Add order"
    } else {
      $(".delivery-details").removeClass("hide-div");
      action = "check-out"
      btnText = "Check out"
    }
    $(".check-out-option").addClass("hide-div");
    $(".btn-submit").removeClass("hide-btn");
    $(".btn-submit").text(btnText)
    $("#form-action").val(action);
  });
});

function validateUserInput(formInputFields, alertDivClass) {
  var validated = true;
  $(".validate").removeClass("validate");

  formInputFields.forEach((formInputField) => {
    var field = formInputField,
      thisField = $("." + field),
      value = thisField.val();

    if (value === "") {
      validated = false;
      thisField.addClass("validate");

      alertUser("Fill the missing fields!", alertDivClass, "alert-danger");
    }
  });

  return validated;
}

function alertUser(message, alertDivClass, alertClass) {
  $("." + alertDivClass).html(message);
  $("." + alertDivClass)
    .removeClass("hide-alert")
    .addClass(alertClass);

  setTimeout(() => {
    $("." + alertDivClass).empty();
    $("." + alertDivClass)
      .removeClass(alertClass)
      .addClass("hide-alert");
  }, 3000);
}

function resetFieldValues(formInputFields) {
  formInputFields.forEach((formInputField) => {
    $("." + formInputField).val("");
  });
}
