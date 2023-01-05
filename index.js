
/* Reorg. into a set of arrays */
Rm = [];
ns = [];
nc = [];
Ns = [];
Ntot = [];
Ns_avg = [];
R12 = [];
time = [];
lam = [];
err = [];
for (ii = 0; ii < data.length; ii++) {
  Rm.push(data[ii].Rm);
  ns.push(data[ii].ns);
  nc.push(data[ii].nc);
  Ns.push(data[ii].Ns);
  Ntot.push(data[ii].Ntot);
  Ns_avg.push(data[ii].Ns_avg);
  R12.push(data[ii].R12);
  time.push(data[ii].time);
  lam.push(data[ii].Lambda);
  err.push(data[ii].Error);
}

/* Factor up and down for Ntot. 3.16 ~ sqrt(10) to span one order of magnitude */
/* sqrt(5) spans half an order of magnitude */
var a_factor = Math.sqrt(5);

/* Function to filter out based on Ntot */
function filterA(Ntot, a, time, b, d, R12, c, vec) {

  /* Filter by Ntot */
  /* Note a_factor is adopted from variable outside of function above */
  outa = [];
  outt = [];
  outR1 = []
  for (ii = 0; ii < Ntot.length; ii++) {
    if ((Ntot[ii] <= (a * a_factor)) && (Ntot[ii] >= (a / a_factor))) {
      outa.push(vec[ii]);
      outt.push(time[ii]);
      outR1.push(R12[ii]);
    }
  }

  /* Filter by time */
  if (d == "mins") { b = b / 60 }  /* accommodate minutes input */
  outb = [];
  outR2 = [];
  for (tt = 0; tt < outt.length; tt++) {
    if (outt[tt] <= (b * 60 * 60)) {
      outb.push(outa[tt]);
      outR2.push(outR1[tt])
    }
  }

  /* Filter by R12 */
  c = c.split(','); /* Interpret select value */
  c1 = parseFloat(c[0]);
  c2 = parseFloat(c[1]);
  out = [];
  for (rr = 0; rr < outR2.length; rr++) {
    if ((outR2[rr] > c1) && (outR2[rr] <= c2)) {
      out.push(outb[rr]);
    }
  }

  if (out.length == []) {
    out = "-";
  }

  return out;
}


/* Function to get the smallest index. */
/* Used to get smallest error */
function indexOfSmallest(a) {
  var lowest = 0;
  for (var ii = 1; ii < a.length; ii++) {
    if (a[ii] < a[lowest]) lowest = ii;
  }
  return lowest;
}


/* Function to update results */
function update() {

  a = document.getElementById("Ntot_in").value;
  b = document.getElementById("time_in").value;
  c = document.getElementById("R12_in").value;
  d = document.getElementById("time_unit").value;

  err0 = filterA(Ntot, a, time, b, d, R12, c, err); /* lowest error */

  /* Update range for Ntot. */
  document.getElementById("Ntot_in_down").innerHTML = (a / a_factor).toExponential(1);
  document.getElementById("Ntot_in_up").innerHTML = (a * a_factor).toExponential(1);

  /* Display number of simulations in filtered set */
  document.getElementById("no_out").innerHTML = err0.length.toString();
  if (err0 == "-") {
    /* in this case, correct to zero */
    document.getElementById("no_out").innerHTML = "0";
  }

  /* Index in Ntot-, time-, R12-selected array */
  idx = indexOfSmallest(err0);

  /* Update the corresponding outputs */
  err0 = err0[idx];
  document.getElementById("err_out").innerHTML = err0.toString().substr(0, 5);

  Rm0 = filterA(Ntot, a, time, b, d, R12, c, Rm)[idx];
  if (Rm0 < 0.2) {
    document.getElementById("Rm_out").innerHTML = "<0.2";
  } else {
    document.getElementById("Rm_out").innerHTML = Rm0.toString().substr(0, 3);
  }

  nc0 = filterA(Ntot, a, time, b, d, R12, c, nc)[idx];
  document.getElementById("nc_out").innerHTML = nc0.toString().substr(0, 5);

  ns0 = filterA(Ntot, a, time, b, d, R12, c, ns)[idx];
  if (ns0 > 100) {
    document.getElementById("ns_out").innerHTML = ">100";
  } else {
    document.getElementById("ns_out").innerHTML = ns0.toString().substr(0, 5);
  }

  Ns0 = filterA(Ntot, a, time, b, d, R12, c, Ns)[idx];
  if (Ns0 == "-") {
    document.getElementById("Ns0_out").innerHTML = "-";
  } else {
    Ns0 = Math.round(Ns0 / 100) / 10;  // round to nearest 100 and convert to 1000s
    document.getElementById("Ns0_out").innerHTML =
      Ns0.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  // adds commas to numbers

  /* Display and format time output */
  time0 = filterA(Ntot, a, time, b, d, R12, c, time)[idx];
  if (time0 == "-") {
    /* because of /60, explicitly check for "-" returned */
    document.getElementById("time_out").innerHTML = "-";
  } else if (time0 > (1.5 * 60 * 60)) {
    /* display in hours */
    document.getElementById("time_out").innerHTML = (time0 / 60 / 60).toString().substr(0, 4);
    document.getElementById("time_out_unit").innerHTML = "hrs";
  } else {
    /* display in minutes */
    time0 = Math.round(time0 / 60);  // convert to minutes and round to closest minute
    document.getElementById("time_out").innerHTML = time0.toString().substr(0, 4);
    document.getElementById("time_out_unit").innerHTML = "mins";
  }

  R120 = filterA(Ntot, a, time, b, d, R12, c, R12)[idx];
  document.getElementById("R12_out").innerHTML = R120.toString().substr(0, 4);

  c = c.split(','); /* interpret select value */
  c1 = parseFloat(c[0]);
  document.getElementById("distimg").src = "imgs/" + c1.toString().substr(0, 4) + ".png";
}

update();
document.getElementById("Ntot_in").addEventListener("change", update);
document.getElementById("time_in").addEventListener("change", update);
document.getElementById("time_unit").addEventListener("change", update);
document.getElementById("R12_in").addEventListener("change", update);
