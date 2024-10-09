'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      if(!coordinate || !value || !puzzle){
        res.json({ error: 'Required field(s) missing' })
      }
     
      const validate = solver.validate(puzzle)
      if(validate === "a"){
        res.json({error: 'Expected puzzle to be 81 characters long' })
        console.log("a")
        return;
      }else if (validate === "b"){
        res.json({ error: 'Invalid characters in puzzle' })
        console.log("b")
        return;
      }else{
        console.log("c")}

      console.log(`coordinate: ${coordinate}`, `value: ${value}`)
     const row = coordinate.split("")[0];
     const column = coordinate.split("")[1];
     console.log("row: ", row, "column: ", column)
     const ABC = (solver.letterToNumber(row) - 1) * 9;
     console.log('ABC: ', ABC, puzzle.split("")[ABC - 1 + Number(column)] === value? true: ABC - 1 + Number(column))
     const regex = /^[ABCDEFGHI]{1}$/
     const regex2 = /^[123456789]{1}$/
     if(coordinate.length === 2){
      if(!regex.test(row) || !regex2.test(column)){
        res.json({ error: 'Invalid coordinate' })
        return;
      }else if(!regex2.test(value)){
        res.json({ error: 'Invalid value' })
        return;
      }else{
        console.log('before')
        const checkRow = solver.checkRowPlacement(puzzle, row, column, value);
        const checkCol = solver.checkColPlacement(puzzle, row, column, value); 
       const checkRegion = solver.checkRegionPlacement(puzzle, row, column, value)
       console.log(`checkRegionPlacement: ${checkRegion}`) 
       if(puzzle.split("")[ABC - 1 + Number(column)] === value){
        res.json({valid: true})
       }else{ 
       if(checkRow && checkCol && checkRegion){
          res.json({valid: true})
          return;
        }else {
          res.json({
            valid: false,
          conflict: [
            !checkRow? "row": null,
            !checkCol? "column": null,
            !checkRegion? "region": null
          ].filter(Boolean)
        })}
        }
      }}else{
        res.json({ error: 'Invalid coordinate' })
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if(!puzzle){
        res.json({ error: 'Required field missing'})
        console.log("err")
        return;
      }
      const validate = solver.validate(puzzle)
      if(validate === "a"){
        res.json({error: 'Expected puzzle to be 81 characters long' })
        console.log("a")
        return;
      }else if (validate === "b"){
        res.json({ error: 'Invalid characters in puzzle' })
        console.log("b")
        return;
      }else{
        console.log("c")
        const solution = solver.solve(puzzle)
      if(!solution){
      res.json({ error: 'Puzzle cannot be solved' })
      console.log('n')
      }else{
        res.json({solution})
        console.log('y')
      }
      }
    });
};
