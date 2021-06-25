$(document).ready(function () {
  const newOrder = new Order(),
    newFinalOrder = new FinalOrder();
  var orderId = 1;

  $("form#place-order").submit(function (event) {
    event.preventDefault();

    var sizeCost = $(".pizza-size-option:checked").val(),
      sizeDescription = $(".pizza-size-option:checked")
        .siblings("label")
        .text()
        .trim(),
      crustCost = $(".pizza-crust-option:checked").val(),
      crustDescription = $(".pizza-crust-option:checked")
        .siblings("label")
        .text()
        .trim(),
      pizzaToppings = {};

    $(".pizza-toppings-option:checked").each(function () {
      var key = $(this).parents("label").text().trim(),
        value = $(this).val();
      pizzaToppings[key] = value;
    });
    // console.log(sizeDescription);

    const newOrderDetails = new OrderDetails(
      orderId,
      { sizeDescription: sizeDescription, sizeCost: sizeCost },
      { crustDescription: crustDescription, crustCost: crustCost },
      pizzaToppings
    );
    newFinalOrder.orders.push(newOrderDetails);

    orderId++;
    
    console.log(newFinalOrder.total());
  });

  $(".btn-order").click(function (event) {
    event.preventDefault();
    $("#fill-order").modal("show");
  });

  $(".pizza-options").click(function () {
    if ($(this).hasClass("pizza-size-option")) {
      newOrder.pizzaSizeCost = $(this).val();
    } else if ($(this).hasClass("pizza-crust-option")) {
      newOrder.pizzaCrustCost = $(this).val();
    } else if ($(this).hasClass("pizza-toppings-option")) {
      var toppingsCost = [];
      $(".pizza-toppings-option:checked").each(function () {
        toppingsCost.push($(this).val());
      });
      newOrder.pizzaToppingsCost = toppingsCost;
    }
    $(".modal-subtotal").text(formatCurrency(newOrder.total()));
  });
});

function FinalOrder() {
  this.orders = [];
}

function OrderDetails(orderId, pizzaSize, pizzaCrust, pizzaToppings) {
  this.orderId = orderId;
  this.pizzaSize = pizzaSize;
  this.pizzaCrust = pizzaCrust;
  this.pizzaToppings = pizzaToppings;
}
FinalOrder.prototype.total = function () {
  var sizeCost = 0,
    total = 0,
    crustCost = 0,
    topingCost = 0;

  this.orders.forEach(function (order) {
    sizeCost = parseFloat(order.pizzaSize.sizeCost);
    crustCost = parseFloat(order.pizzaCrust.crustCost);
    $.each(order.pizzaToppings, function(key, value){
        topingCost =  topingCost + parseFloat(value);
    })
    total = total + sizeCost + crustCost + topingCost;
  });

  return total;
};
function Order() {
  this.pizzaSizeCost = 0;
  this.pizzaCrustCost = 0;
  this.pizzaToppingsCost = [];
  this.deliveryAddress = [];
}

Order.prototype.total = function () {
  var sizeCostings = parseFloat(this.pizzaSizeCost),
    crustCosting = parseFloat(this.pizzaCrustCost),
    toppingCosting = 0,
    total = 0;

  this.pizzaToppingsCost.forEach(function (pizzaToppingCost) {
    toppingCosting = toppingCosting + parseFloat(pizzaToppingCost);
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
function formatCurrency(amount) {
  return parseFloat(amount, 10)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString();
}
