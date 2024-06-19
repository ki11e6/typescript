# TypeScript core type

<img src="images\coreTypes.png"></img>

# Union types

number | string - '|' pipe is using to present union of types

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

it is mainly used for object.
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

**Type Casting**
we can use 'as' for type casting.

**optional chaining**
its is used if we are not sure that there exists which we trying to fetch . its used in objects.<br>
its also know as short circuiting inorder not show error but not defined.

**Nullish cohescing**
?? is used used check if variable is null or undefined and so can provide a default value or better one.

# Generics

Generics are a powerful feature in TypeScript that allows you to create reusable components that can work with a variety of data types rather than just a single one. This means that you can write code that is flexible and scalable, allowing users to consume these components and use their own types.

One of the main advantages of using generics is that it provides type safety without compromising performance or productivity. For example, you can write a generic function that takes in an argument of any type and returns a value of the same type. This allows you to write code that is more flexible and reusable, as you don't have to write separate functions for each data type.

we can create generic variables,functions and classes.<br>
generic utilities

- Partial is used to set properties are optional.
- Readonly is used avoid any modification to the properties.

generic types is used if wannt a fixed type.<br>
union types are used if wannt a flexible type.

# Decorators

@ is used to declare it a decorator.
Decorators are special kinds of declarations that can be attached to classes, methods, properties, and parameters.<br>
They allow developers to observe, modify, or replace the behavior of these elements.<br>
Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.<br>
They are applied using the “@” symbol, followed by the decorator function’s name.<br>
Decorators are a way to decorate members of a class, or a class itself, with extra functionality.<br>
When you apply a decorator to a class or a class member, you are actually calling a function that is going to receive details of what is being decorated,<br>
and the decorator implementation will then be able to transform the code dynamically, adding extra functionality, and reducing boilerplate code. <br>
They are a way to have metaprogramming in TypeScript, which is a programming technique that enables the programmer to create code<br>
that uses other code from the application itself as data.

# types vs interfaces

_interface_ is mainly used for defining types of objects. but there are limitations like _interface_ can be used to define function types but cannot use _interface_ to store a union type.
<br>

_interface_ is used when we want to implement class. it can also be used more extending types such that use can use same interface name to add somemore types later to the interface.
