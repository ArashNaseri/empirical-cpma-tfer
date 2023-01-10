// Define color scheme.
var colors = ["#1E2978", "#48DEB1", "#222222", "#DD393A"]; // new

var numberOftextImput = document.querySelectorAll(".textBoxInput").length;
for (var i = 0; i < numberOftextImput; i++){
  document.querySelectorAll(".textBoxInput")[i].addEventListener("Keyboard", update)
}


var m_star = Number($("#m_star").val())*1e-18;
var Rm = Number($("#Rm").val());
var Q = Number($("#qNum").val());
// var Dm=$("#Dmnum").value;


prop = prop_pma()
prop['omega_hat'] = 0.9696

var mr_vec = linspace(0.5, 2, 601)

var rho_eff100=Number($("#rhonum").val());
prop['Dm']=Number($("#Dmnum").val());

var m100 = rho_eff100 * (pi * Math.pow(100e-9, 3) / 6) // effective density @ 1 nm
// prop['Dm'] = 2.48

prop['m0'] = m100 * Math.pow((1 / 100), prop['Dm']) // adjust mass-mobility relation parameters








// ________________________________________________________________


var mu = fWidth ( m_star*10e18, Rm, Q)
var lambda = fLoss ( m_star*10e18, Rm, Q)

document.getElementById('muOut').innerHTML = mu[0].toFixed(3)+", " + mu[1].toFixed(3);
document.getElementById('lambdaOut').innerHTML= lambda[0].toFixed(3)+ ", " + lambda[1].toFixed(3);

// ________________________________________________________________


var [mTilde, IdealOmega]= tri_tfer (Rm,  1, 1)
var [mTilde, nonIdealOmega]= tri_tfer (Rm,  0.5*(mu[0]+mu[1]), 0.5*(lambda[0]+lambda[1]))

var data = [];

for (ii = 0; ii < mTilde.length; ii++) {
    data.push({
      x: mTilde[ii],
      yIdeal: IdealOmega[ii],
      yNonIdeal: nonIdealOmega[ii]
    })
}
// ----------------------------------------------------------------





m_vec = mr_vec.map(function(x) {
  return x * m_star;
}) // gets points at which to evaluate the transfer function
d = m_vec.map(function(x) {
  return (Math.pow(x / prop['m0'], 1 / prop['Dm']) * 1e-9);
}) // gets new mobility diameters using mass-mobility relation


sp_var1 = 'm_star';
sp_var2 = 'Rm';
// generate a new setpoint
__left0__ = get_setpoint(prop, sp_var1, m_star, sp_var2, Rm)
sp = __left0__[0]

var z_vec = [1]

var Lambda_1C = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C)
var Lambda_1C_diff = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C_diff)

var data1C = [];
for (ii = 0; ii < m_vec.length; ii++) {
  data1C.push({
      x: mr_vec[ii],
      yc: Lambda_1C[ii],
      yc_diff: Lambda_1C_diff[ii]
    })
}


// ---------------------------------------------------------- 
// Select the my_dataviz function and then set the width and height
var $container = $('#my_dataviz'),
  width_a = 0.95 * Math.min($container.width(), 870),
  height_a = $container.height()


// for legend
var margin_legend = {
  top: 0,
  right: 50,
  bottom: 0,
  left: 60
}




var svg_legend = d3.select("#my_legend")
  .append("svg")
  .attr("width", 500)//width_a - margin_legend.left - margin_legend.right
  .attr("height", 110)
  .append("g")


// legend for lines

svg_legend.append("text")
  .attr("x", 25).attr("y", 34).attr("class", "legend-label")
  .text("Ideal triangular model (μ = 1, λ = 1)")
  .attr("alignment-baseline", "middle")
triIdeal = [{
  x: 0,
  y: 33
}, {
  x: 18,
  y: 33
}]

svg_legend.append("path")
  .datum(triIdeal)
  .attr("fill", "none")
  .attr("stroke", colors[1])
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
  )


svg_legend.append("text")
  .attr("x", 25).attr("y", 56).attr("class", "legend-label")
  .text("Non-ideal triangular model ( μ ="+ 0.5*(mu[0]+mu[1]).toFixed(2)+ 
  ", λ = "+ 0.5*(lambda[0]+lambda[1]).toFixed(2)+")").attr("alignment-baseline", "middle")
  triNonIdeal = [{
  x: 0,
  y: 54
}, {
  x: 18,
  y: 54
}]

svg_legend.append("path")
  .datum(triNonIdeal)
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[2])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
  )

svg_legend.append("text")
  .attr("x", 25).attr("y", 78).attr("class", "legend-label")
  .text("Theoretical Trapezoidal model").attr("alignment-baseline", "middle")
d1c = [{
  x: 0,
  y: 77
}, {
  x: 18,
  y: 77
}]

svg_legend.append("path")
  .datum(d1c)
  .attr("fill", "none")
  .attr("stroke", colors[0])
  .attr("stroke-width", 1.0)
  .attr("d", d3.line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
  )

svg_legend.append("text")
  .attr("x", 25).attr("y", 100).attr("class", "legend-label")
  .text("Theoretical Diffusion model").attr("alignment-baseline", "middle")
d1c_diff = [{
  x: 0,
  y: 99
}, {
  x: 18,
  y: 99
}]

svg_legend.append("path")
  .datum(d1c_diff)
  .attr("fill", "none")
  .attr("stroke", colors[3])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 1.0)
  .attr("d", d3.line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
  )






// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 1.5,
    bottom: 50,
    left: 55
  },
  width = width_a - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//-- Add background rectangle --//
svg.append("rect")
  .attr("width", "100%")
  .attr("class", "plot-fill")
  .attr("height", height);



// Add X axis
var x = d3.scaleLinear()
  .domain([0, 2])
  .range([0, 330]); //.range([0, width-200]); 
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "axis")
  .call(d3.axisBottom(x).ticks(5));
 
var xAxis2 = svg.append("g")
  .attr("class", "axis")
  .call(d3.axisTop(x).ticks(5));

// Add Y axis
var yMax = 1.2,
  yMin = 0;

var y = d3.scaleLinear()
  .domain([yMin, yMax])
  .range([height, 0]);
var yAxis = svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(5));
  
var yAxis2 = svg.append("g")
  .attr("transform", "translate(" + 330 + ",0)")//  .attr("transform", "translate(" + width + ",0)")
  .attr("class", "axis")
  .call(d3.axisRight(y).ticks(5))

//-- Add axis labels --//
// Add X axis label:
svg.append("text")
  .attr("text-anchor", "middle")
  .attr('x', 170)//width / 2
  .attr('y', height + 35)
  .attr("class", "legend-label")
  .text("Particle mass over setpoint mass, m/m*");

// Y axis label:
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("class", "legend-label")
  .attr('transform', 'translate(-40,' + height / 2 + ')rotate(-90)')
  .text("Transfer function, Ω")


// generate plot
svg.append("path")
  .datum(data)
  .attr("id", "triIdeal")
  .attr("fill", "none")
  .attr("stroke", colors[1])
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yIdeal)
    })
  )


svg.append("path")
  .datum(data)
  .attr("id", "triNonIdeal")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[2])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yNonIdeal)
    })
  )

  svg.append("path")
  .datum(data1C)
  .attr("id", "l1c")
  .attr("fill", "none")
  .attr("stroke", colors[0])
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yc)
    })
  )


svg.append("path")
  .datum(data1C)
  .attr("id", "l1cd")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[3])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yc_diff)
    })
  )





  $('#Vval').html(sp['V'].toPrecision(3));
  $('#Wval').html(sp['omega'].toPrecision(3));
  $('#Wrpmval').html((sp['omega'] * 9.5493).toPrecision(3));
  $('#Rmval2').html(Rm);
  $('#mStarval2').html(m_star*1e18);



  
  // $("#varName1").html('hiiii');
  // $("#varName2").html($("#varName5").html());


  $( "#sp-mode" ).change(function() {

      if ($(this).val() !== ' Mass + Resolution + flow rate') {
        $("#varName1").html($("#varName3").html());
        $("#varName2").html($("#varName4").html());
        $("#m_star").val(Number(sp['omega'].toPrecision(3)));
        $("#Rm").val(Number(sp['V'].toPrecision(3)));
        alert($(this).val())
      } else {
        
      }
  });









  

  var update = function() {
      d3.select("svg").remove();
  
    var m_star = Number($("#m_star").val())*1e-18;
    var Rm = Number($("#Rm").val());
    var Q = Number($("#qNum").val());
    // alert('Please')
    var mr_vec = linspace(0.5, 2, 601)
    prop = prop_pma()
    prop['omega_hat'] = 0.9696
    var rho_eff100=Number($("#rhonum").val());
    prop['Dm']=Number($("#Dmnum").val());
  
    // must be updated from user interface 

    var m100 = rho_eff100 * (pi * Math.pow(100e-9, 3) / 6) // effective density @ 1 nm
    prop['m0'] = m100 * Math.pow((1 / 100), prop['Dm']) // adjust mass-mobility relation parameters


    m_vec = mr_vec.map(function(x) {
      return x * m_star;
    }) // gets points at which to evaluate the transfer function
    d = m_vec.map(function(x) {
      return (Math.pow(x / prop['m0'], 1 / prop['Dm']) * 1e-9);
    }) // gets new mobility diameters using mass-mobility relation
    
    
    sp_var1 = 'm_star';
    sp_var2 = 'Rm';
    // generate a new setpoint
    __left0__ = get_setpoint(prop, sp_var1, m_star, sp_var2, Rm)
    sp = __left0__[0]

    var z_vec = [1]

  
    var Lambda_1C = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C)
    var Lambda_1C_diff = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C_diff)

    var data1C = [];
    for (ii = 0; ii < m_vec.length; ii++) {
      data1C.push({
          x: mr_vec[ii],
          yc: Lambda_1C[ii],
          yc_diff: Lambda_1C_diff[ii]
        })
    }












// ________________________________________________________________
  switch(true){

    case ( Q < 0.3 || Q >8):
      mu = [0, 0];
      alert("Caution! Please enter a number between 0.3 and 8 LPM")
    break;

    default:
    
      var mu = fWidth ( m_star*10e18, Rm, Q)

  }


  switch(true){

    case (Q == 0.3 || Q == 1.5 || Q == 4 || Q == 8):

      var lambda = fLoss ( m_star*10e18, Rm, Q)

      break;

    case (Q < 0.3 || Q > 8 ):

      lambda =[0,0];

      break
    case (Q > 0.3 && Q < 1.5):


      var lambda03=fLoss (m_star*10e18, Rm, 0.3)
      var lambda15=fLoss (m_star*10e18, Rm, 1.5)

        lambda = linearInterp([0.3,1.5], [(lambda03[0]+lambda03[1])/2,(lambda15[0]+lambda15[1])/2],Q)

      break;

    case (Q > 1.5 && Q < 4):
      var lambda15=fLoss (m_star*10e18, Rm, 1.5)
      var lambda4=fLoss (m_star*10e18, Rm, 4)
        lambda = linearInterp([1.5, 4], [(lambda15[0]+lambda15[1])/2,(lambda4[0]+lambda4[1])/2],Q)

      break;

    case (Q > 4 && Q < 8):

      var lambda4=fLoss (m_star*10e18, Rm, 0.3)
      var lambda8=fLoss (m_star*10e18, Rm, 1.5)
        lambda = linearInterp([4, 8], [(lambda4[0]+lambda4[1])/2,(lambda8[0]+lambda8[1])/2],Q)
      break;

    }

    document.getElementById('muOut').innerHTML =[mu[0].toFixed(3), mu[1].toFixed(3)];
    document.getElementById('lambdaOut').innerHTML=[lambda[0].toFixed(3), lambda[1].toFixed(3)];


  var [mTilde, IdealOmega]= tri_tfer (Rm,  1, 1)
  var [mTilde, nonIdealOmega]= tri_tfer (Rm,  0.5*(mu[0]+mu[1]), 0.5*(lambda[0]+lambda[1]))

  var data = [];
  
  for (ii = 0; ii < mTilde.length; ii++) {
      data.push({
        x: mTilde[ii],
        yIdeal: IdealOmega[ii],
        yNonIdeal: nonIdealOmega[ii]
      })
  }
  m_vec = mr_vec.map(function(x) {
    return x * m_star;
  }) // gets points at which to evaluate the transfer function
  d = m_vec.map(function(x) {
    return (Math.pow(x / prop['m0'], 1 / prop['Dm']) * 1e-9);
  }) // gets new mobility diameters using mass-mobility relation

  sp_var1 = 'm_star';
  sp_var2 = 'Rm';
  // generate a new setpoint
  __left0__ = get_setpoint(prop, sp_var1, m_star, sp_var2, Rm)
  sp = __left0__[0]
  var z_vec = [1]

  var Lambda_1C = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C)
  var Lambda_1C_diff = parse_fun(sp, m_vec, d, z_vec, prop, tfer_1C_diff)
  var data1C = [];
  for (ii = 0; ii < m_vec.length; ii++) {
    data1C.push({
        x: mr_vec[ii],
        yc: Lambda_1C[ii],
        yc_diff: Lambda_1C_diff[ii]
      })
  }
  
  
  // ---------------------------------------------------------- 
  // Select the my_dataviz function and then set the width and height
  var $container = $('#my_dataviz'),
  width_a = 0.95 * Math.min($container.width(), 870),
  height_a = $container.height()


// for legend
var margin_legend = {
  top: 0,
  right: 50,
  bottom: 0,
  left: 60
}










// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 1.5,
    bottom: 50,
    left: 55
  },
  width = width_a - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//-- Add background rectangle --//
svg.append("rect")
  .attr("width", "100%")
  .attr("class", "plot-fill")
  .attr("height", height);



// Add X axis
var x = d3.scaleLinear()
  .domain([0, 2])
  .range([0, 330]); //.range([0, width-200]); 
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "axis")
  .call(d3.axisBottom(x).ticks(5));
 
var xAxis2 = svg.append("g")
  .attr("class", "axis")
  .call(d3.axisTop(x).ticks(5));

// Add Y axis
var yMax = 1.2,
  yMin = 0;

var y = d3.scaleLinear()
  .domain([yMin, yMax])
  .range([height, 0]);
var yAxis = svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(5));
  
var yAxis2 = svg.append("g")
  .attr("transform", "translate(" + 330 + ",0)")//  .attr("transform", "translate(" + width + ",0)")
  .attr("class", "axis")
  .call(d3.axisRight(y).ticks(5))

//-- Add axis labels --//
// Add X axis label:
svg.append("text")
  .attr("text-anchor", "middle")
  .attr('x', 170)//width / 2
  .attr('y', height + 35)
  .attr("class", "legend-label")
  .text("Particle mass over setpoint mass, m/m*");

// Y axis label:
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("class", "legend-label")
  .attr('transform', 'translate(-40,' + height / 2 + ')rotate(-90)')
  .text("Transfer function, Ω")


// generate plot
svg.append("path")
  .datum(data)
  .attr("id", "triIdeal")
  .attr("fill", "none")
  .attr("stroke", colors[1])
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yIdeal)
    })
  )


svg.append("path")
  .datum(data)
  .attr("id", "triNonIdeal")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[2])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yNonIdeal)
    })
  )

  svg.append("path")
  .datum(data1C)
  .attr("id", "l1c")
  .attr("fill", "none")
  .attr("stroke", colors[0])
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yc)
    })
  )


svg.append("path")
  .datum(data1C)
  .attr("id", "l1cd")
  .attr("fill", "none")
  .attr("class", "diff-line")
  .attr("stroke", colors[3])
  .attr('stroke-dasharray', "4 2")
  .attr("stroke-width", 2.75)
  .attr("d", d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.yc_diff)
    })
  )





  $('#Vval').html(sp['V'].toPrecision(3));
  $('#Wval').html(sp['omega'].toPrecision(3));
  $('#Wrpmval').html((sp['omega'] * 9.5493).toPrecision(3));


  // if (sp['V'].toPrecision(3)<0.1 ||
  //  sp['V'].toPrecision(3)>1000 ||
  //  (sp['omega'] * 9.5493).toPrecision(3)<52.359878||
  //  (sp['omega'] * 9.5493).toPrecision(3)>1256.637061) {
  //     alert("This configuration is out of CPMA operational range")
  // }



}