class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[0-9\.]+$/
    if(puzzleString.length !== 81){
      return "a"
    }
        if(!regex.test(puzzleString)){
        return "b"
      }else{
        return 'c'
      }
      }
  
      letterToNumber(letter){
        const alphabet = 'ABCDEFGHI'
        return alphabet.indexOf(letter.toUpperCase()) + 1
      }
    
    
  checkRowPlacement(puzzleString, row, column, value) {
    const text = puzzleString;
    const rows = [];
    for (let i = 0; i < 81; i += 9) {
      rows.push(text.slice(i, i + 9));
    }
    const rowIndex = this.letterToNumber(row) - 1;
   if (rows[rowIndex].includes(value)) {
      return false;
    }
  
    return true; 
  }

  checkColPlacement(puzzleString, row, column, value) {
    const text = puzzleString;
    const rows = [];
    for (let i = 0; i < 81; i += 9) {
      rows.push(text.slice(i, i + 9));
    }
    let rows1 = [];
    for(let k = 0; k < 9; k++){
      for(let j = 0; j < 9; j++){
        rows1.push(rows[j][k])
      }
    }
    rows1 = rows1.join("")
    const rows2 = [];
    for(let l = 0; l < 81; l += 9 ){
   rows2.push(rows1.slice(l, l + 9));
    }
    if(rows2[column - 1].includes(value)){
    return false
  }else{
    return true
  }}

  checkRegionPlacement(puzzleString, row, column, value) {
    const text = puzzleString;
    const first = text.slice(0, 27);
    const second = text.slice(27, 54);
    const third = text.slice(54, 81);
    const rows1 = [];
    const rows2 = [];
    const rows3 = [];
    for(let i = 0; i < 3; i++){
      rows1.push(first.slice(i*9, i*9 + 3))
    }
    for(let j = 0; j < 7; j += 3){
      rows2.push(first.slice(j*3 + 3, j*3 + 6))
    }
    for(let k = 0; k < 7; k += 3){
      rows3.push(first.slice(k*3 + 6, k*3 + 9))
    }
    const rows4 = [];
    const rows5 = [];
    const rows6 = [];
    for(let i = 0; i < 3; i++){
      rows4.push(second.slice(i*9, i*9 + 3))
    }
    for(let j = 0; j < 7; j += 3){
      rows5.push(second.slice(j*3 + 3, j*3 + 6))
    }
    for(let k = 0; k < 7; k += 3){
      rows6.push(second.slice(k*3 + 6, k*3 + 9))
    }
   const rows7 = [];
   const rows8 = [];
   const rows9 = [];
   for(let i = 0; i < 3; i++){
    rows7.push(third.slice(i*9, i*9 + 3))
  }
  for(let j = 0; j < 7; j += 3){
    rows8.push(third.slice(j*3 + 3, j*3 + 6))
  }
  for(let k = 0; k < 7; k += 3){
    rows9.push(third.slice(k*3 + 6, k*3 + 9))
  }
  console.log("col: ", column, "row: ", row)
  const combinedRows = [rows1.join(""), rows2.join(""), rows3.join(""), rows4.join(""), rows5.join(""), rows6.join(""), rows7.join(""), rows8.join(""), rows9.join("")];
  const colRegion = Math.ceil(column / 3);
  let rowRegion;
  if(this.letterToNumber(row) < 4){
    console.log("A")
    rowRegion = -1;
  }else if (this.letterToNumber(row) > 3 && this.letterToNumber(row) < 7){
    console.log('B')
    rowRegion = 2;
  }else{
    console.log('C')
    rowRegion = 5;
  }
  console.log(combinedRows)
  console.log("col region: ", colRegion, "row region: ", rowRegion)
  const combinedRegion = colRegion + rowRegion;
  console.log("combinedRegion: ", combinedRegion)
    if(combinedRows[combinedRegion].includes(value)){
      console.log('false')
      return false
    }else{
      console.log('true')
      return true
    }
  }

  solve(puzzleString) {
    const validate = this.validate(puzzleString)
    if(validate === 'a' || validate === 'b'){
      return false 
    }else{
    const emptyCellIndex = this.findEmptyCell(puzzleString);
    
    // Base case: If there's no empty cell, the puzzle is solved
    if (emptyCellIndex === -1) {
      return puzzleString; // Return the solved puzzle
    }

    // Calculate the row and column from the index
    const row = Math.floor(emptyCellIndex / 9);
    const column = emptyCellIndex % 9;

    // Try placing numbers 1-9 in the empty cell
    for (let num = 1; num <= 9; num++) {
      const value = num.toString();

      // Check if the value can be placed in the row, column, and 3x3 region
      let isValid = true;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (puzzleString[row * 9 + c] === value) {
          isValid = false;
          break;
        }
      }

      // Check column
      for (let r = 0; r < 9; r++) {
        if (puzzleString[r * 9 + column] === value) {
          isValid = false;
          break;
        }
      }

      // Check 3x3 region
      const regionRowStart = Math.floor(row / 3) * 3;
      const regionColStart = Math.floor(column / 3) * 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (puzzleString[(regionRowStart + r) * 9 + (regionColStart + c)] === value) {
            isValid = false;
            break;
          }
        }
      }

      // If valid, place the value and recursively attempt to solve the rest of the puzzle
      if (isValid) {
        const newPuzzleString = this.replaceCharAt(puzzleString, emptyCellIndex, value);
        const result = this.solve(newPuzzleString);

        // If a solution is found, return the solved puzzle
        if (result) {
          return result;
        }
      }
    }}

    // If no valid solution is found, return false (backtrack)
    return false;
  }

  findEmptyCell(puzzleString) {
    return puzzleString.indexOf('.');
  }

  replaceCharAt(puzzleString, index, char) {
    return puzzleString.slice(0, index) + char + puzzleString.slice(index + 1);
  }
}

module.exports = SudokuSolver;

