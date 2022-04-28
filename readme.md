# React Serializable Model

A model framework for react that allows defining API properties and mapping for use in react apps.

When loading records from an API, it is common to just use the JSON returned in the result - but this means you dont know what a record will contain until runtime. SerializableModel gives you a way to define attributes of a model at design time, with basic validation and serialize/deserialize methods.

# Defining Models

Define models by extending SerializableModel and adding attribbutes and fragments to define your data structure.

e.g here's a simple Address model

```javascript
import SerializableModel from "./SerializableModel";
const {
    attr
} = SerializableModel;

export default class Address extends SerializableModel {
    country = attr('string');
    postcode = attr('string');
    state = attr('string');
    streetAddress = attr('string');
    suburb = attr('string');
}
```

you can then use this model as a fragment of another model e.g a Customer

```javascript
import SerializableModel from "./SerializableModel";
import Address from "./Address";
const {
    attr,
    fragment,
    fragmentArray
} = SerializableModel;

export default class Customer extends SerializableModel {
    firstName = attr('string');
    lastName = attr('string');
    dateOfBirth = attr('date');
    address = fragment(Address);
    otherAddresses = fragmentArray(Address); // an array of Address models
}
```

## Attribute options
You can configure your attributes with the following options

### Type
Values: number | boolean | string | array | enum  
Usage e.g attr('string')

### Serialize: false  
When set, this field will not be serialized back to the API. It is only used for deserializaing records.  
Usage `age: attr('number', { deserialize: false})`

### EnumType
When attr type is set to `enum` this property determines the enum-type to use. Pass in a reference to the Enum class.  
Usage: see #Enums below

## Usage
When loading records, call the static function `deserialize` to instantiate the model
```
fetch(`api/customer/1`)
  .then(response => Customer.deserialize(response.data);
```
When saving back to the API, call the `serialize` function on a model instance to output json for the API.
```
let json = customer.serialize();
fetch(`api/customer/1`, {
  method: 'POST',
  body: JSON.stringify(json)
})
```

## Enums
This library also includes a basic Enum implementation. Define your enum by extending `/enums/Enum` and defining your values

```javascript
import Enum from "./Enum";

class Country extends Enum {
    static get name() { return 'Country'; }

    Australia = 'Australia';
    UnitedKingdom = 'UnitedKingdom';
}

export default new Country();
```

This enum can then be used in your models. In this way you can have a set of defined values for enum fields and if the API gives you unexpected values you will see errors in the console (development only)

```javascript
import SerializableModel from "./SerializableModel";
import Country from '../enums/Country';
const {
    attr
} = SerializableModel;

export default class Address extends SerializableModel {
    country = attr('enum', { enumType: Country });
    // etc
}
```

The enum can be used in code logic anywhere you need e.g
```javascript
let country = customer.address.country;
switch(customer.address.country) {
    case Country.Australia:
       console.log("g'day");
       break;
    case Country.UnitedKingdom:
    default:
        console.log("'allo guv'na");
        break;
}
```
