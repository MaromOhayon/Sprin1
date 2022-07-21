'use strict'

// BOARD GAMES

function createMat(levelSize) {
    var mat = []
    for (var i = 0; i < levelSize; i++) {
        var row = []
        for (var j = 0; j < levelSize; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function createBoard(levelSize) {
    // Create the Matrix
    var board = createMat(levelSize)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var cell = { type: land, status: hidden, minesAroundCount: 0 };
            board[i][j] = cell;
        }



    }
    // Place mines randomly
    // for (i = 0; i < gLevel.MINES; i++) {
    //     var randIdx1 = getRandomInt(0, gLevel.SIZE)
    //     var randIdx2 = getRandomInt(0, gLevel.SIZE)
    //     board[randIdx1][randIdx2].type = mine;
    // }
    return board
}

// function renderBoard(mat, selector) {

//     var strHTML = '<table border="0"><tbody>'
//     for (var i = 0; i < mat.length; i++) {

//         strHTML += '<tr>'
//         for (var j = 0; j < mat[0].length; j++) {

//             const cell = mat[i][j]
//             const className = 'cell cell-' + i + '-' + j
//             strHTML += `<td class="${className}">${cell}</td>`
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>'

//     const elContainer = document.querySelector(selector)
//     elContainer.innerHTML = strHTML
// }

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === land) cellClass += ' land';
            else if (currCell.type === mine) cellClass += ' mine';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="cellClicked(this,${i},${j})"oncontextmenu="markCell(this,${i},${j})">\n`;

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// location such as: {i: 2, j: 7}
function renderCell(elCell, value) {
    // Select the elCell and set the value
    // const i = location[0]
    // const j = location[1]
    // const elCell = document.querySelector(`.cell-${i}-${j}`)
    // var cell = gBoard[cellLocation[0]][cellLocation[1]]
    elCell.innerHTML = value
    if (value === !NaN) {
        elCell.style.innerText = value
    }
    return
}

function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}

function getEmptyCells() {

    if (gEmptyCells.length > 1) return
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.gameElement === null && currCell.type === FLOOR) {
                var cellClass = getClassName({ i: i, j: j })
                var TempArray = cellClass.split('-')
                var cellLocation = TempArray.slice(1)
                gEmptyCells.push({ i: cellLocation[0], j: cellLocation[1] })
            }

        }
    }

    return gEmptyCells
}

function addRandomBalls() {
    if (gBalls >= 5) return
    getEmptyCells()
    var RandomCellIdx = getRandomInt(0, gEmptyCells.length - 1)
    var cellLocation = gEmptyCells[RandomCellIdx]
    //Update Model
    gBoard[+cellLocation.i][cellLocation.j].gameElement = BALL
    gBalls++

    // Update DOM
    renderCell(cellLocation, BALL_IMG)
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].type === mine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function countActiveNegs(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isActive) count++
        }
    }
    return count
}




// GENERAL


function openModal(content) {
    // Todo: show the modal and schedule its closing
    var elModal = document.querySelector(".modal")
    elModal.style.display = 'inline'
    var elModalH2 = elModal.querySelector('h2')
    elModalH2.innerText = content
    // elModalH2.style.color = getRandomColor()
    // setTimeout(closeModal, 5000)
}
function closeModal() {
    // Todo: hide the modal
    document.querySelector(".modal").style.display = 'none'
}

function drawNum() {
    var num = getRandomInt(gNums[0], gNums.length)
    var numReturned = gNums.splice(num - 1, 1)
    return numReturned.toString()
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function shuffledArray(array) {
    const shuffledArray = array.sort((a, b) => 0.5 - Math.random());
    return shuffledArray
}

function addGlobalEventListener(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) {
            callback(e)
        }
    })
}