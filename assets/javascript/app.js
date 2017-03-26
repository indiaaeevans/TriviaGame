// SCRIPT FOR THE TIMER
//-----------------------------------------------------------------
//  Variable that will hold our setInterval that runs the timer
var intervalId;

//  Our stopwatch object.
var stopwatch = {

  time: 15,

  reset: function() {
    // reset time to start at 15 seconds
    stopwatch.time = 15;

     // Change the "display" div to "00:15."
    $("#display").html("00:15");

  },

  start: function() {
    // $("#display").html("00:10");
    //  Use setInterval to start the count here.
    intervalId = setInterval(stopwatch.count, 1000);

  },
  stop: function() {
    //  Use clearInterval to stop the count
    clearInterval(intervalId);
    // hide the Q + A
    questions.hide();
    answerChoices.hide();
    // display a message
    message.fadeIn().html("You ran out of time!");  
  },

  count: function() {

    //  decrement time by 1.
    stopwatch.time--;

    //  Get the current time, pass that into the stopwatch.timeConverter function,
    //  and save the result in a variable.
    var current = stopwatch.timeConverter(stopwatch.time);

    //  show the converted time in the "display" div.
    $("#display").html(current);

      //  Once timer hits zero...
      if (stopwatch.time === 0) {

        //  ...run the stop function.
        stopwatch.stop();
        // proceed to next question after 2.5 seconds
        setTimeout(nextQuestion, 2500);
      }
  },
  
  timeConverter: function(t) {

    //  Takes current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }

    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }
};
//-----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// Q + A OBJECT//-----------------------------------------------------------------
function triviaQuestion(question, choices, correctAnswer){
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
}

// ARRAY THAT WILL CONTAIN ALL Q+A OBJECTS USED IN THE GAME------------------------------------------
var q = [
    new triviaQuestion('If you mix all three colors of light, you get: ', ['pure, white light', 'black', 'rainbow'], 0),
    new triviaQuestion('Which color model represents <span class="strong">additive</span> color?', ['RGB', 'CMYK', 'RYB', 'ROYGBV'], 0),
    new triviaQuestion('With <span class="strong">additive</span> color, the more light you add, the <span class="strong">( ? )</span> the color mix becomes.', 
        ['darker', 'brighter'], 1),
    new triviaQuestion('TVs, screens and projectors use <span class="strong">( ? )</span> as their primary colors,and then mix them together to create other colors.',
        ['orange, green, and violet', 'red, yellow, and blue', 'cyan, magenta, and yellow', 'red, green, and blue'], 3),
    new triviaQuestion('In CMYK, <span class="strong">subtractive</span> refers to the fact that you subtract the light from the paper by adding more color.', 
        ['true', 'false'], 0),
    new triviaQuestion('Printers use <span class="strong">( ? )</span> inks to create colors.', 
        ['red, green, blue, black', 'red, yellow, blue, black', 'cyan, yellow, magenta, black', 'white, grey, black'], 2),
    new triviaQuestion('in CMYK, the <span class="strong">K</span> stands for: ', ['keratin', 'ketone', 'kern', 'key'], 3),
    new triviaQuestion('The first color wheel was designed by:  ', 
        ['Sir Isaac Newton (1666)', 'Benjamin Franklin (1780)', 'Galileo (1621)', 'Louis Braille (1840)'], 0),
    new triviaQuestion('Which of the following is an example of a <span class="strong">tertiary</span> color?', 
        ['orange', 'blue-green', 'violet', 'white'], 1),
    new triviaQuestion('Which of the following is considered a <span class="strong">warm</span> color?', ['purple', 'yellow', 'blue', 'green'], 1),
    new triviaQuestion('<span class="strong">( ? )</span> colors are opposites on the color wheel, while <span class="strong">( ? )</span> colors sit next to one another on the color wheel.', 
        ['Complementary / Analogous', 'Analogous / Complementary', 'None of the above'], 0),
    new triviaQuestion('<span class="strong">( ? )</span> colors are evenly spaced around the color wheel.', ['Monochrome', 'Harmonious', 'Triadic'], 2)
];

//CREATE THE VARIABLES WE NEED TO RUN THE GAME------------------------------------------
var questionCounter= 0,
    numberCorrect = 0,
    questions = $(".questions"),
    answerChoices = $("#answerChoices"),
    QandA = $("#wrapper"),
    startButton = $("#start"),
    message = $("#message"),
    choice='';


// FUNCTION TO SHOW QUESTION AND ANSWER CHOICES------------------------------------------
function showquestion(){

  // show the div that contains the Q+A
  QandA.fadeIn();

  // diplay the question
  questions.html(q[questionCounter].question);
  
  // generate a list of answer choices
  for (var i = 0; i < q[questionCounter].choices.length; i++) {
    // save the string from the array of choices to a variable
    choice = q[questionCounter].choices[i];
    // create a new list item
    var option = $("<li>")
      // display the string in the new <li>
      .text(choice)
      // give each choice a value so we can compare with correct answer later
      .attr("data-value", i)
      // add to the list of answer choices
      .appendTo(answerChoices);
  }

  questions.fadeIn();
  answerChoices.fadeIn();
}

// FUNCTION TO CHECK IF THEY ANSWERED CORRECTLY------------------------------------------
function checkAnswer() {

  var answerValue = $(this).attr("data-value");
  var selectedValue = q[questionCounter].correctAnswer;

  // console.log("selected value: " + selectedValue);
  // console.log("correct answer value: " + answerValue);

  questions.hide();
  answerChoices.hide();
  stopwatch.stop();

  // if correct answer is selected
  if (answerValue == selectedValue) {
    // increase user's score
    numberCorrect++;
    // show a message
    message.text("Correct!").fadeIn();
    // proceed to next question after 2.5 seconds
    setTimeout(nextQuestion, 2500);  
  }

  // if wrong answer is selected
  else if (answerValue != selectedValue) {
    // show a message
    message.text("Wrong!").fadeIn();    
    // proceed to next question after 2.5 seconds
    setTimeout(nextQuestion, 2500);
  }
}

// RUN THIS CODE AS SOON AS WINDOW LOADS-----------------------------------------
$(document).ready(function(){

  // hide the Q+A until game starts
  QandA.hide();
  message.hide();

  // after clicking start button
  startButton.click(function() {

    // hide the start button
    $(this).hide();
  
  // show the questions and answer choices
    showquestion();
      
    // start the timer
    stopwatch.start();

    // if an answer choice is selected then run the function to check answer
    $("li").click(checkAnswer);
  
    });
});

// NEXT-QUESTION FUNCTION
//-----------------------------------------------------------------
function nextQuestion(){
  message.hide();
  // clear out the text from previous question
  answerChoices.text("");
  questions.text("");

  // if we have reached the last question...
  if (questionCounter === q.length - 1){
        message.text("You answered " + numberCorrect + " out of " + q.length + " correctly!").fadeIn();

        clearInterval(intervalId); 
        // run start over function after 5 seconds
        setTimeout(startOver, 5000);
      }

  else {
    // reset the timer
    stopwatch.reset();

    // go to the next question
    questionCounter++;

    // show the questions and answer choices
    showquestion();

    // start the timer
    stopwatch.start();

    // if an answer choice is selected
    $("li").click(checkAnswer);
  }
}
// after all questions are answered we can restart the game
function startOver(){
  startButton.text("Try Again!").fadeIn();
  message.hide();
  questionCounter= 0;
  numberCorrect = 0;
}