// This is an interpretation of a neat (but expensive!)
// clock I saw that displays the time as math problems.
// -------------------------------------------------------
// ------> https://www.thinkgeek.com/product/kjpm/ <------
// -------------------------------------------------------
// As a broke math teacher without a clock in her room,
// I would have loved something like this for my students!
// Eventually I will build it with a Raspberry Pi setup
// and rewrite the code in something else, like Python
// TODO: A proper LCD font or SVG alternative. This font's
// division and plus signs look too similar
// Yikes, where do I start... an array 60 elements long where
// each element is an array of answers for that index
// (which represents a minute or hour)?
// Manually create math problems for all 60 elements?
// It just doesn't seem very practical, or at least,
// not very elegant.

//-----------------------------------------------------------------------
// CONSTANTS AND VARIABLES
//-----------------------------------------------------------------------

const OPS = {
    fraction: "/",
    power: "^",
    minus: "−",
    plus: "+",
    times: "×",
    divide: "÷",
    root: "√"
};

const PRIMES = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59 ];

var opsFunctions = [
  getDivisionProblem,
  getMultiplicationProblem,
  getSubtractionProblem,
  getAdditionProblem
];

//var difficulty;
//var problemRate;
//var militaryTime = true;
//var includeNegatives;
//var includeFractions;
//var includeDecimals;
//var includeAbsValue;
//var includeIdentityProps;
//var includeInverseProps;

//-----------------------------------------------------------------------
// UTILITY FUNCTIONS
//-----------------------------------------------------------------------

//FIX: make the fraction readable - looks wonky right now
function formatFraction(numerator, denominator){
  return numerator.toString().sup() + OPS.fraction + denominator.toString().sub();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
 //The maximum is exclusive and the minimum is inclusive
}

function getRandomMultiple(max, factor) {
    var random = Math.random() * (max - factor + 1) + factor;
    return random - random % factor;
}

//FIX: Should probably save prime factors for each number, 2-59. Doesn't
// make sense to recalculate them each time
function getRandomFactor(number){
  //get prime factors
  var pFactors = [];
  var product = 1
  var i = 0;
  var currentFactor = number;
  var test = 0;

  while (product != number){
    console.log('---------BEFORE IF');
    console.log('current prime: ' + PRIMES[i]);
    console.log('current prime index: ' + i);
    console.log("prime factors: " + pFactors);
    console.log("current factor: " + currentFactor);
    console.log('product: ' + product);
    if (currentFactor % PRIMES[i] == 0){
      pFactors.push(PRIMES[i]);
      currentFactor = currentFactor / PRIMES[i];
      product *= PRIMES[i];
      i = -1;
    }
    console.log('---------AFTER IF');
    console.log('current prime: ' + PRIMES[i]);
    console.log('current prime index: ' + i);
    console.log("prime factors: " + pFactors);
    console.log("current factor: " + currentFactor);
    console.log('product: ' + product);
    i++;
  }

  //To get random factor, multiply 2 or more prime factors together
  var numPFactors = getRandomInt(1, pFactors.length);
  var randomFactor = 1;
  var currentPrimeIndex = '';
  for (var j = 0; j < numPFactors; j++){
    currentPrimeIndex = getRandomInt(0, pFactors.length);
    randomFactor *= pFactors[currentPrimeIndex];
    pFactors.splice(currentPrimeIndex, 1);
  }

  return randomFactor;
}

//-----------------------------------------------------------------------
// MATH PROBLEM GENERATORS
//-----------------------------------------------------------------------

function getDivisionProblem(answer) {
    console.log("--------answer: " + answer);
    if (answer == 0) {
        return 0 + OPS.divide + getRandomInt(1, 60);
    }
    if (answer == 1) {
      var number = getRandomInt(1,60);
      return number + OPS.divide + number;
    }
    var b = getRandomMultiple(60, answer);
    var a = b / answer;

    return b + OPS.divide + a;
}

function getMultiplicationProblem(answer) {
    console.log("--------answer: " + answer);
    if (PRIMES.includes(answer)) {
        console.log("it's a prime");
        return 1 + OPS.times + answer;
    } else if (answer == 0) {
        return 0 + OPS.times + getRandomInt(0,60);
      }
      else if (answer == 1){
        var denominator = getRandomInt(0,60);
        return denominator + OPS.times + formatFraction(1, denominator);
      }

    var b = getRandomFactor(answer);
    var a = answer / b;

    console.log("b: " + b);
    console.log("a: " + a);
    return b + OPS.times + a;
}

function getAdditionProblem(answer){
  if (answer == 0){
    return 0 + OPS.plus + 0; //FIX: Maybe make easy problems like this optional
  }

  if (answer == 1){
    return 1 + OPS.plus + 0;
  }

  var a = getRandomInt(0,answer);
  var b = answer - a;

  return a + OPS.plus + b;
}

function getSubtractionProblem(answer){
  if (answer == 0){
    var number = getRandomInt(0,60)
    return number + OPS.minus + number;
  }

  if (answer == 1){
    var a = getRandomInt(1,60);
    var b = a - 1;
    return a + OPS.minus + b;
  }

  var a = getRandomInt(0,answer);
  var b = answer + a;

  return b + OPS.minus + a;
}

function getExponentProblem(){

}

function getSquareRootProblem(){

}

function getRandomProblem(answer){
  var index = getRandomInt(0,opsFunctions.length);

  return opsFunctions[index](answer);
}

//-----------------------------------------------------------------------
// CLOCK FUNCTIONS, CONSTANTS AND VARIABLES
//-----------------------------------------------------------------------

function startClock() {
    var time = new Date();
    var minutes = time.getMinutes();
    var hours = time.getHours();
    document.getElementById("problem-hr").innerHTML = getRandomProblem(hours);
    document.getElementById("problem-min").innerHTML = getRandomProblem(minutes);

    setInterval(function(){
      if (time.getMinutes() != minutes){
        document.getElementById("problem-hr").innerHTML = getRandomProblem(hours);
        document.getElementById("problem-min").innerHTML = getRandomProblem(minutes);
      }
    }, 500);
}

startClock();

//-----------------------------------------------------------------------
// TESTS
//-----------------------------------------------------------------------
function testMultiplication() {
    for (var i = 0; i < 60; i++) {
        console.log("---------------outer loop");
        var li = document.createElement("li");
        li.innerHTML = "[" + i + "] " + getMultiplicationProblem(i);
        document.getElementById("multiplication").appendChild(li);
    }
}

function testDivision() {
    for (var i = 0; i < 10; i++) {
        console.log("---------------outer loop");
        var li = document.createElement("li");
        li.innerHTML = "[" + i + "] " + getDivisionProblem(i);
        document.getElementById("division").appendChild(li);
    }
}

function testRandomFactor() {
  console.log('>>>Random Factor: ' + getRandomFactor(12));
}

//testDivision();
//testMultiplication();
//testRandomFactor();