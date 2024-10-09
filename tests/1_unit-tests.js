const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
test("Logic handles a valid puzzle string of 81 characters", function(){
    assert.equal(solver.validate("769235418851496372432178956174569283395842761628713549283657194516924837947381625"), "c")
})

test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function(){
    assert.equal(solver.validate("76923541885149637243217895617456928339584276162871354928365719451692483794738162b"), "b")
})

test("Logic handles a puzzle string that is not 81 characters in length", function(){
    assert.equal(solver.validate("76923541885149637243217895617456928339584276162871354928365719451692483794738162"), "a")
})

test("Logic handles a valid row placement", function(){
    assert.equal(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 7), true)
})

test("Logic handles an invalid row placement", function(){
    assert.equal(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 9), false)
})

test("Logic handles a valid column placement", function(){
    assert.equal(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 7), true)
})

test("Logic handles an invalid column placement", function(){
    assert.equal(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 8), false)
})

test("Logic handles a valid region (3x3 grid) placement", function(){
    assert.equal(solver.checkRegionPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 7), true)
})

test("Logic handles an invalid region (3x3 grid) placement", function(){
    assert.equal(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", 'A', '1', 8), false)
})

test("Valid puzzle strings pass the solver", function(){
    assert.equal(solver.solve("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
})

test("Invalid puzzle strings fail the solver", function(){
    assert.equal(solver.solve("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6q"), false)
})

test("Solver returns the expected solution for an incomplete puzzle", function(){
    assert.equal(solver.solve("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
})
});
