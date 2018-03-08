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

//var difficulty;

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
  var currentNumber = number;

  while (product != number){
    if (number % PRIMES[i] == 0){
      pFactors.push(PRIMES[i]);
      currentNumber = number / PRIMES[i];
      product *= PRIMES[i];
      i = 0;
    }
    i++;
  }

  //To get random factor, multiply 2 or more prime factors together
  var numPFactors = getRandomInt(1, pFactors.length);
  var randomFactor = 1;
  var currentPrimeIndex = '';
  for (var j = 0; j <= numPFactors; j++){
    currentPrimeIndex = getRandomInt(0, pFactors.length - 1);
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

//-----------------------------------------------------------------------
// CLOCK FUNCTIONS, CONSTANTS AND VARIABLES
//-----------------------------------------------------------------------

function startClock() {
    var time = new Date();
    // The actual time
    document.getElementById("problem-hr").innerHTML = time.getHours();
    document.getElementById("problem-min").innerHTML = time.getMinutes();
    setTimeout(startClock, 500);
}

//startClock();

//-----------------------------------------------------------------------
// TESTS
//-----------------------------------------------------------------------
function testMultiplication() {
    for (var i = 0; i < 10; i++) {
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

//testDivision();
testMultiplication();