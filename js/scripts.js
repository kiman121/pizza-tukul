$(document).ready(function () {
  const newOrder = new Order(),
    newFinalOrder = new FinalOrder();
  var orderId = 1,
    fieldsToValidate = [];

  $("form#place-order").submit(function (event) {
    event.preventDefault();

    fieldsToValidate = {
      checkboxes: [
        "pizza-size-option",
        "pizza-crust-option",
        "pizza-toppings-option",
      ],
    };

    if (validateUserInput(fieldsToValidate, "place-order-form-alerts")) {
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
        pizzaToppings = [];

      $(".pizza-toppings-option:checked").each(function () {
        pizzaToppings.push($(this).val());
      });

      const newOrderDetails = new OrderDetails(
        orderId,
        { sizeDescription: sizeDescription, sizeCost: sizeCost },
        { crustDescription: crustDescription, crustCost: crustCost },
        pizzaToppings
      );

      newFinalOrder.orders.push(newOrderDetails);

      var lineTotal = newOrderDetails.total();
      $(".order-items ul").append(
        '<li class="order-item"><a data-orderid="' +
          orderId +
          '" href="#" id="remove-order-item"><span>&times;</span></a> ' +
          crustDescription +
          " " +
          sizeDescription +
          ' sized pizza <span class="price-tag">' +
          formatCurrency(lineTotal) +
          " ksh</span> </li>"
      );

      var deliveryFee = newFinalOrder.deliveryCost;
      var subTotalAmount = newFinalOrder.total();

      setOrderTotals(parseFloat(subTotalAmount), parseFloat(deliveryFee));

      $(".order-summary").removeClass("hide-div");
      $(".empty-cart").addClass("hide-div");
      $(".place-order").text("Add order");

      closeModal('fill-order');
      
      resetFieldValues(fieldsToValidate);

      orderId++;
    }
  });

  $("form#delivery-detail").submit(function (event) {
    event.preventDefault();

    var formAction = $(".delivery-form-action").val(),
      clientName = $(".client-name").val(),
      deliveryMode = $(".delivery-options:checked").val(),
      deliveryCost = 0,
      deliverytext = "";

    if (formAction === "collection") {
      fieldsToValidate = {
        inputs: ["client-name"],
        checkboxes: ["delivery-options"],
      };
      deliverytext = "be ready for collection in 30 minutes.";
    } else if (formAction === "delivery") {
      var deliveryRegion = $(".delivery-region").val(),
        deliveryRegionText = $(".delivery-region")
          .children("option:selected")
          .text(),
        deliveryLocation = $(".delivery-location").val();

      deliverytext =
        "be delivered at " +
        deliveryRegionText +
        ", " +
        deliveryLocation +
        " in 30 to 40 minutes.";
      deliveryCost = $(".delivery-region").children("option:selected").val();
      fieldsToValidate = {
        inputs: ["client-name", "delivery-region", "delivery-location"],
        checkboxes: ["delivery-options"],
      };
      newAddress = new Address(deliveryRegion, deliveryLocation);
      newFinalOrder.deliveryAddress.push(newAddress);
    }

    if (validateUserInput(fieldsToValidate, "delivery-details-form-alerts")) {
      newFinalOrder.clientName = clientName;
      newFinalOrder.deliveryMode = deliveryMode;
      newFinalOrder.deliveryCost = deliveryCost;

      var deliveryFee = newFinalOrder.deliveryCost;
      var subTotalAmount = newFinalOrder.total();

      setOrderTotals(parseFloat(subTotalAmount), parseFloat(deliveryFee));

      $("#check-out-btn").text("Confirm order");
      $("#check-out-btn").data("btnaction", "order-checkout");
      $(".check-out-alerts").text(
        clientName + ", we have received your order and will " + deliverytext
      );
      $(".check-out-alerts").removeClass("hide-alert");

      closeModal('delivery-details');
      
      resetFieldValues(fieldsToValidate);
    }
  });

  $(".btn-submit").click(function (event) {
    event.preventDefault();
    var btnAction = $(this).data("btnaction"),
      modalToShow = "",
      showModal = true;

    if (btnAction === "place-order") {
      modalToShow = "fill-order";
    } else if (btnAction === "delivery-options") {
      modalToShow = "delivery-details";
    } else if (btnAction === "order-checkout") {
      showModal = false;
      $(".order-summary").addClass("hide-div");
      $(".completion-message")
        .empty()
        .html("Your order has been received. We are glad serving you.");
      $(".completion-message").removeClass("hide-div");

      setTimeout(() => {
        $(".completion-message").addClass("hide-div");
        $(".empty-cart").removeClass("hide-div");
        $(".place-order").text("Order Now");
      }, 4500);
    }

    if (showModal) {
      $("#" + modalToShow).modal("show");
    }
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

  $(".delivery-options").click(function () {
    var value = $(this).val();
    if (value === "collect") {
      $(".delivery-details").removeClass("hide-div").addClass("hide-div");
      $(".delivery-form-action").val("collection");
    } else if (value === "deliver") {
      $(".delivery-details").removeClass("hide-div");
      $(".delivery-form-action").val("delivery");
    }
  });

  $(document).on("click", "#remove-order-item", function (event) {
    event.preventDefault();
    var orders = newFinalOrder.orders,
      selectedOrderId = $(this).data("orderid"),
      newOrder = [];

    orders.forEach(function (order) {
      if (order.orderId != selectedOrderId) {
        newOrder.push(order);
      }
    });

    newFinalOrder.orders = newOrder;

    var deliveryFee = newFinalOrder.deliveryCost;
    var subTotalAmount = newFinalOrder.total();

    setOrderTotals(parseFloat(subTotalAmount), parseFloat(deliveryFee));

    $(this).parents(".order-item").remove();
  });
});

function FinalOrder() {
  this.orders = [];
  this.clientName = "";
  this.deliveryMode = "";
  this.deliveryCost = 0;
  this.deliveryAddress = [];
}

FinalOrder.prototype.total = function () {
  var sizeCost = 0,
    total = 0,
    crustCost = 0;

  this.orders.forEach(function (order) {
    sizeCost = parseFloat(order.pizzaSize.sizeCost);
    crustCost = parseFloat(order.pizzaCrust.crustCost);
    var topingCost = 0;
    order.pizzaToppings.forEach(function (pizzaTopping) {
      topingCost = topingCost + parseFloat(pizzaTopping);
    });
    total = total + sizeCost + crustCost + topingCost;
  });
  return total;
};

function OrderDetails(orderId, pizzaSize, pizzaCrust, pizzaToppings) {
  this.orderId = orderId;
  this.pizzaSize = pizzaSize;
  this.pizzaCrust = pizzaCrust;
  this.pizzaToppings = pizzaToppings;
}

OrderDetails.prototype.total = function () {
  var sizeCost = parseFloat(this.pizzaSize.sizeCost),
    crustCost = parseFloat(this.pizzaCrust.crustCost),
    topingCost = 0,
    total = 0;

  this.pizzaToppings.forEach(function (pizzaTopping) {
    topingCost = topingCost + parseFloat(parseFloat(pizzaTopping));
  });

  total = total + sizeCost + crustCost + topingCost;

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

function Address(region, location) {
  this.region = region;
  this.location = location;
}

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

function setOrderTotals(subTotalAmount, deliveryFee) {
  var vatPayable = Math.round(0.16 * (subTotalAmount + deliveryFee));
  var totalOrderAmount = subTotalAmount + deliveryFee + vatPayable;

  $(".order-totals")
    .empty()
    .html(
      '<ul> <li class="summary-item"> Subtotal <span class="price-tag subtotal">' +
        formatCurrency(subTotalAmount) +
        ' ksh</span> </li> <li class="summary-item"> Delivery fee <span class="price-tag delivery-fee">' +
        formatCurrency(deliveryFee) +
        ' ksh</span> </li> <li class="summary-item"> VAT 16% <span class="price-tag vat-payable">' +
        formatCurrency(vatPayable) +
        ' ksh</span> </li> <li class="summary-total"> Total <span class="price-tag total-order-amount">' +
        formatCurrency(totalOrderAmount) +
        " ksh</span> </li> </ul>"
    );
}

function validateUserInput(fieldsToValidate, alertDivClass) {
  var validated = true,
    field = "";
  $(".validate").removeClass("validate");
  $(".validate-form-check").remove();

  $.each(fieldsToValidate, function (keys, values) {
    if (keys === "inputs") {
      values.forEach(function (value) {
        field = value;
        if ($("." + field).val() === "") {
          validated = false;
          $("." + field).addClass("validate");
        }
      });
    } else if (keys === "checkboxes") {
      values.forEach(function (value) {
        field = value;
        if ($("." + field).is(":checked") === false) {
          validated = false;
          $("." + field+"-header").append('<span class="validate-form-check">*</span>')
          // $("." + field).addClass("validate");
        }
      });
    }
  });

  if (!validated) {
    alertUser("Fill the missing fields!", alertDivClass);
  }

  return validated;
}

function alertUser(message, alertDivClass) {
  $("." + alertDivClass).html(message);
  $("." + alertDivClass)
    .removeClass("hide-alert")
    .addClass("alert-danger");

  setTimeout(() => {
    $("." + alertDivClass).empty();
    $("." + alertDivClass)
      .removeClass("alert-danger")
      .addClass("hide-alert");
  }, 2500);
}

function resetFieldValues(formInputFields) {
  $.each(formInputFields, function (keys, values) {
    if (keys === "inputs") {
      values.forEach(function (value) {
        $("." + value).val("");
      });
    } else if (keys === "checkboxes") {
      values.forEach(function (value) {
        $("." + value).prop("checked", false);
      });
    }
  });
}

function closeModal(modalId) {
  $("#" + modalId)
    .delay(1000)
    .fadeOut(450);

  setTimeout(() => {
    $("#" + modalId).modal("toggle");
  }, 1500);
}
