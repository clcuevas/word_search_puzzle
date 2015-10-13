'use strict';

var fs = require('fs');
var removeSpaces = /\r\n|\r|\n/;
var removeWhitespace = /\b\s\b/g;
var words; //final words array
var matrixArray = []; //final array for matrix
var output = [];

//------------------------------------
/*
read WordList file to import words into array
filter(Boolean) removes empty strings
*/
var words = fs.readFileSync('WordList.txt', 'utf8');
words = words.trim().toUpperCase().replace(removeWhitespace, '').split(removeSpaces);

//read WordSearch file and convert to array
var matrix = fs.readFileSync('WordSearch.txt', 'utf8').trim().split(removeSpaces);

//word direction/designation possibilities
var designation = ['LR', 'RL', 'U', 'D', 'DUL', 'DUR', 'DDL', 'DDR'];

//------------------------------------------------------
var wordToSearch;
var startingCoordinate;
var markCoordinates;
var nextCoordinate;
var lastCoordinate;

var getLastCoordinate = function(directOption, word, row, col) {
  if (directOption == 'LR') {
     lastCoordinate = [row, col + (word.length - 1)];
  } else if (directOption == 'RL') {
     lastCoordinate = [row, col - (word.length - 1)];
  } else if (directOption == 'U') {
     lastCoordinate = [row - (word.length - 1), col];
  } else if (directOption == 'D') {
     lastCoordinate = [row + (word.length - 1), col];
  } else if (directOption == 'DUL') {
     lastCoordinate = [row - (word.length - 1), col - (word.length - 1)];
  } else if (directOption == 'DUR') {
     lastCoordinate = [row - (word.length - 1), col + (word.length - 1)];
  } else if (directOption == 'DDL') {
     lastCoordinate = [row + (word.length - 1), col - (word.length - 1)];
  } else if (directOption == 'DDR') {
     lastCoordinate = [row + (word.length - 1), col + (word.length - 1)];
  } else {
    console.log('nothing found here!');
  }
};

var getNextCoordinates = function(directionOption, word, markCoordinates) {
  //loop through remaining letters in the word we are searching for
  for (var j = 1; j < word.length; j++) {
    if (directionOption == 'LR') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0], markCoordinates[1] + 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0], markCoordinates[1] + 1];
      }
    } else if (directionOption == 'RL') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0], markCoordinates[1] - 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0], markCoordinates[1] - 1];
      }
    } else if (directionOption == 'U') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1]];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1]];
      }
    } else if (directionOption == 'D') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] + 1, markCoordinates[1]];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] + 1, markCoordinates[1]];
      }
    } else if (directionOption == 'DUL') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1] - 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1] - 1];
      }
    } else if (directionOption == 'DUR') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1] + 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1] + 1];
      }
    } else if (directionOption == 'DDL') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] - 1, markCoordinates[1] - 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] + 1, markCoordinates[1] - 1];
      }
    } else if (directionOption == 'DDR') {
      if (nextCoordinate == undefined) {
        nextCoordinate = [markCoordinates[0] + 1, markCoordinates[1] + 1];
      } else if (nextCoordinate[0] < matrix.length || nextCoordinate[1] < matrix[0].length) {
        nextCoordinate = [markCoordinates[0] + 1, markCoordinates[1] + 1];
      }
    } else {
      console.log('nothing found here!');
    }

    if (word.charAt(j) == matrix[nextCoordinate[0]][nextCoordinate[1]]) {
      markCoordinates = nextCoordinate;

      if (nextCoordinate[0] == lastCoordinate[0] && nextCoordinate[1] == lastCoordinate[1]) {
        output.push([word, directionOption, startingCoordinate]);
      }
    }
  }
};


function findRemainingCoordinates(directOptions, word, row, col) {
  for (var i = 0; i < directOptions.length; i++) {
    //find the last possible coordinate accounting for the length of the word
    getLastCoordinate(directOptions[i], word, row, col);

    //before finding the rest of coordinates, make sure the last coordinates are not out of scope!
    if (matrix[lastCoordinate[0]] !== undefined
        && matrix[lastCoordinate[0]][lastCoordinate[1]] !== undefined) {
      markCoordinates = [row, col];

      getNextCoordinates(directOptions[i], word, markCoordinates);
    }
  }
}

function findStartingCoordinates(gridArray, word) {
  //get row and column to start search
  for (var row = 0; row < gridArray.length; row++) {
    for (var col = 0; col < gridArray[row].length; col++) {
      if (word.charAt(0) == gridArray[row][col]) {
        startingCoordinate = [row, col];

        //execute findRemainingCoordinates...
        findRemainingCoordinates(designation, wordToSearch, row, col);
      }
    }
  }
}

function searchPuzzle(wordsArray) {
  //get word to search
  for (var i = 0; i < wordsArray.length; i++) {
    wordToSearch = wordsArray[i];

    //execute findStartingCoordinates....
    findStartingCoordinates(matrix, wordToSearch);
  }
}

//--------------------start-algorithm------------------
searchPuzzle(words);
console.log(output);


