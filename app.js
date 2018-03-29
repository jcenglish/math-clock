// This is an interpretation of a neat (but expensive! 
// That's Switch money right there!) clock I saw that 
// displays the time as math problems.
// -------------------------------------------------------
// ------> https://www.thinkgeek.com/product/kjpm/ <------
// -------------------------------------------------------
// As a broke math teacher without a clock in her room,
// I would have loved something like this for my students!
// Eventually I will build it with a Raspberry Pi setup
// and rewrite the code in something else, like Python

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

    if (currentFactor % PRIMES[i] == 0){
      pFactors.push(PRIMES[i]);
      currentFactor = currentFactor / PRIMES[i];
      product *= PRIMES[i];
      i = -1;
    }
    i++;
  }

  //To get random factor, return 1 factor or multiply 2 or more prime factors together
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
    if (PRIMES.includes(answer)) {
        return 1 + OPS.times + answer;
    } else if (answer == 0) {
        return 0 + OPS.times + getRandomInt(0,60);
      }
      else if (answer == 1){
        var denominator = getRandomInt(1,60);
        return denominator + OPS.times + formatFraction(1, denominator);
      }

    var b = getRandomFactor(answer);
    var a = answer / b;

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

//FIX: b is too big
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
// CLOCK FUNCTIONS, CONSTANTS AND VARIABLES              >>>>> INIT <<<<<
//-----------------------------------------------------------------------

function getTime(){
  var time = new Date();
  return time;
}

function setProblems(){
  document.getElementById("problem-hr").innerHTML = getRandomProblem(getTime().getHours());
  document.getElementById("problem-min").innerHTML = getRandomProblem(getTime().getMinutes());
}

var lastTime = getTime().getMinutes();
function timeChanged(){
  if ((Math.abs(getTime().getMinutes() - lastTime)) > 0){
    lastTime = getTime().getMinutes();
    
    return true;
  }
  else {
    return false;
  }
}

function startClock() {
  setProblems();
  setInterval(function(){
    if (timeChanged()){
      setProblems();
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

//-----------------------------------------------------------------------
// INTERFACE
//-----------------------------------------------------------------------
var app = new Vue({
  el: '#app',
  data: {
    colorGreen: '#37694C',
    menuToggled: {
      state: true,
      style: {
      left: 0,
      overflowY: 'scroll'
    }
    },
    settings: {
      clock24: true, 
      difficulty: {
        'Number of operations': 1,
        'Max operand value' : 60,
        'Min operand value' : 0 
      },
      operationTypes: [
      //{'mixed': false}, //only an option if number of ops is > 1
        {'subtraction': true},
        {'addition': true},
        {'multiplication': true},
        {'division': true},
        {'exponents': false},
        {'radicals': false},
        {'absolute value': false}
      ],
      numberSets: [
      {'positive numbers' : true},
      {'negative numbers' : false},
      {'fractions' : false},
      {'decimals' : false}
      ],
      inverseProp: false,
      identityProp: false,
      fonts: [
        {'Pangolin': true},
        {'Patrick Hand': false},
        {'Quicksand': false},
        {'PT Sans': false}
      ],
      //fontSize: 1,
      styles: [
        {
          backgroundColor: 'black',
          color: 'white'
        },
        {
          color: 'black',
          backgroundColor: 'white'
        },
        {
          backgroundColor: '#37694C',
          color: 'white'
        }
      ]
    }
  },
  methods: {
    selectFont: function(){

    }
  },
  watch: {
  },
  computed: {

  //   googleFonts: function(){
  //     return 'https://fonts.googleapis.com/css?family=' 
  //     + this.settings.fonts.join('|').replace(/\s/g, '+')
  //     + '&text=0123456789%2b/×−÷√hoursminte';
  // }
}
})