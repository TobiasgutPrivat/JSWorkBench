import { DynamicProxy } from './DynamicProxy';
import { saveToDb, loadFromDb } from './database';

// Initial data setup
const parent = { value: 10, sub_obj: { value: 20 } };
saveToDb('parentKey', parent);

// Create and test a tracked object
const trackedParent = DynamicProxy.create(parent, 'parentKey');

// console.log("Initially loaded:", trackedParent._loaded); // false

// Accessing properties to trigger lazy loading
console.log("Access value:", trackedParent.value); // Loads value from "DB"
// console.log("Loaded after access:", trackedParent._loaded); // true

console.log("Access sub_obj.value:", trackedParent.sub_obj.value); // Loads sub_obj lazily
// console.log("Loaded sub_obj after access:", trackedParent.sub_obj._loaded); // true

// Modify the object to test auto-saving
trackedParent.value = 15;
console.log("Modified value:", trackedParent.value); // Reflects new value

console.log("Database now contains:", loadFromDb('parentKey')); // Updated in DB
