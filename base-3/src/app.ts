interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}

let user1: Person;
user1 = {
  name: 'John',
  age: 11,
  greet(phrase: string) {
    console.log(phrase);
  },
};
