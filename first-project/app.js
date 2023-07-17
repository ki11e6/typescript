//emum is custom type
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["AUTHOR"] = 1] = "AUTHOR";
    Role[Role["USER"] = 2] = "USER";
})(Role || (Role = {}));
var person = {
    name: 'John',
    age: 21,
    hobbies: ['cooking', 'coding'],
    fav: [2, 'lucky'],
    role: Role.ADMIN,
};
function combine(input1, input2, resultConversion // literal types
) {
    //this is union type number or string
    var result;
    if ((typeof input1 === 'number' && typeof input2 === 'number') ||
        resultConversion === 'as-number') {
        result = +input1 + +input2;
    }
    else {
        result = input1.toString() + input2.toString();
    }
    return result;
}
var combinedAges = combine(30, 26, 'as-number');
// console.log(combinedAges);
var combinedStringAges = combine('30', '26', 'as-number');
// console.log(combinedStringAges);
var combinedNames = combine('Max', 'Anna', 'as-text');
// console.log(combinedNames);
function add(n1, n2) {
    return n1 + n2;
}
function printResult(num) {
    console.log('Result' + num);
}
//callback types
function addAndHandle(n1, n2, cb) {
    var result = n1 + n2;
    cb(result);
}
printResult(add(2, 3));
//function as type using ()=
var combineValue;
combineValue = add;
// combineValue=printResult; //we get error
console.log(combineValue(8, 9));
console.log(addAndHandle(11, 12, function (result) {
    console.log(result);
}));
//unknown type
var userInput;
var userName;
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
var result = generateError('an unknown error occurred', 500);
console.log(result); //this will not give undefined as in case of void but give no value.
