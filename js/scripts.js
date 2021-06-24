$(document).ready(function () {

  $("form#pizza-order").submit(function (event) {
    event.preventDefault();
    var formAction = $("input#form-action").val(),
    validatioFields = [];
    
    if(formAction === "place-new-order"){
        validatioFields = ["pizza-size", "crust-type", "toppings"];
        var validated = validateUserInput(validatioFields, "form-alerts");
        if(validated){
            console.log("Continue coding");
        }
    }
  });
});

function validateUserInput(formInputFields, alertDivClass) {
  var validated = true;
  $(".validate").removeClass("validate");

  formInputFields.forEach((formInputField) => {
    var field = formInputField,
      thisField = $("#" + field),
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
