'use strict'

// Global Variables
var gBoard
var gGame = {
    minesCount: 0,
    level: '',
    flagsCount: 0,
}
var land = 'land'
var mine = 'mine'

function initGame() {
    console.log('init:')
    gBoard = createBoard(4, 4)
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)
}

