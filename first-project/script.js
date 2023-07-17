"use strict";
//emum is custom type
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["AUTHOR"] = 1] = "AUTHOR";
    Role[Role["USER"] = 2] = "USER";
})(Role || (Role = {}));
const person = {
    name: 'John',
    age: 21,
    hobbies: ['cooking', 'coding'],
    fav: [2, 'lucky'],
    role: Role.ADMIN,
};
function combine(input1, input2, resultConversion // literal types
) {
    //this is union type number or string
    let result;
    if ((typeof input1 === 'number' && typeof input2 === 'number') ||
        resultConversion === 'as-number') {
        result = +input1 + +input2;
    }
    else {
        result = input1.toString() + input2.toString();
    }
    return result;
}
const combinedAges = combine(30, 26, 'as-number');
// console.log(combinedAges);
const combinedStringAges = combine('30', '26', 'as-number');
// console.log(combinedStringAges);
const combinedNames = combine('Max', 'Anna', 'as-text');
// console.log(combinedNames);
function add(n1, n2) {
    return n1 + n2;
}
function printResult(num) {
    console.log('Result' + num);
}
//callback types
function addAndHandle(n1, n2, cb) {
    const result = n1 + n2;
    cb(result);
}
printResult(add(2, 3));
//function as type using ()=
let combineValue;
combineValue = add;
// combineValue=printResult; //we get error
console.log(combineValue(8, 9));
console.log(addAndHandle(11, 12, (result) => {
    console.log(result);
}));
//unknown type
let userInput;
let userName;
userInput = 5;
userInput = 'Max';
if (typeof userInput === 'string') {
    userName = userInput;
}
// userName=userInput
//never type
function generateError(message, code) {
    throw { message: message, errorCode: code };
}
const result = generateError('an unknown error occurred', 500);
console.log(result); //this will not give undefined as in case of void but give no value.
