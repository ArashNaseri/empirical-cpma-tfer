[![DOI](https://zenodo.org/badge/585446654.svg)](https://zenodo.org/badge/latestdoi/585446654)
# Empirical CPMA Transfer Function
This is a source code for a web-app that examine the empirical transfer function for centrifugal particle mass analyzers.


## Overview
This web application is created to analyze the transfer function of the CPMA. It utilizes data obtained from tandem CPMA (TCPMA) measurements carried out by Naseri et al. (2023).

To estimate the transfer function and discrepancies of the CPMA, a triangular transfer function was employed. Two factors, namely the width factor (μ) and height factor (𝜂), were utilized to determine any deviations from the idealized triangular transfer function. A value of 1 for each factor indicated that there were no discrepancies between the actual and theoretical triangular CPMA transfer functions.

If the width factor is greater than one (μ>1), it signifies that the CPMA transfer function is narrower than the idealized triangular transfer function.

These two factors are determined through multivariate nonlinear functions that are fitted to TCPMA measurements. The functions take into account either the CPMA mass set point (mp), CPMA resolution (Rm), and CPMA flow rate (Q), or the CPMA rotational speed (ω) and voltage (V). If the CPMA flow rate is set to 0.3, 1.5, 4 or 8 LPM, the loss factor is directly calculated using the fitting function corresponding to the relevant CPMA flow rate. However, for other flow rates, the loss factor is derived through simple interpolation between the nearest lower and higher CPMA flow rates.

## Inputs

CPMA dimensions (Cambustion Ltd)-Fixed
- Inner radius r1: 6 [cm]
- Outer radius r2: 6.1 [cm]
- Length L: 20 [cm]
- ω2/ω1: 0.9696


Set point mode
- Mass + Resolution + flow rate
    - Mass set point (m*) ∈ [0.05, 100 fg]
    - Resolution (Rm) ∈ [2, 15]
    - Flow rate (Q) ∈ [0.3, 8] [LPM]
- Angular speed + Voltage + flow rate
    - Angular speed (ω) [rad/s]
    - Voltage (V) [v]
    - Flow rate (Q) ∈ [0.3, 8] [LPM]


Particle properties
- Mass mobility exponent (Dm)
- Effective density (ρeff,100) [kg/m3]
- Number of charge state (z)
- Particle mass (mp) ∈ [-∞, +∞] [fg]

## Results
The empirical CPMA transfer function is derived by incorporating width and height factors into an idealized triangular model, based on the provided inputs.
