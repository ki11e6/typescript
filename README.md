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

we can configure where the js files created through outDir

"noEmitOnError": true, /_ Disable emitting files if any type checking errors are reported. _/

"sourceMap": true ,when set to true ts file will be shown in the source in the browser

# class and instance

public
protected
private
readonly

# inheritance

scope should be used before this.

scope might required to pass arguments depending on constructor in parent class.

use getter and setter for encapsulating logic.

use static to call withour creating instance/new
