# TypeScript core type

<img src="images\coreTypes.png"></img>

# Union types

number | string - '|' is useing to present union of types

# literal types

lieral is a part of type. Eg. 'hello world' is a string but all strings are not 'hello world'

# type aliases

it basically give aliases for any combination of types we want.

# function as type

we can specify what type of arguments and results a function should return

# unknown type

only after checking the type then can assign value.

# never type

never produces a value.

# ts configuration

tsc --watch is for monitoring changes to ts files
tsc --init is for initialization of ts projects so when compilation all ts files are checked

we can exclude any files if mentioned in the configuration.
eg: "exclude":["node_modules"] //this is default excluded
