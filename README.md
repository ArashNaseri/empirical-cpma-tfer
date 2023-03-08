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




#### License

This software is licensed under an MIT license (see the corresponding file or details).

#### Contact
This program was authored by Arash Naseri (arash@ualberta.ca) during his postdoctoral fellowship at the University of Alberta. In order to make comprehensive comparisons between the empirical CPMA transfer functions and the existing models in the literature, the program also employs the trapezoidal and diffusion models developed in Sipkens et al.'s (2020) study. The visualization of the diffusion and trapezoidal models used in this program has been adapted from the GitHub repository located at https://github.com/tsipkens/tfer-pma.

#### How to cite

This code should be cited by:

1. citing the associated journal article describing the particle tracking methods used in this program [(Naseri et al., 2023)][Naseri], and

2. optionally citing the code directly (making reference to [Naseri et al. 2023][Naseri1]).

#### References

[Sipkens, T. A., J. S. Olfert, and S. N. Rogak. 2020a. New approaches to calculate the transfer function of particle mass analyzers. *Aerosol Sci. Technol.* 54:1, 111-127. DOI: 10.1080/02786826.2019.1680794.][Sipkens]

[A. Naseri. ArashNaseri/empirical-cpma-tfer: empirical-cpma- tfer_v2.0.0, Feb. 2023. URL https://doi.org/10.5281/zenodo.7686025][Naseri1]

[Naseri, A., Johnson.T, Smallwood .G , and J. S. Olfert. 2023. Measurement of the centrifugal particle mass analyzer
transfer function. *Aerosol Sci. Technol.*(Under review).][Naseri]




[Sipkens]: Sipkens, T. A., J. S. Olfert, and S. N. Rogak. 2020a. New approaches to calculate the transfer function of particle mass analyzers. *Aerosol Sci. Technol.* 54:1, 111-127. DOI: 10.1080/02786826.2019.1680794.

[Naseri1]: A. Naseri. ArashNaseri/empirical-cpma-tfer: empirical-cpma- tfer_v2.0.0, Feb. 2023. URL https://doi.org/10.5281/zenodo.7686025

[Naseri]: Naseri, A., Johnson.T, Smallwood .G , and J. S. Olfert. 2023. Measurement of the centrifugal particle mass analyzer
transfer function. *Aerosol Sci. Technol.*(Under review).

