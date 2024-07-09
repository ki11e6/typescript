type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// interface ElevatedEmployee extends Employee, Admin {}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;
const u: Universal = 11; //here we can only have numbers as intersection of combinable and numeric is number.

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    //this is called type guard using typeof
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    //this is type guard using in .
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}

printEmployeeInformation({ name: "Manu", startDate: new Date() });

class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo ..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    //type guard with instance of .
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
  type: "bird"; //discriminated union
  flyingSpeed: number;
}

interface Horse {
  type: "horse"; //discriminated union
  runningSpeed: number;
}
//discriminated union is used here with type so we can identify what is its type.
type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
  }
  console.log("Moving at speed: " + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 10 });

// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!;
const userInputElement = document.getElementById("user-input");
// const userInputElement = document.getElementById('user-input')! as HTMLInputElement; // this is typcasting to HTMLInputElement

if (userInputElement) {
  //as is used  for tycasting.
  (userInputElement as HTMLInputElement).value = "Hi there!";
}

//index property
//if we don't know how many properties we want we can use index property using []
interface ErrorContainer {
  //  id:number; //Property 'id' of type 'number' is not assignable to 'string' index type 'string'.
  // id: string; //only string as index property is string.
  [prop: string]: string; //with this we can have many properties.
}

const errorBag: ErrorContainer = {
  email: "not a valid email",
  paswd: "not a valid password",
  username: "not a valid username",
};

const fetchedUserData = {
  id: "ul",
  name: "Max",
  job: { title: "CEO", description: "Master" },
};
//this is optional chaining
console.log(fetchedUserData?.job?.title);

//nullish coalescing
const userData = undefined || null;
const storeData = userData ?? "default";
