
//==========================================================================//
// TFER_PMA CODE -----------------------------------------------------------//
var pi = 3.14159265359

// Define Math.log10 for IE support.
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};
// <---------------------------------------------------->
var prop_pma = function(opts) {
  if (typeof opts == 'undefined' || (opts != null && opts.hasOwnProperty("__kwargtrans__"))) {
    var opts = 'olfert';
  };
  console.log(opts)
  if (opts == 'olfert') {
    var prop = {
      'r1': 0.06,
      'r2': 0.061,
      'L': 0.2,
      'p': 1,
      'T': 293,
      'Q': (3 / 1000) / 60,
      'omega_hat': 32 / 33
    };
  }
  prop['rc'] = (prop['r1'] + prop['r2']) / 2;
  prop['r_hat'] = prop['r1'] / prop['r2'];
  prop['del'] = (prop['r2'] - prop['r1']) / 2;
  prop['A'] = pi * (Math.pow(prop['r2'], 2) - Math.pow(prop['r1'], 2));
  prop['v_bar'] = prop['Q'] / prop['A'];
  var kB = 1.3806488e-23;
  prop['D'] = (function __lambda__(B) {
    return (kB * prop['T']) * B;
  });
  prop['Dm'] = 3;
  prop['m0'] = 4.7124e-25; // mass @ dm = 1 in fg
  return prop;
};
// <------------------------------------------------------>
// Calculate CPMA configurations at the given setpoint //
// <------------------------------------------------------>
var get_setpoint = function(prop) {
  if (typeof prop == 'undefined' || (prop != null && prop.hasOwnProperty("__kwargtrans__"))) {
    ;
    var prop = {};
  };
  var sp = {
    'm_star': null,
    'V': null,
    'omega': null,
    'omega1': null,
    'Rm': null
  };
  if (arguments.length == 3) {
    sp[arguments[1]] = arguments[2];
    sp['Rm'] = 3;
  } else if (arguments.length == 5) {
    sp[arguments[1]] = arguments[2];
    sp[arguments[3]] = arguments[4];
  }
  var e = 1.60218e-19;
  //  if m* is not given
  if (sp['m_star'] == null) {
    // (m* is not given) omega and Voltage are given 
    if (!(sp['omega1'])) {
      sp['omega1'] = sp['omega'] / ((Math.pow(prop['r_hat'], 2) - prop['omega_hat']) /
        (Math.pow(prop['r_hat'], 2) - 1) + ((Math.pow(prop['r1'], 2) * (prop['omega_hat'] - 1)) /
          (Math.pow(prop['r_hat'], 2) - 1)) / Math.pow(prop['rc'], 2));
    }
    sp['alpha'] = (sp['omega1'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['beta'] = ((sp['omega1'] * Math.pow(prop['r1'], 2)) * (prop['omega_hat'] - 1)) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['m_star'] = sp['V'] / ((Math.log(1 / prop['r_hat']) / e) *
      Math.pow(sp['alpha'] * prop['rc'] + sp['beta'] / prop['rc'], 2));
    sp['omega'] = sp['alpha'] + sp['beta'] / Math.pow(prop['rc'], 2);
    sp['omega2'] = sp['alpha'] + sp['beta'] / Math.pow(prop['r2'], 2);

    //  m* and omega1 is given
  } else if (sp['omega1'] != null) {
    sp['alpha'] = (sp['omega1'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['beta'] = ((sp['omega1'] * Math.pow(prop['r1'], 2)) * (prop['omega_hat'] - 1)) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['V'] = ((sp['m_star'] * Math.log(1 / prop['r_hat'])) / e) *
      Math.pow(sp['alpha'] * prop['rc'] + sp['beta'] / prop['rc'], 2);
    sp['omega2'] = sp['alpha'] + sp['beta'] / Math.pow(prop['r2'], 2);
    sp['omega'] = sp['alpha'] + sp['beta'] / Math.pow(prop['rc'], 2);

 //  if omega and m* are given
  } else if (sp['omega'] != null) {
    sp['omega1'] = sp['omega'] / ((Math.pow(prop['r_hat'], 2) - prop['omega_hat']) /
      (Math.pow(prop['r_hat'], 2) - 1) + ((Math.pow(prop['r1'], 2) * (prop['omega_hat'] - 1)) /
        (Math.pow(prop['r_hat'], 2) - 1)) / Math.pow(prop['rc'], 2));
    sp['alpha'] = (sp['omega1'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['beta'] = ((sp['omega1'] * Math.pow(prop['r1'], 2)) * (prop['omega_hat'] - 1)) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['V'] = ((sp['m_star'] * Math.log(1 / prop['r_hat'])) / e) *
      Math.pow(sp['alpha'] * prop['rc'] + sp['beta'] / prop['rc'], 2);
    sp['omega2'] = sp['alpha'] + sp['beta'] / Math.pow(prop['r2'], 2);

  //  if Voltage and m* are given
  } else if (sp['V'] != null) {
    var v_theta_rc = Math.sqrt((sp['V'] * e) / (sp['m_star'] * Math.log(1 / prop['r_hat'])));
    var A = (prop['rc'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1) + (1 / prop['rc']) * ((Math.pow(prop['r1'], 2) *
        (prop['omega_hat'] - 1)) / (Math.pow(prop['r_hat'], 2) - 1));
    sp['omega1'] = v_theta_rc / A;
    sp['alpha'] = (sp['omega1'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['beta'] = ((sp['omega1'] * Math.pow(prop['r1'], 2)) * (prop['omega_hat'] - 1)) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['omega2'] = sp['alpha'] + sp['beta'] / Math.pow(prop['r2'], 2);
    sp['omega'] = sp['alpha'] + sp['beta'] / Math.pow(prop['rc'], 2);

  //  if Rm and m* are given
  } else if (sp['Rm'] != null) {
    var n_B = get_nb(sp['m_star'], prop);
    var __left0__ = mp2zp(sp['m_star'], 1, prop['T'], prop['p'], prop);
    var B_star = __left0__[0];
    sp['m_max'] = sp['m_star'] * (1 / sp['Rm'] + 1);
    sp['omega'] = Math.sqrt(prop['Q'] / ((((((sp['m_star'] * B_star) * 2) * pi) *
      Math.pow(prop['rc'], 2)) * prop['L']) * (Math.pow(sp['m_max'] / sp['m_star'], n_B + 1) -
      Math.pow(sp['m_max'] / sp['m_star'], n_B))));
    sp['omega1'] = sp['omega'] / ((Math.pow(prop['r_hat'], 2) - prop['omega_hat']) /
      (Math.pow(prop['r_hat'], 2) - 1) + ((Math.pow(prop['r1'], 2) * (prop['omega_hat'] - 1)) /
        (Math.pow(prop['r_hat'], 2) - 1)) / Math.pow(prop['rc'], 2));
    sp['alpha'] = (sp['omega1'] * (Math.pow(prop['r_hat'], 2) - prop['omega_hat'])) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['beta'] = ((sp['omega1'] * Math.pow(prop['r1'], 2)) * (prop['omega_hat'] - 1)) /
      (Math.pow(prop['r_hat'], 2) - 1);
    sp['omega2'] = sp['alpha'] + sp['beta'] / Math.pow(prop['r2'], 2);
    sp['V'] = ((sp['m_star'] * Math.log(1 / prop['r_hat'])) / e) * Math.pow(sp['alpha'] * prop['rc'] +
      sp['beta'] / prop['rc'], 2);
   //  Nothing is given
  } else {
    console.log('No setpoint specified.');
  }

  var m_star = sp['m_star'];
  if (!(sp['Rm'])) {
    var __left0__ = get_resolution(sp['m_star'], sp['omega'], prop);
    sp['Rm'] = __left0__[0];
    sp['m_max'] = __left0__[1];
  }
  return [sp, m_star];
};
// End of function


// <------------------------------------------------------>
// Calculate CPMA resolution by m* and omega             //
// <------------------------------------------------------>

var get_resolution = function(m_star, omega, prop) {
  console.log('Finding resolution...');
  var n_B = get_nb(m_star, prop);
  var __left0__ = mp2zp(m_star, 1, prop['T'], prop['p'], prop);
  var B_star = __left0__[0];
  var t0 = prop['Q'] / ((((((m_star * B_star) * 2) * pi) * prop['L']) * Math.pow(omega, 2)) * Math.pow(prop['rc'], 2));
  var m_rat = function(Rm) {
    return 1 / Rm + 1;
  };
  var fun = function(Rm) {
    var fun1 = Math.pow(m_rat(Rm), n_B + 1) - Math.pow(m_rat(Rm), n_B);
    return Math.pow(1e2 * (t0 - fun1), 2);
  };

  var Rm = optimjs.minimize_Powell(fun, [3.5]);
  Rm = Rm.argument;

  // Retry if previous method failed with Rm scaled by factors of 10
  for (var i = 1; i < 12; i++) {
    f_retry = false; // initiate retry
    if (isNaN(Rm[0])) {
      f_retry = true;
    } else if (Rm[0] < 0) {
      f_retry = true;
    }
    mod = Math.pow(10, (i + 1) / 2)
    console.log("Retry " + i.toString() + " (for " + mod.toString() + "): " + f_retry)
    if (f_retry) {
      var fun = function(Rm) {
        var fun1 = Math.pow(m_rat(Rm / mod), n_B + 1) - Math.pow(m_rat(Rm / mod), n_B);
        return Math.pow(1e2 * (t0 - fun1), 2);
      };
      var Rm = optimjs.minimize_Powell(fun, [1.5]);
      Rm = [Rm.argument[0] / mod];
      console.log(Rm)
    } else {
      break;
    }
  }


  console.log('Finished. Rm = ')
  console.log(Rm[0])
  console.log(' ')

  var m_max = m_star * (1 / Rm + 1);
  return [Rm[0], m_max];
};


// <------------------------------------------------------>
//
// <------------------------------------------------------>
var get_nb = function(m_star, prop) {
  var m_high = m_star * 1.001;
  var m_low = m_star * 0.999;
  var __left0__ = mp2zp(m_high, 1, prop['T'], prop['p'], prop);
  var B_high = __left0__[0];
  var __left0__ = mp2zp(m_low, 1, prop['T'], prop['p'], prop);
  var B_low = __left0__[0];
  var n_B = Math.log10(B_high / B_low) / Math.log10(m_high / m_low);
  return n_B;
};


// <------------------------------------------------------>
// Calculate electric mobility from  of mobility diameter//
// <------------------------------------------------------>
var dm2zp = function(d, z, T, p) {
  if (typeof T == 'undefined' || (T != null && T.hasOwnProperty("__kwargtrans__"))) {
    ;
    var T = 0.0;
  };
  if (typeof p == 'undefined' || (p != null && p.hasOwnProperty("__kwargtrans__"))) {
    ;
    var p = 0.0;
  };
  var e = 1.6022e-19;
  if (T == 0.0 || p == 0.0) {
    var mu = 1.82e-05;
    var B = Cc(d) / (((3 * pi) * mu) * d);
  } else {
    var S = 110.4;
    var T_0 = 296.15;
    var vis_23 = 1.83245e-05;
    var mu = (vis_23 * Math.pow(T / T_0, 1.5)) * ((T_0 + S) / (T + S));
    var B = Cc(d, T, p) / (((3 * pi) * mu) * d);
  }
  var Zp = (B * e) * z;
  return [B, Zp];
};

// <------------------------------------------------------------>
// Calculate Cunningham correction factor (modify drag force).//
// <------------------------------------------------------------>
var Cc = function(d, T, p) {
  if (typeof T == 'undefined' || (T != null && T.hasOwnProperty("__kwargtrans__"))) {
    ;
    var T = 0.0;
  };
  if (typeof p == 'undefined' || (p != null && p.hasOwnProperty("__kwargtrans__"))) {
    ;
    var p = 0.0;
  };
  if (T == 0.0 || p == 0.0) {
    var mfp = 6.65e-08;
    var A1 = 1.257;
    var A2 = 0.4;
    var A3 = 0.55;
  } else {
    var S = 110.4;
    var mfp_0 = 6.73e-08;
    var T_0 = 296.15;
    var p_0 = 101325;
    var p = p * p_0;
    var mfp = ((mfp_0 * Math.pow(T / T_0, 2)) * (p_0 / p)) * ((T_0 + S) / (T + S));
    var A1 = 1.165;
    var A2 = 0.483;
    var A3 = 0.997 / 2;
  }
  var Kn = (2 * mfp) / d;
  var Cc = 1 + Kn * (A1 + A2 * Math.exp(-(2 * A3) / Kn));
  return Cc;
};
// <------------------------------------------------------>
// Calculate electric mobility from  of particle mass    //
// <------------------------------------------------------>
var mp2zp = function(m, z, T, P, prop) {
  if (typeof T == 'undefined' || (T != null && T.hasOwnProperty("__kwargtrans__"))) {
    ;
    var T = 0.0;
  };
  if (typeof P == 'undefined' || (P != null && P.hasOwnProperty("__kwargtrans__"))) {
    ;
    var P = 0.0;
  };
  if (typeof prop == 'undefined' || (prop != null && prop.hasOwnProperty("__kwargtrans__"))) {
    ;
    var prop = {};
  };
  if (!('m0' in prop) || !('Dm' in prop)) {
    sys.exit('Please specify the mass-mobility relation parameters in prop.');
  }
  var d = Math.pow(m / prop['m0'], 1 / prop['Dm']) * 1e-9;
  if (T == 0.0 || P == 0.0) {
    var __left0__ = dm2zp(d, z);
    var B = __left0__[0];
    var Zp = __left0__[1];
  } else {
    var __left0__ = dm2zp(d, z, T, P);
    var B = __left0__[0];
    var Zp = __left0__[1];
  }
  return [B, Zp, d];
};

// <------------------------------------------------------>
// Calculate theoretical Diffusing CPMA transfer function //
// <------------------------------------------------------>

var tfer_1C_diff = function(sp, m, d, z, prop) {
  if (typeof prop == 'undefined' || (prop != null && prop.hasOwnProperty("__kwargtrans__"))) {
    ;
    var prop = {};
  };
  var __left0__ = parse_inputs(sp, m, d, z, prop);
  var D = __left0__[2];
  var sig = Math.sqrt(((2 * prop['L']) * D) / prop['v_bar']);
  var __left0__ = tfer_1C(sp, m, d, z, prop);
  var G0 = __left0__[1];
  var rho_fun = (function __lambda__(G, r) {
    return (G - r) / (Math.sqrt(2) * sig);
  });
  var kap_fun = (function __lambda__(G, r) {
    return (G - r) * math.erf(rho_fun(G, r)) + (sig * Math.sqrt(2 / pi)) * Math.exp(-(Math.pow(rho_fun(G, r), 2)));
  });
  var K22 = kap_fun(G0(prop['r2']), prop['r2']);
  var K21 = kap_fun(G0(prop['r2']), prop['r1']);
  var K12 = kap_fun(G0(prop['r1']), prop['r2']);
  var K11 = kap_fun(G0(prop['r1']), prop['r1']);
  var Lambda = (-(1) / (4 * prop['del'])) * (((K22 - K12) - K21) + K11);
  Lambda[K22 > 100.0] = 0;
  Lambda[Math.abs(Lambda) < 1e-10] = 0;
  return [Lambda, G0];
};



// <------------------------------------------------------>
// Parse CPMA inputs                                     //
// <------------------------------------------------------>
var parse_inputs = function(sp, m, d, z, prop) {
  if (typeof d == 'undefined' || (d != null && d.hasOwnProperty("__kwargtrans__"))) {
    ;
    var d = 0;
  };
  if (typeof z == 'undefined' || (z != null && z.hasOwnProperty("__kwargtrans__"))) {
    ;
    var z = 1;
  };
  if (typeof prop == 'undefined' || (prop != null && prop.hasOwnProperty("__kwargtrans__"))) {
    ;
    var prop = {};
  };
  var e = 1.60218e-19;
  var q = z * e;
  if (d == 0 || d == null) {
    console.log('Invoking mass-mobility relation to determine Zp.');
    var __left0__ = mp2zp(m, z, prop['T'], prop['p'], prop);
    var B = __left0__[0];
  } else {
    var __left0__ = dm2zp(d, z, prop['T'], prop['p']);
    var B = __left0__[0];
  }
  var tau = B * m;
  var D = prop['D'](B) * z;
  var C0 = (sp['V'] * q) / Math.log(1 / prop['r_hat']);


  r_m = (math.sqrt(C0 / m) - math.sqrt(C0 / m - 4 * sp['alpha'] * sp['beta'])) / (2 * sp['alpha']);
  r_p = (math.sqrt(C0 / m) + math.sqrt(C0 / m - 4 * sp['alpha'] * sp['beta'])) / (2 * sp['alpha']);

  // determine which root is closer to centerline radius
  function indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
      if (a[i] < a[lowest]) lowest = i;
    }
    return lowest;
  }
  idx = indexOfSmallest([Math.abs(r_m - prop['rc']), Math.abs(r_p - prop['rc'])]);
  if (r_m == 0) {
    idx = 2; // avoid zero values for APM case
  }

  // assign one of the two roots to rs
  rs = r_m; // by default use -ive root
  if (idx == 2) {
    rs = r_p // if closer to +ive root, use +ive root
  }

  // zero out cases where no equilibrium radius exists (also removes complex numbers)
  if (C0 / m < (4 * sp['alpha'] * sp['beta'])) {
    rs = 0;
  }

  rs = Math.max(rs, 1e-20) // avoids division by zero for z = 0 case

  return [tau, C0, D, rs];
};

// <------------------------------------------------------>
// define a custom function of linspace
// <------------------------------------------------------>
var linspace = function(a, b, n) {
  if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  var i, ret = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
};


// <------------------------------------------------------>
// define a charge function
// <------------------------------------------------------>

var tfer_charge = function(d, z) {

  var e = 1.602177e-19, // elementary charge
    epi = 8.85418e-12, // dielectric constant (for air) [F/m]
    kB = 1.38065e-23, // Boltzmann's constant
    Z_Z = 0.875, // ion mobility ratio (Wiedensohler, 1988)
    T = 298; // temperature

  // Helper function to create a 2D array of zeros.
  // Used for fn in the next line.
  function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
  }
  var fn = zeros([z.length, d.length]) // initialize fn

  for (dd in d) {
    for (zz in z) {
      if (z[zz] < 3) { // if charge state less than 3
        // Gopalakrishnan below z = 3
        a = [
          [-0.3880, -8.0157, -40.714],
          [0.4545, 3.2536, 17.487],
          [-0.1634, -0.5018, -2.6146],
          [0.0091, 0.0223, 0.1282]
        ];
        exponent = 0;
        for (jj = 0; jj < 4; jj++) { // loop through coefficients in a
          exponent = exponent + (a[jj][z[zz]] * Math.pow(Math.log(d[dd] * 1e9), jj));
        }
        fn[zz][dd] = Math.exp(exponent);
      } else { // Wiedensohler for z = 3 and above
        fn[zz][dd] = e / Math.sqrt(4 * pi * pi * epi * kB * T * d[dd]) *
          Math.exp(0 - Math.pow(z[zz] - 2 * pi * epi * kB * T * Math.log(Z_Z) * d[dd] / Math.pow(e, 2), 2) /
            (4 * pi * epi * kB * T * d[dd] / Math.pow(e, 2)));

        if (fn[zz][dd] < 6e-5) {
          fn[zz][dd] = 0
        } // truncate small values
      }
    }
  }

  return fn
}


var fCharge = 0;
var parse_fun = function(sp, m, d, z_vec, prop, fun) {
  console.log(z_vec)
  var Lambda = Array(m.length),
    tCharge = tfer_charge(d, z_vec); // unused as y-scale becomes challenging
  for (ii in m) { // loop over particle mass
    Lambda[ii] = 0 // initialize at zero
    for (zz in z_vec) { // loop over integer charge states
      __left0__ = fun(sp, m[ii], d[ii], z_vec[zz], prop)
      if (fCharge == 1) {
        Lambda[ii] = Lambda[ii] + __left0__[0] * tCharge[zz][ii]
      } else {
        Lambda[ii] = Lambda[ii] + __left0__[0]
      }
    }
  }
  return Lambda;
};


// <------------------------------------------------------>
// define a fitted  function for width function
// <------------------------------------------------------>


var fWidth = function(m, Rm, Q){


  a_l=0.0258*Q+1.3061*Math.pow(Rm,-2.569)+1.10745;
  b_l=4.06859*Q+0.967;
  c_l=4.6332*Q+0.42798;

  mu=(a_l)/(1+Math.exp(-b_l*(Math.log10(m)+c_l)))
  return [ mu-0.105, mu+0.105]
}


// <------------------------------------------------------>
// define a fitted  function for height function
// <------------------------------------------------------>

var fLoss = function(m, Rm, Q){

    switch(true){
    case ( Q == 0.3):

      var a=[-0.000605, 0.0170, -0.159  , 1.373, 0.00970, 1.49  , -0.0125 , 0.305   , 0.730 ];

      break;

    case ( Q == 1.5):

     var  a=[0.0      , 0.0   , -0.0130 , 0.950, 0.151  , 1.89  , 2.37    , -0.0636 , -0.482];

      break;
    case ( Q == 4):
      var a=[0.0      , 0.0   , 0.000970, 0.882, 0.190  , 1.99  , 3.28    , -0.300  , 0.000 ];

      break;
    case ( Q == 8):
      var a=[0.0      , 0.000 , 0.000   , 0.938, 0.000  , 0.000 , 0.000   , 0.000   , 0.000 ];

    }

     a_l= a[0]*Math.pow(Rm,3)+a[1]*Math.pow(Rm,2)+a[2]*Math.pow(Rm,1)+a[3]*Math.pow(Rm,0);
     b_l=a[4]*Math.pow(Rm,1)+a[5]*Math.pow(Rm,0);
     c_l=a[6]*Math.exp(a[7]*Rm)+a[8];

     lambda=(a_l)/(1+Math.exp(-b_l*(Math.log10(m)+c_l)))

    return [ lambda-0.143, lambda+0.143]
  }



// <------------------------------------------------------>
// linear interpolation function
// <------------------------------------------------------>
  var linearInterp = function(x, y,Vx){
    var delta=   0.143;
    yInterp=y[0]+(Vx-x[0])*(y[1]-y[0])/(x[1]-x[0])

    return [yInterp-delta, yInterp+delta]
  }





// <------------------------------------------------------>
// Tringular transfer function
// <------------------------------------------------------>

  var   tri_tfer = function(Rm, mu, lambda){

    mTilda=linspace(0.5, 2, 601)
    Beta=1/Rm;
    var omegaTri =[];
    for (var i=0; i<mTilda.length; i++) {

      omegaTri[i]= (0.5*lambda*mu/Beta)*(
                  Math.abs(mTilda[i]-(1+Beta/mu))+
                  Math.abs(mTilda[i]-(1-Beta/mu))-
                  2* Math.abs(mTilda[i]-1))
    }
    return [mTilda, omegaTri]
  }


console.log('Load complete.')
console.log(' ')

// END TFER_PMA CODE -------------------------------------------------------//
//==========================================================================//




  // switch(true){

  //   case (Q < 0.3):

  //   case (Q === 0.3):
  //     break;
  //   case (Q > 0.3 && Q < 1.5):
  //     break;
  //   case (Q === 1.5):

  //   case (Q > 1.5 && Q < 4):
  //     break;
  //   case (Q === 4):

  //   case (Q > 4 && Q < 8):
  //     break;
  //   case (Q === 8):
  //     break;
  //   case (Q > 8 ):

  // }
