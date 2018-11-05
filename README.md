# Homework Assignment 2 - Pizza delivery 

Pirple course - Node Master Class Home Assignment 2, pizza delivery rest api.

## Getting Started

1. Clone repository.

### Prerequisites

1. Add secter.js in root and exports config for stripe, mailgun and hash

```
module.exports = {
    stripe: {
        public: 'string',
        secret: 'string'
    },
    mailgun: {
        domainName: 'string',
        apiKey: 'string',
        from: 'string'
    },
    hash: {
        secret: 'string'
    }
};
```

## Running

node index.js

## REST API

### /users
#### post
- **Description :**  Create a new user
- **Required header data :** none
- **Required payload data :**  email, password, firstName, lastName, address, city
- **Example payload :**
```
{
	"firstName": "string",
	"lastName": "string",
	"email": "string",
	"password": "stirng",
	"address": "string",
	"city": "string"
}
```
- **Success response :** 200
- **Success response data:**
```
{
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string"
}
```

#### get
- **Description :** Returns authorized user's data
- **Required query data :** email
- **Required header data :** token
- **Example use :**
```
http://localhost:3000/users?email=string@string.com
```
- **Success response :** 200
- **Success response data:**
```
{
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string"
}
```
#### put
- **Description** : Updates user's data
- **Required header data** : token
- **Required payload data** : email
- **Optional payload data** : firstName, lastName, address, city
- **Example payload :**
```
{
    "email": "string"
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string"
}
```
- **Success response** : 200
- **Success response data**
```
{
    "email": "string"
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string"
}
```
#### delete
- **Description** : Deletes user's file
- **Required header data** : token
- **Required query data** : email
- **Example request**
```
http://localhost:3000/users?email=string@string.com
```
- **Success response** : 200

### /tokens
#### post
- **Description** : Creates a new token
- **Required payload data** : email, password
- **Required header data** : none
- **Example payload**
```
{
    'email':'string@string.com, 
    'password':'string'
}
```
- **Success response** : 200
- **Success response data**
```
{
    "email": "string@string.com",
    "id": "string",
    "expires": number (date time expires)
}
```
#### get
- **Description** : Returns token data
- **Required query data** : id
- **Required header data** : none
- **Example request** 
```
http://localhost:3000/tokens?id="token-string"
```
- **Success response** : 200
- **Success response data**
```
{
    "email": "string@string.com",
    "id": "string",
    "expires": number (date time expires)
}
```
#### put
- **Description** : Extends expiration
- **Required payload data** : id, extend
- **Optional payload data** : none
- **Required header data** : none
- **Example payload**
```
{
    "id": "srting", 
    "extend": boolean
}
 ```
- **Success response** : 200
- **Success response data**
```
{
    "email": "string@string.com",
    "id": "string",
    "expires": number (date time expires)
}
```
#### delete
- **Description** : Deletes token 
- **Required query data** : id
- **Required header data** : none
- **Example request**
```
http://localhost:3000/tokens?id=token-string
```
- **Success response** : 200

### menu
#### get
- **Description** : Return pizza menu list
- **Required payload data** : email
- **Required header data** : token
- **Example request**
```
http://localhost:3000/menu?email=string@string.com
```
- **Success response** : 200
- **Success response data**
```
[
    {
        "name": "MARGARITA",
        "description": "Tomato sauce and mozzarella",
        "price": 10
    },
    {
        "name": "VEGETARIANA",
        "description": "Mozzarella, cultivated mushrooms, grilled vegetables",
        "price": 12
    },
    {
        "name": "CAPRICCIOSA",
        "description": "Mozzarella, ham, cultivated mushrooms",
        "price": 14
    },
    {
        "name": "QUATTRO FORMAGGI",
        "description": "Mozzarella, emmenthal, gorgonzola and piquant provolone cheeses",
        "price": 17
    }
]
```

### /carts

#### post
- **Description** : Add a new menu item or increment quantity in shopping cart.
- **Required payload data** : email, pizzaName
- **Required header data** : token
- **Example payload**
```
{
	"email": "string@string.com",
	"pizzaName": "string"
}
```
- **Success response** : 200
- **Success response data**
```
{
    "menuItems": [
        {
            "name": "VEGETARIANA",
            "description": "Mozzarella, cultivated mushrooms, grilled vegetables",
            "price": 12,
            "quantity": 1
        },
        {
            "name": "CAPRICCIOSA",
            "description": "Mozzarella, ham, cultivated mushrooms",
            "price": 14,
            "quantity": 2
        }
    ],
    "user": {
        "email": "string@string.com",
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "city": "string"
    }
}
```

#### get
- **Description** : Return cart for user.
- **Required payload data** : email
- **Required header data** : token
- **Example payload**
```
http://localhost:3000/carts?email=string@string.com
```
- **Success response** : 200
- **Success response data**
```
{
    "menuItems": [
        {
            "name": "VEGETARIANA",
            "description": "Mozzarella, cultivated mushrooms, grilled vegetables",
            "price": 12,
            "quantity": 1
        },
        {
            "name": "CAPRICCIOSA",
            "description": "Mozzarella, ham, cultivated mushrooms",
            "price": 14,
            "quantity": 2
        }
    ],
    "user": {
        "email": "string@string.com",
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "city": "string"
    }
}
```

#### delete
- **Description** : Remove menu item form user cart or reduces quantity.
- **Required payload data** : email, pizzaName
- **Required header data** : token
- **Example payload**
```
{
	"email": "string@string.com",
	"pizzaName": "string"
}
```
- **Success response** : 200
- **Success response data**
```
{
    "menuItems": [
        {
            "name": "VEGETARIANA",
            "description": "Mozzarella, cultivated mushrooms, grilled vegetables",
            "price": 12,
            "quantity": 1
        },
        {
            "name": "CAPRICCIOSA",
            "description": "Mozzarella, ham, cultivated mushrooms",
            "price": 14,
            "quantity": 2
        }
    ],
    "user": {
        "email": "string@string.com",
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "city": "string"
    }
}
```
### /order

#### post
- **Description** : Order the cart contents.  Remove user cart, accept payment with stripe and acknowledge with mailgun.
- **Required payload data** : email, stripeToken
- **Optional payload data** : none
- **Required header data** : token
- **Example payload**
```
{
	"email": "string@string.com",
	"stripeToken": "string"
}
```
- **Success response** : 200
- **Success response data**
```
{
    "id": "string@string_string",
    "amount": 40,
    "date": 1541411771034,
    "stripeToken": "tok_mastercard",
    "menuItems": [
        {
            "name": "VEGETARIANA",
            "description": "Mozzarella, cultivated mushrooms, grilled vegetables",
            "price": 12,
            "quantity": 1
        },
        {
            "name": "CAPRICCIOSA",
            "description": "Mozzarella, ham, cultivated mushrooms",
            "price": 14,
            "quantity": 2
        }
    ],
    "user": {
        "email": "string@gstring.com",
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "city": "string"
    }
}
```

