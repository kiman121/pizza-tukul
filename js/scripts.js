$(document).ready(function () {
  const newOrder = new Order();
  var fetchTotal = false;

  $("form#place-order").submit(function (event) {
    event.preventDefault();
    var formAction = $("input#form-action").val(),
      validationFields = [];
  });

  $(".btn-order").click(function (event) {
    event.preventDefault();
    $("#fill-order").modal("show");
  });
  $(".pizza-size-option").click(function () {
    newOrder.pizzaSizeCost = $(this).val();
    // description = $(this).siblings("label").text();
  });

  $(".pizza-crust-option").click(function () {
    newOrder.pizzaCrustCost = $(this).val();
  });

  $(".pizza-toppings-option").click(function () {
    $(".pizza-toppings-option:checked").each(function () {
      newOrder.pizzaToppingsCost.push($(this).val());
    });
  });

  if (fetchTotal) {
    var total = newOrder.total();
    console.log(newOrder, total);
    fetchTotal = false;
  }
});
function Order() {
  this.pizzaSizeCost = "";
  this.pizzaCrustCost = "";
  this.pizzaToppingsCost = [];
  this.deliveryAddress = [];
}

Order.prototype.total = function () {
  var sizeCostings = parseFloat(this.pizzaSizeCost),
    crustCosting = parseFloat(this.pizzaCrustCost),
    toppingCosting = 0,
    total = 0;

  this.pizzaToppingsCost.forEach(function (pizzaToppingCost) {
    toppingCosting = toppingCosting + parseFloat(this.pizzaToppingCost);
  });

  total = sizeCostings + crustCosting + toppingCosting;

  return total;
};

function validateUserInput(formInputFields, alertDivClass) {
  var validated = true;
  $(".validate").removeClass("validate");

  formInputFields.forEach((formInputField) => {
    var field = formInputField,
      thisField = $("." + field),
      value = thisField.val();

    console.log(thisField.prop("type"));

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
