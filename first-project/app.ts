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



console.log(person);