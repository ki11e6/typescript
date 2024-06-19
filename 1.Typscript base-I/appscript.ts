//emum is custom type
enum Role {
  ADMIN,
  AUTHOR,
  USER,
}

const person: {
  age: number
  name: string
  hobbies: string[]
  fav: [number, string] //tuple- it is a array with limitations
  role: Role
} = {
  name: 'John',
  age: 21,
  hobbies: ['cooking', 'coding'],
  fav: [2, 'lucky'],
  role: Role.ADMIN,
}

// type aliases
type Combinable = number | string
type ConversionDescription = 'as-number' | 'as-text'

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConversion: ConversionDescription // literal types
) {
  //this is union type number or string
  let result: Combinable
  if (
    (typeof input1 === 'number' && typeof input2 === 'number') ||
    resultConversion === 'as-number'
  ) {
    result = +input1 + +input2
  } else {
    result = input1.toString() + input2.toString()
  }
  return result
}

const combinedAges = combine(30, 26, 'as-number')
// console.log(combinedAges);

const combinedStringAges = combine('30', '26', 'as-number')
// console.log(combinedStringAges);

const combinedNames = combine('Max', 'Anna', 'as-text')
// console.log(combinedNames);

function add(n1: number, n2: number) {
  return n1 + n2
}

function printResult(num: number) {
  console.log('Result' + num)
}

//callback types
function addAndHandle(n1: number, n2: number, cb: (n: number) => void) {
  const result = n1 + n2
  cb(result)
}
printResult(add(2, 3))

//function as type using ()=
let combineValue: (a: number, b: number) => number

combineValue = add
// combineValue=printResult; //we get error

console.log(combineValue(8, 9))
console.log(
  addAndHandle(11, 12, (result) => {
    console.log(result)
  })
)

//unknown type
let userInput: unknown
let userName: string

userInput = 5
userInput = 'Max'
if (typeof userInput === 'string') {
  userName = userInput
}
// userName=userInput

//never type

function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code }
}

const result = generateError('an unknown error occurred', 500)
console.log(result) //this will not give undefined as in case of void but give no value.
