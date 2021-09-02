//$(function() {
console.log('sssss')
let fs = require('fs'); //ของเวปใช้ cdn ชื่อ fs แทน
console.log('aaaaa')
let robot = "10.0.0.205:4000"
fs.writeFile('robot.txt', robot, 'utf8', (err, data) => {});
//});
//robot.txt = path ของ file ip
//robot