/*
  Set the --vh property in CSS to 1% of the actual vertical height of the viewport (not including
  the tab bar or other UI elements)
 */
const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)
