const date = new Date();
var copyright_date = date.getFullYear();

$("#Copyright").html("© " + String(copyright_date) + " Copyright.");

// Define color scheme.
var colors = ["#FC8B5E", "#219ebc", "#023047", "#EA592A"]; // new

var m_star = Number($("#input1").val()) * 1e-18;
var Rm = Number($("#input2").val());
var Q = Number($("#input3").val());
var mp = Number($("#input4").val());

// ________________________________________________________________

var mu = fWidth(m_star * 1e18, Rm, Q);
var lambda = fLoss(m_star * 1e18, Rm, Q);

$("#mu").html(0.5 * (mu[0] + mu[1]).toFixed(3));
if (lambda[0] < 0) {
  lambda[0] = 0;
  $("#lambda").html(0.5 * (lambda[0] + lambda[1]).toFixed(3));
} else {
  $("#lambda").html(0.5 * (lambda[0] + lambda[1]).toFixed(3));
}
var Omega_CPMA = tri_tfer(Rm, mu, lambda, m_star * 1e18, mp);
$("#Omega_CPMA").html(Omega_CPMA.toFixed(2));

var [mTilde, IdealOmega] = tri_tfer_plot(Rm, 1, 1);
var [mTilde, nonIdealOmega] = tri_tfer_plot(
  Rm,
  0.5 * (mu[0] + mu[1]),
  0.5 * (lambda[0] + lambda[1])
);

var dataTri = [];

for (ii = 0; ii < mTilde.length; ii++) {
  dataTri.push({
    x: mTilde[ii],
    yIdeal: IdealOmega[ii],
    yNonIdeal: nonIdealOmega[ii],
  });
}
// ----------------------------------------------------------------

prop = prop_pma();

prop["omega_hat"] = 0.9696;
prop["Rm"] = Rm;
var rho_eff100 = Number($("#rhonum").val());
prop["Dm"] = Number($("#Dmnum").val());
var mr_vec = linspace(0.5, 1.5, 301);
var m100 = rho_eff100 * ((pi * Math.pow(100e-9, 3)) / 6); // effective density @ 1 nm
prop["m0"] = m100 * Math.pow(1 / 100, prop["Dm"]); // adjust mass-mobility relation parameters

m_vec = mr_vec.map(function (x) {
  return x * m_star;
}); // gets points at which to evaluate the transfer function
d = m_vec.map(function (x) {
  return Math.pow(x / prop["m0"], 1 / prop["Dm"]) * 1e-9;
}); // gets new mobility diameters using mass-mobility relation

// generate a new setpoint
sp_var1 = "m_star";
sp_var2 = "Rm";

__left0__ = get_setpoint(prop, sp_var1, m_star, sp_var2, Rm);
sp = __left0__[0];

var z_vec = [1];

var Lambda_1C = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C);
var Lambda_1C_diff = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C_diff);
var data1C = [];
for (ii = 0; ii < m_vec.length; ii++) {
  data1C.push({
    x: mr_vec[ii],
    yc: Lambda_1C[ii],
    yc_diff: Lambda_1C_diff[ii],
  });
}

// ----------------------------------------------------------
// Select the my_dataviz function and then set the width and height
var $container = $("#my_dataviz"),
  width_a = 0.9 * Math.min($container.width(), 870),
  height_a = $container.height();

// for legend
var margin_legend = {
  top: 0,
  right: 50,
  bottom: 0,
  left: 60,
};
var legend = d3
  .select("#my_legend")
  .append("svg")
  .attr("width", width_a - margin_legend.left - margin_legend.right) //
  .attr("height", 110)
  .append("g");
// legend for lines
legend
  .append("text")
  .attr("x", 25)
  .attr("y", 34)
  .attr("class", "legend-label")
  .text("Ideal triangular model (μ = 1, λ = 1)")
  .attr("alignment-baseline", "middle");
triIdeal = [
  {
    x: 0,
    y: 33,
  },
  {
    x: 18,
    y: 33,
  },
];
legend
  .append("path")
  .datum(triIdeal)
  .attr("fill", "none")
  .attr("stroke", colors[1])
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
  );
legend
  .append("text")
  .attr("x", 25)
  .attr("y", 56)
  .attr("class", "legend-label")
  .text("Non-ideal triangular model ( μ ≠ 1 , λ ≠ 1)")
  .attr("alignment-baseline", "middle");
triNonIdeal = [
  {
    x: 0,
    y: 54,
  },
  {
    x: 18,
    y: 54,
  },
];
legend
  .append("path")
  .datum(triNonIdeal)
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[2])
  .attr("stroke-dasharray", "4 2")
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
  );
legend
  .append("text")
  .attr("x", 25)
  .attr("y", 78)
  .attr("class", "legend-label")
  .text("Theoretical Trapezoidal model")
  .attr("alignment-baseline", "middle");
d1c = [
  {
    x: 0,
    y: 77,
  },
  {
    x: 18,
    y: 77,
  },
];
legend
  .append("path")
  .datum(d1c)
  .attr("fill", "none")
  .attr("stroke", colors[0])
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
  );
legend
  .append("text")
  .attr("x", 25)
  .attr("y", 100)
  .attr("class", "legend-label")
  .text("Theoretical Diffusion model")
  .attr("alignment-baseline", "middle");
d1c_diff = [
  {
    x: 0,
    y: 99,
  },
  {
    x: 18,
    y: 99,
  },
];

legend
  .append("path")
  .datum(d1c_diff)
  .attr("fill", "none")
  .attr("stroke", colors[3])
  .attr("stroke-dasharray", "4 2")
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
  );

// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 1.5,
    bottom: 50,
    left: 55,
  },
  width = width_a - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//-- Add background rectangle --//
svg
  .append("rect")
  .attr("width", "100%")
  .attr("class", "plot-fill")
  .attr("height", height);

// Add X axis
var x = d3
  .scaleLinear()
  .domain([0.5, 1.5])
  .range([0, 0.9 * width]); //.range([0, width-200]);
var xAxis = svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "axis")
  .call(d3.axisBottom(x).ticks(5));

var xAxis2 = svg
  .append("g")
  .attr("transform", "translate(0," + 0 + ")")
  .attr("class", "axis")
  .call(d3.axisTop(x).ticks(5));

// Add Y axis
var yMax = 1,
  yMin = 0;

var y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);
var yAxis = svg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(6));

var yAxis2 = svg
  .append("g")
  .attr("transform", "translate(" + 0.9 * width + ",0)") //  .attr("transform", "translate(" + width + ",0)")
  .attr("class", "axis")
  .call(d3.axisRight(y).ticks(5));

//-- Add axis labels --//
// Add X axis label:
svg
  .append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2) //width / 2
  .attr("y", height + 45)
  .attr("class", "legend-label")
  .text("Particle mass over setpoint mass");

// Y axis label:
svg
  .append("text")
  .attr("text-anchor", "middle")
  .attr("class", "legend-label")
  .attr("transform", "translate(-40," + height / 2 + ")rotate(-90)")
  .text("Transfer function, Ω");

// generate plot
svg
  .append("path")
  .datum(dataTri)
  .attr("id", "triIdeal")
  .attr("fill", "none")
  .attr("stroke", colors[1])
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.x);
      })
      .y(function (d) {
        return y(d.yIdeal);
      })
  );

svg
  .append("path")
  .datum(dataTri)
  .attr("id", "triNonIdeal")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[2])
  .attr("stroke-dasharray", "4 2")
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.x);
      })
      .y(function (d) {
        return y(d.yNonIdeal);
      })
  );

svg
  .append("path")
  .datum(data1C)
  .attr("id", "l1c")
  .attr("fill", "none")
  .attr("stroke", colors[0])
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.x);
      })
      .y(function (d) {
        return y(d.yc);
      })
  );

svg
  .append("path")
  .datum(data1C)
  .attr("id", "l1cd")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[3])
  .attr("stroke-dasharray", "4 2")
  .attr("stroke-width", 3.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.x);
      })
      .y(function (d) {
        return y(d.yc_diff);
      })
  );

// To show the updated vakues in HTML page
$("#Vvalue").html(Math.round(Number(sp["V"]) * 100) / 100);
$("#Wvalue").html(Math.round(Number(sp["omega"]) * 1000) / 1000);
$("#Wrpmvalue").html(Math.round(Number(sp["omega"] * 9.5493) * 100) / 100);
$("#mStarValue2").html(Math.round(Number(sp["m_star"] * 1e18) * 100) / 100);
$("#RmValue2").html(Math.round(Number(sp["Rm"]) * 100) / 100);
$("#dmval1").html(
  Math.round(
    Number(Math.pow(sp["m_star"] / prop["m0"], 1 / prop["Dm"])) * 100
  ) / 100
);
var e = 1.60218e-19;
$("#omegahnum").val(Math.round(prop["omega_hat"] * 1e5) / 1e5);

//----------------------------Update based on controls---------------------//

// Update mass setpoint
$("#input1").on("change", function () {
  switch ($("#setpoint-mode option:selected").text()) {
    case " Mass + Resolution + flow rate":
      sp_var1 = "m_star";
      sp_var2 = "Rm";
      refreshData(this.value / 1e18, Number($("#input2").val()), prop);
      break;
    case "Angular speed + Voltage + flow rate":
      sp_var1 = "omega";
      sp_var2 = "V";
      // alert($("#setpoint-mode option:selected").text());
      refreshData(this.value, Number($("#input2").val()), prop);
      break;
  }

  // m_star = this.value / 1e18 // include conversion to kg
  // Rm = sp[sp_var2]

  // refreshData(m_star, Rm, prop)
});

// Update resolution

$("#input2").on("change", function () {
  // if (parseFloat(this.value) <= 0) {
  //   $('#input2').css("border", "2px solid #EE696A");
  //   return;
  // }
  // $('#input2').hover(function() {
  //   $(this).css("border", "2px solid #9BD6FF");
  // }, function() {
  //   $(this).css("border", "2px solid #E3E3E3");
  // });
  // Rm = parseFloat(this.value);
  // m_star = sp[sp_var1]

  // refreshData(m_star, Rm, prop)

  switch ($("#setpoint-mode option:selected").text()) {
    case " Mass + Resolution + flow rate":
      sp_var1 = "m_star";
      sp_var2 = "Rm";
      refreshData(Number($("#input1").val()) / 1e18, this.value, prop);
      break;
    case "Angular speed + Voltage + flow rate":
      sp_var1 = "omega";
      sp_var2 = "V";
      refreshData(Number($("#input1").val()), this.value, prop);

      break;

    // switch ($("#setpoint-mode option:selected").text()) {
    //   case "Mass + Resolution + flow rate":

    //     sp_var1 = "m_star"
    //     sp_var2 = "Rm"

    //     refreshData($("#input1").val()/ 1e18, this.value, prop)
    //     break;

    //   case "Angular speed + Voltage + flow rate":

    //     sp_var1 = "omega"
    //     sp_var2 = "V"
    //     refreshData($("#input1").val(), this.value, prop)
    //     break;

    // Rm = parseFloat(this.value);
    // m_star = sp[sp_var1]

    // refreshData(m_star, Rm, prop)
  }
});

// Update flow rate
$("#input3").on("change", function () {
  prop["Q"] = this.value / 1000 / 60; // include conversion to m3/sec
  prop["v_bar"] = prop["Q"] / prop["A"];
  m_star = sp[sp_var1];
  Rm = sp[sp_var2];
  refreshData(m_star, Rm, prop);
});
// Update effective density
$("#rhonum").on("change", function () {
  rho_eff100 = this.value; // effective density @ 100 nm read from control
  m_star = sp[sp_var1];
  Rm = sp[sp_var2];
  refreshData(m_star, Rm, prop);
});
// Update mass-mobility exponent
$("#Dmnum").on("change", function () {
  prop["Dm"] = this.value;
  m_star = sp[sp_var1];
  Rm = sp[sp_var2];
  refreshData(m_star, Rm, prop);
});

//----------------------------setpoint modes--------------------------------------//

$("#setpoint-mode").on("change", function () {
  switch (this.value) {
    case "Mass + Resolution + flow rate":
      $("#variableName1").html("Mass setpoint");
      $("#variableName2").html("Resolution");
      $("#var1-units").html("fg");
      $("#var2-units").html("");
      $("#rangeLabel1").html("m* ∈ [ 0.05 , 100 ] fg");
      $("#rangeLabel2").html("R<sub>m</sub> ∈ [ 2 , 15 ]");
      sp_var1 = "omega";
      sp_var2 = "V";

      refreshData(sp["omega"], sp["V"], prop);

      $("#input1").val(Math.round(Number(sp["m_star"] * 1e18) * 100) / 100);
      $("#input2").val(Math.round(Number(sp["Rm"]) * 100) / 100);
      sp_var1 = "m_star";
      sp_var2 = "Rm";
      break;

    case "Angular speed + Voltage + flow rate":
      $("#variableName1").html("Angular speed");
      $("#variableName2").html("Voltage");
      $("#var1-units").html("rad/s");
      $("#var2-units").html("V");
      $("#rangeLabel1").html("ω ∈ [ 5.4 , 1256] Rad/s"); //<br> ω ∈ [ 52 , 12000 ] RPM
      $("#rangeLabel2").html("V ∈ [ 0.1 , 1000 ] V");
      sp_var1 = "m_star";
      sp_var2 = "Rm";

      refreshData(sp["m_star"], sp["Rm"], prop);

      // alert(sp['m_star']+'----'+sp['Rm'])
      $("#input1").val(Math.round(Number(sp["omega"] * 100) / 100));
      $("#input2").val(Math.round(Number(sp["V"] * 100) / 100));
      sp_var1 = "omega";
      sp_var2 = "V";
      // $('#input1').val(Number($("#mStarValue2").html()));
      // $('#input2').val(Number($("#RmValue2").html()));
      // refreshData($('#input1').val(), $('#input2').val(), prop)
      break;
  }
});

//----------------------------------End-------------------------------------------//
//--------------------------- data refresher function -------------------------------//

function refreshData(m_star, Rm, prop) {
  prop["Dm"] = Number($("#Dmnum").val());
  var rho_eff100 = Number($("#rhonum").val());
  var m100 = rho_eff100 * ((pi * Math.pow(100e-9, 3)) / 6); // effective density @ 1 nm
  prop["m0"] = m100 * Math.pow(1 / 100, prop["Dm"]); // adjust mass-mobility relation parameters

  // var m_star = Number($("#input1").val())*1e-18;
  // var Rm = Number($("#input2").val());
  // var Q = Number($("#input3").val());
  // alert(sp_var1+':'+m_star)
  // alert(sp_var2+':'+Rm)
  __left0__ = get_setpoint(prop, sp_var1, m_star, sp_var2, Rm);
  sp = __left0__[0];

  m_vec = mr_vec.map(function (x) {
    return x * sp.m_star;
  }); // gets points at which to evaluate the transfer function
  d = m_vec.map(function (x) {
    return Math.pow(x / prop["m0"], 1 / prop["Dm"]) * 1e-9;
  }); // gets new mobility diameters using mass-mobility relation

  // evaulate transfer functions at new conditions
  var Lambda_1C = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C);
  var Lambda_1C_diff = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C_diff);

  yMax = 1.6 * Math.max.apply(this, Lambda_1C);
  yMin = 0; //-0.05 * Math.max.apply(this, Lambda_1C);

  // generate data vector to be used in updating the plot
  var data1C = [];
  for (ii = 0; ii < m_vec.length; ii++) {
    data1C.push({
      x: mr_vec[ii],
      yc: Lambda_1C[ii],
      yc_diff: Lambda_1C_diff[ii],
    });
  }

  switch (true) {
    case Q < 0.3 || Q > 8:
      mu = [0, 0];
      alert("Caution! Please enter a number between 0.3 and 8 LPM");
      break;

    default:
      var mu = fWidth(sp["m_star"] * 1e18, sp["Rm"], Q);
  }

  Q = prop["Q"] * 60000;

  switch (true) {
    case Q == 0.3 || Q == 1.5 || Q == 4 || Q == 8:
      var lambda = fLoss(sp["m_star"] * 1e18, sp["Rm"], Q);

      break;

    case Q < 0.3 || Q > 8:
      lambda = [0, 0];

      break;
    case Q > 0.3 && Q < 1.5:
      var lambda03 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 0.3);
      var lambda15 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 1.5);
      lambda = linearInterp(
        [0.3, 1.5],
        [(lambda03[0] + lambda03[1]) / 2, (lambda15[0] + lambda15[1]) / 2],
        Q
      );

      break;

    case Q > 1.5 && Q < 4:
      var lambda15 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 1.5);
      var lambda4 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 4);
      lambda = linearInterp(
        [1.5, 4],
        [(lambda15[0] + lambda15[1]) / 2, (lambda4[0] + lambda4[1]) / 2],
        Q
      );

      break;

    case Q > 4 && Q < 8:
      var lambda4 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 0.3);
      var lambda8 = fLoss(sp["m_star"] * 1e18, sp["Rm"], 1.5);
      lambda = linearInterp(
        [4, 8],
        [(lambda4[0] + lambda4[1]) / 2, (lambda8[0] + lambda8[1]) / 2],
        Q
      );
      break;
  }

  $("#mu").html(0.5 * (mu[0] + mu[1]).toFixed(3));
  if (lambda[0] < 0) {
    lambda[0] = 0;
    $("#lambda").html(0.5 * (lambda[0] + lambda[1]).toFixed(3));
  } else {
    $("#lambda").html(0.5 * (lambda[0] + lambda[1]).toFixed(3));
  }
  var Omega_CPMA = tri_tfer(Rm, mu, lambda, m_star * 1e18, mp);
  $("#Omega_CPMA").html(Omega_CPMA.toFixed(2));

  var [mTilde, IdealOmega] = tri_tfer_plot(sp["Rm"], 1, 1);
  var [mTilde, nonIdealOmega] = tri_tfer_plot(
    sp["Rm"],
    0.5 * (mu[0] + mu[1]),
    0.5 * (lambda[0] + lambda[1])
  );

  var dataTri = [];
  for (ii = 0; ii < mTilde.length; ii++) {
    dataTri.push({
      x: mTilde[ii],
      yIdeal: IdealOmega[ii],
      yNonIdeal: nonIdealOmega[ii],
      muAveraged: 0.5 * (mu[0] + mu[1]),
      lambdaAveraged: 0.5 * (lambda[0] + lambda[1]),
    });
  }

  // To show the updated vakues in HTML page
  $("#Vvalue").html(Math.round(Number(sp["V"]) * 100) / 100);
  $("#Wvalue").html(Math.round(Number(sp["omega"]) * 1000) / 1000);
  $("#Wrpmvalue").html(Math.round(Number(sp["omega"] * 9.5493) * 100) / 100);
  $("#mStarValue2").html(Math.round(Number(sp["m_star"] * 1e18) * 100) / 100);
  $("#RmValue2").html(Math.round(Number(sp["Rm"]) * 100) / 100);
  $("#dmval1").html(
    Math.round(
      Number(Math.pow(sp["m_star"] / prop["m0"], 1 / prop["Dm"])) * 100
    ) / 100
  );
  var e = 1.60218e-19;
  $("#omegahnum").val(Math.round(prop["omega_hat"] * 1e5) / 1e5);

  // send to generiv plot updater defined below
  refreshPlot(dataTri, data1C);
}
//----------------------------------End-------------------------------------------//

function refreshPlot(dataTri, data1C) {
  d3.select("svg").remove();
  // Select the my_dataviz function and then set the width and height
  var $container = $("#my_dataviz"),
    // width_a = window.screen.height * 0.1
    width_a = 0.9 * Math.min($container.width(), 870),
    height_a = $container.height();

  // for legend
  var margin_legend = {
    top: 0,
    right: 30,
    bottom: 0,
    left: 60,
  };

  // set the dimensions and margins of the graph
  var margin = {
      top: 30,
      right: 0,
      bottom: 50,
      left: 0,
    },
    width = width_a - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //-- Add background rectangle --//
  svg
    .append("rect")
    .attr("width", "100%")
    .attr("class", "plot-fill")
    .attr("height", height);

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([0.5, 1.5])
    .range([0, width * 0.9]); //.range([0, width-200]);
  var xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis")
    .call(d3.axisBottom(x).ticks(5));

  var xAxis2 = svg
    .append("g")
    .attr("class", "axis")
    .call(d3.axisTop(x).ticks(5));

  // Add Y axis
  var yMax = 1,
    yMin = 0;

  var y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);
  var yAxis = svg
    .append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5));
  var yAxis2 = svg
    .append("g")
    .attr("transform", "translate(" + width + ",0)")
    .attr("class", "axis")
    .call(d3.axisRight(y).ticks(5));

  //-- Add axis labels --//
  // Add X axis label:
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("class", "legend-label")
    .text("Particle mass over setpoint mass");

  // Y axis label:
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "legend-label")
    .attr("transform", "translate(-40," + height / 2 + ")rotate(-90)")
    .text("Transfer function, Ω");

  // generate plot
  svg
    .append("path")
    .datum(dataTri)
    .attr("id", "triIdeal")
    .attr("fill", "none")
    .attr("stroke", colors[1])
    .attr("stroke-width", 3.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.yIdeal);
        })
    );

  svg
    .append("path")
    .datum(dataTri)
    .attr("id", "triNonIdeal")
    .attr("fill", "none")
    .attr("class", "diff-line")
    .attr("stroke", colors[2])
    .attr("stroke-dasharray", "4 2")
    .attr("stroke-width", 3.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.yNonIdeal);
        })
    );

  svg
    .append("path")
    .datum(data1C)
    .attr("id", "l1c")
    .attr("fill", "none")
    .attr("stroke", colors[0])
    .attr("stroke-width", 3.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.yc);
        })
    );

  svg
    .append("path")
    .datum(data1C)
    .attr("id", "l1cd")
    .attr("fill", "none")
    .attr("class", "diff-line")
    .attr("stroke", colors[3])
    .attr("stroke-dasharray", "4 2")
    .attr("stroke-width", 3.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.yc_diff);
        })
    );
}

//----------------------------------End-------------------------------------------//
