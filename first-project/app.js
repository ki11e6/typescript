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
printResult(add(2, 3));
//function as type using ()=
var combineValue;
combineValue = add;
// combineValue=printResult; //we get error
console.log(combineValue(8, 9));
