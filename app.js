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

var ops = {
    fraction: "/",
    power: "^",
    minus: "−",
    plus: "+",
    times: "×",
    divide: "÷",
    root: "√"
};

var primes = [
  1,
  2,
  3,
  5,
  7,
  11,
  13,
  17,
  19,
  23,
  29,
  31,
  37,
  41,
  43,
  47,
  53,
  59
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// FIX: There's probably a less resource-intensive way to do this
// Get a random int from an array of 60 or 24 numbers and remove that int if it
// doesn't satisfy the function?
function getMultiplicationProblem(answer) {

    console.log('--------answer: ' + answer);

    var a = 2;
    var b = getRandomInt(2, Math.ceil(answer / 2));
    var problem = '';
    if (primes.includes(answer)) {
        console.log("it's a prime");
        return 1 + ops["times"] + answer;
    } else if (answer == 0) {
        return 0 + ops.times + getRandomInt(0, 60);
    }
    while (a <= Math.floor(answer / 2)) {
        console.log('while runs');
        console.log('b: ' + b);

        if (a * b == answer) {
            console.log('found answer');
            problem = a + ops.times + b;
            break; // FIX: Are breaks the only way to avoid undefined returns?
        }
        if (a == Math.floor(answer / 2)) {
            console.log('a reached end: ' + a);
            a = 2;
            b = getRandomInt(2, Math.ceil(answer / 2));
        }
        console.log('a: ' + a);
        a++;
    }
    return problem;
}

function startClock() {
    var time = new Date();
    // The actual time
    document.getElementById("problem-hr").innerHTML = time.getHours();
    document.getElementById("problem-min").innerHTML = time.getMinutes();

    setTimeout(startClock, 500);
}

//startClock();

// Tests -------------------------------------------------------------------------------------

function testMultiplication(){
  for (var i = 0; i < 60; i++) {
    console.log('---------------outer loop');
    var li = document.createElement("li");
    li.innerText = '[' + i + '] ' + getMultiplicationProblem(i);
    document.getElementById("multiplication").appendChild(li);
}
}

//testMultiplication();