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