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

class cannot inherit from multiple classes.

# inheritance

_scope_ should be used before _this_.

scope might required to pass arguments depending on constructor in parent class.

getter and setter are property that execute method.
so instead of calling as function with arguments passing ,just assign value to the property.

use getter and setter for encapsulating logic.

use static to call withour creating instance/new

# abstract

it is used basically to enforce all extending classes to implement methods or fields from the abstract class.
eg. if we want all id to be enforced the we can create a abstract class with id as abstract and extend with other classes so it will
always define id .

# singleton

it is to insure that a class always have one instance.
for this we make constructor private so only through static method we can create an instance.

# interface

it is used to create structure for objects without creating an instance.
_implements_ is used to do extent from interface. such so an abject created will only have one class and have multiple interfaces.
interface is commonly used to share functionality amoung different classes.
we can have readonly in interface.
interface is similar to custom _type_ .
optional properties can be used.

# advanced types

**Intersection Types**<br>
we can combine two types get intersection of types.<br>
eg:<br>
type Combinable = string|number;<br>
type Number =number|boolean;<br>
so<br>
type Universal =Combinable & Number;<br>
we get get type number as it is common in both types Combinable and Number.<br>
