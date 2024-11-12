// import { DynamicProxy } from './DynamicProxy';
import { saveToDb, loadFromDb, createTrackedObject, generateKey } from './database';

// Initial data setup
class Parent {
    value: number;
    sub_obj: { value: number };

    constructor(value: number) {
        this.value = value;
        this.sub_obj = new Child(value * 2);
    }

    public HelloWorld() {
        console.log("Hello World!")
    }
}

class Child {
    value: number;

    constructor(value: number) {
        this.value = value;
    }
}
const parent = new Parent(10);
const key = generateKey();
saveToDb(key, parent);

// Create and test a tracked object
const trackedParent = createTrackedObject(parent, key);

// console.log("Initially loaded:", trackedParent._loaded); // false

// Accessing properties to trigger lazy loading
console.log("Access value:", trackedParent.value); // Loads value from "DB"
// console.log("Loaded after access:", trackedParent._loaded); // true

console.log("Access sub_obj.value:", trackedParent.sub_obj.value); // Loads sub_obj lazily

trackedParent.HelloWorld()
// console.log("Loaded sub_obj after access:", trackedParent.sub_obj._loaded); // true

// Modify the object to test auto-saving
trackedParent.value = 15;
console.log("Modified value:", trackedParent.value); // Reflects new value

console.log("Database now contains:", loadFromDb(key)); // Updated in DB
