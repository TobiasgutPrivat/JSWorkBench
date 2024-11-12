// Simulating a NoSQL DB (e.g., MongoDB)
const database = {
    store: {}, // Simulating a simple object store (key-value pairs)
    async save(id, data) {
        this.store[id] = JSON.parse(JSON.stringify(data)); // Deep clone and save the data
        console.log(`Saved ${id}:`, data);
    },
    async load(id) {
        return this.store[id];
    }
};

// Simulate the SubObject and ParentObject
class SubObject {
    constructor(value) {
        this.value = value;
    }
}

class ParentObject {
    constructor(value) {
        this.value = value;
        this.sub_obj = new SubObject(value * 2);
    }
}

// Creating the Proxy for automatic data management
function createDynamicProxy(obj) {
    return new Proxy(obj, {
        async get(target, prop) {
            if (!target._loaded) {
                console.log(`Loading ${prop}...`);
                await loadData(target); // Simulate data loading from DB
            }
            return target[prop];
        },
        async set(target, prop, value) {
            // Save the object to the "database" before updating
            console.log(`Saving ${prop}...`);
            await database.save(target.constructor.name, target);
            
            // After saving, unload the data (reset it)
            target[prop] = value;
            unloadData(target);  // Simulate unloading the object (reset its state)
            return true;
        }
    });
}

// Simulate loading from the database
async function loadData(obj) {
    const loadedData = await database.load(obj.constructor.name);
    if (loadedData) {
        Object.assign(obj, loadedData); // Merge loaded data into the object
        console.log(`Loaded ${obj.constructor.name}`);
    }
    obj._loaded = true;
}

// Simulate unloading (resetting) the object
function unloadData(obj) {
    obj._loaded = false;
    Object.keys(obj).forEach(key => {
        if (key !== '_loaded') {
            delete obj[key]; // Remove all properties to simulate unloading
        }
    });
    console.log(`Unloaded ${obj.constructor.name}`);
}

// Demo
(async () => {
    // Create a new parent object
    const parent = new ParentObject(10);
    
    // Create a proxy for the parent object
    const parentProxy = createDynamicProxy(parent);

    // Accessing parentProxy (this triggers load automatically)
    console.log(`Parent value: ${parentProxy.value}`); // Should be 10, load will trigger
    console.log(`SubObject value: ${parentProxy.sub_obj.value}`); // Should be 20

    // Simulate saving the object (this will unload its data)
    console.log("Saving and unloading the object...");
    parentProxy.value = 15; // Set a new value (triggers save)
    
    // After saving, the object is unloaded (reset)
    console.log(`Is parent loaded? ${parentProxy._loaded}`); // Should be false
    console.log(`Is sub-object loaded? ${parentProxy.sub_obj._loaded}`); // Should be false

    // Access the proxy again (this triggers loading)
    console.log(`Parent value: ${parentProxy.value}`); // Should be reloaded (value will be 15)
    console.log(`SubObject value: ${parentProxy.sub_obj.value}`); // Should be reloaded (value will be 30)

    // After reloading, the sub-object will also be tracked
    console.log(`Is sub-object loaded? ${parentProxy.sub_obj._loaded}`); // Should be true
})();
