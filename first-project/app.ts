//emum is custom type
enum Role { ADMIN, AUTHOR, USER }

const person: {
    age: number,
    name: string,
    hobbies: string[],
    fav: [number, string] //tuple- it is a array with limitations
    role: Role
} = {
    name: 'John',
    age: 21,
    hobbies: ['cooking', 'coding'],
    fav: [2, 'lucky'],
    role: Role.ADMIN,
}

function combine(input1: number | string, input2: number | string) { //this is union type number or string
    let result: (number | string)
    if (typeof input1 === 'number' && typeof input2 === 'number') {
        result = input1 + input2;
    } else {
        result = input1.toString() + input2.toString();
    }
    return result
}

const combineAges = combine("sharath", 23)
console.log(combineAges)