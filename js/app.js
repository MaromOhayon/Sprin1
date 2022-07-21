'use strict'

// Global Variables
var gBoard
var gGame = {
    isOn: false,
    markedCount: 0,
    openedCount: 0,
    isWin: false,
    lives: 3

}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gInterval


const land = 'land'
const mine = 'mine'
const marked = 'marked'
const opened = 'opened'
const hidden = 'hidden'
const mineImg = ' <img src="img/mine.png" alt="mine">'
const flagImg = ' <img src="img/flag.png" alt="flag">'

function initGame() {
    // MODEL
    gGame.isWin = false
    gGame.markedCount = 0
    gGame.openedCount = 0
    gGame.lives = 3
    gBoard = createBoard(gLevel.SIZE)


    //DOM
    renderBoard(gBoard)
    var elMsg = document.querySelector('.msg')
    elMsg.innerHTML = ''

}


function setMinesCount(skipedCell) {
    // Model
    // debugger
    if (!gGame.isOn) {
        for (var i = 0; i < gLevel.MINES;) {
            var idxs = getRandomIdxs()
            if (skipedCell !== idxs && gBoard[idxs[0]][idxs[1]].type !== mine) {
                gBoard[idxs[0]][idxs[1]].type = mine;
                i++
            }
        }
    }

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.type === mine) continue
            cell.minesAroundCount = countNeighbors(i, j, gBoard)

            //DOM
        }


    }  // renderBoard(gBoard)
    gGame.isOn = true
}


function initTimer() {
    var seconds = 0
    var tens = 0

    var appendTens = document.getElementById("tens")
    var appendSeconds = document.getElementById("seconds")
    // var buttonStart = elCell
    // var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');


    if (gGame.isOn) {
        clearInterval(gInterval);
        gInterval = setInterval(startTimer, 10);
    } else clearInterval(gInterval);



    buttonReset.onclick = function () {
        initGame()
        clearInterval(gInterval);
        tens = "00";
        seconds = "00";
        appendTens.innerHTML = tens;
        appendSeconds.innerHTML = seconds;
        buttonReset.style.display = 'none'
    }



    function startTimer() {
        tens++;

        if (tens <= 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (tens > 99) {
            console.log("seconds");
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

    }


}

function cellClicked(elCell, cellI, cellJ) {
    //MODEL
    if (!gGame.isOn && gGame.openedCount === 0) {
        var skipedCell = [cellI, cellI]
        setMinesCount(skipedCell)
        initTimer()
    }

    if (gGame.isOn) {
        const cell = gBoard[cellI][cellJ]
        if (cell.status === marked) return
        if (cell.status === opened) return
        const cellLocation = [cellI, cellJ]
        if (cell.status === hidden) {
            cell.status = opened
            gGame.openedCount++
        }
        if (cell.type === mine) {
            gGame.lives--
            var elLives = document.querySelector('.lives')
            elLives.innerHTML = `${gGame.lives} lives left!`
            if (gGame.lives <= 0) gameOver()
        }
        if (cell.type !== mine) {
            openNegs(elCell, cellLocation, gBoard)
        }


        //DOM
        if (cell.type === mine) renderCell(elCell, mineImg)
        if (cell.type === land) renderCell(elCell, cell.minesAroundCount)
        elCell.classList.add(`opened`)
        elCell.classList.add(`num${cell.minesAroundCount}`)
    }
    checkWin()
}

function openNegs(elCell, cellLocation, board) {
    // MODEL
    for (var i = cellLocation[0] - 1; i <= board.length; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellLocation[1] - 1; j <= board[0].length; j++) {
            if (j < 0 || j >= board[0].length) continue
            var cell = gBoard[i][j]
            if (cell.status === marked) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (cell.type === land) {
                cell.status = opened
                // DOM
                renderCell(elCell, cell.minesAroundCount)
                elCell.classList.add(`opened`)
                elCell.classList.add(`num${cell.minesAroundCount}`)
            }
        }

    }

}

function markCell(elCell, i, j) {
    var cell = gBoard[i][j]

    if (cell.status === hidden && gGame.markedCount >= gLevel.MINES) {
        alert('No flags left')
    } else {
        // Model
        if (cell.status !== marked) {
            cell.status = marked
            gGame.markedCount++
            // Dom
            renderCell(elCell, flagImg)
            elCell.classList.add('marked')
            checkWin()
        } else if (cell.status = hidden) {
            cell.status = hidden
            gGame.markedCount--
            // Dom
            renderCell(elCell, '')
            elCell.classList.remove('marked')
        }
    }
    checkWin()
}

function gameOver() {
    gGame.isOn = false
    initTimer()
    var elBtn = document.getElementById('button-reset');
    elBtn.style.display = 'inline'
    var elMsg = document.querySelector('.msg')
    if (gGame.isWin) {
        elMsg.innerHTML = 'Victory!'
    } else elMsg.innerHTML = 'Oho no... you lost!'
}

function checkWin() {
    var len = gLevel.SIZE
    var boardSize = len * len
    var openedCount = 0
    var mineCount = 0
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            var cell = gBoard[i][j]
            if (cell.status === opened) openedCount++
            if (cell.status === mine) mineCount++
        }
    }
    if (openedCount === boardSize - gLevel.MINES && gGame.markedCount === gLevel.MINES) {
        gGame.isWin = true
        gameOver()
    }
    if (gGame.lives > 0 && mineCount === gLevel.MINES) {
        gGame.isWin = true
        gameOver()
    }
}

function getRandomIdxs() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx1 = getRandomInt(0, gLevel.SIZE)
        var randIdx2 = getRandomInt(0, gLevel.SIZE)
        var idxs = [randIdx1, randIdx2]
    }
    return idxs
}

// function chooseLevel(num) {
//     if (num === 1) {
//         gLevel.SIZE = 4
//         gLevel.MINES = 2
//     } else if (num === 2) {
//         gLevel.SIZE = 8
//         gLevel.MINES = 4
//     } else if (num === 3) {
//         gLevel.SIZE = 16
//         gLevel.MINES = 8
//     }
//     renderBoard(gBoard)
//     var elLevel = document.querySelector('.level')
//     elLevel.style.display = 'none'
// }