const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done){
    const expectedSolution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"; 

    chai.request(server)
    .post('/api/solve')
    .send({puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, expectedSolution); 
        done();
    })
})

test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done){
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: ""})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, 'Required field missing')
        done();
    })
})

test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done){
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a"})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done();
    })
})

test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done){
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6."})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done();
    })
})

test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done){
    chai.request(server)
    .post('/api/solve')
    .send({puzzle: "129..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done();
    })
})

test("Check a puzzle placement with all fields: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'A2',
        value: 6,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.valid, true)
        done();
    })
})

test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'A2',
        value: 1,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.valid, false)
        assert.equal(res.body.conflict, 'row' )
        done();
    })
})
test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'A1',
        value: 8,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.valid, false)
        assert.deepEqual(res.body.conflict, ["column", "region"] )
        done();
    })
})

test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'A2',
        value: 5,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.valid, false)
        assert.deepEqual(res.body.conflict, ["row", "column", "region"] )
        done();
    })
})

test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({coordinate: 'A2', value: 2})
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, "Required field(s) missing" )
        done();
    })
})

test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'Aa',
        value: 5,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, "Invalid coordinate" )
        done();
    })
})

test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: 'A2',
        value: 12,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, "Invalid value" )
        done();
    })
})

test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: '2A',
        value: 6,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, "Invalid coordinate" )
        done();
    })
})
test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({
        coordinate: '2A',
        value: 16,
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body);
        assert.equal(res.body.error, "Invalid coordinate" )
        done();
    })
})
});

