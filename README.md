# Sesame API

API to create expiring secrets with passphrase protection. Used by client application [Sesame](https://github.com/atelierdisko/sesame).

## Local development
```shell script
docker-compose up
```

## Endpoints

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Sesame&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fatelierdisko%2Fsesame-api%2Fmaster%2Finsomnia.json)
### Create a new secret

**POST** /secret

**Request**
```json
{
  "secret": "Moin, na?",
  "lifetime": "1 hour"
}
```

**Response (200)**
```json
{
  "hash": "ef7e272155d0a13583010b47566f3c844a6965e4ab79f5ee7d5eb7147000caef",
  "expiry": 3600
}
```

**Response (400)**
```json
{
  "message": "Bad request",
  "errors": {
    "secret": "Required",
    "lifetime": "Unsupported lifetime"
  },
  "code": 400
}
```

### Check that a secret exists
**GET** /secret/{hash}/exits

**Response (200)**
```
{
  "secret": "disko not disco"
}
```

**Response (404)**
```
{
  "message": "Hash not found",
  "code": 404
}
```

### Retrieve a secret
**GET** /secret/{hash}\
**GET** /secret/{hash}?passphrase={passphrase}

**Response (200)**
```
{
  "requiresPassphrase": true
}
```


**Response (403)**
```
{
  "message": "Passphrase invalid!",
  "code": 403
}
```


**Response (404)**
```
{
  "message": "Hash not found",
  "code": 404
}
```

### Delete a secret
**DELETE** /secret/{hash}

**Response (204)**
```
¯\_(ツ)_/¯
```

**Response (404)**
```
{
  "message": "Hash not found",
  "code": 404
}
```