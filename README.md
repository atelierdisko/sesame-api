# Sesame API

API to create expiring secrets with passphrase protection. Used by client application [Sesame](https://github.com/atelierdisko/sesame).

## Local development
1. Download repository
2. Start [Docker](https://www.docker.com/get-started)
3. Start Sesame Docker container with 
```
docker-compose up
```

The container is now up and running.

To see Sesame in your browser, additionally download the [Sesame client application](https://github.com/atelierdisko/sesame)

## Endpoints

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Sesame&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fatelierdisko%2Fsesame-api%2Fmaster%2Finsomnia.json)

Note that the API does not encrypt secrets before saving them. To make sure the server never knows about the contents, secrets are encrypted client side using AES-256. For explanatory purposes secrets are provided unencrypted in this documentation.

### Create a new secret

**POST** /api/secret

**Request**
```json
{
  "secret": "Moin. Auch hier?",
  "lifetime": "1 day"
}
```

**Response (200)**
```json
{
  "hash": "99c0789a791768be960359edf3f3e5c811eda57d3ddc2d7f90791cf5ef111f2c",
  "expiry": 86400
}
```

**Response (400)**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "\"lifetime\" must be one of [10 minutes, 1 hour, 2 hours, 8 hours, 1 day, 7 days]",
  "validation": {
    "source": "payload",
    "keys": [
      "lifetime"
    ]
  }
}
```

### Check that a secret exists
**GET** /api/secret/{hash}/exits

**Response (204)**
```
¯\_(ツ)_/¯
```


**Response (404)**
```
¯\_(ツ)_/¯
```

### Retrieve a secret
**GET** /api/secret/{hash}

**Response (200)**
```
{
  "secret": "Moin. Auch hier?"
}
```

**Response (404)**
```
¯\_(ツ)_/¯
```

### Delete a secret
**DELETE** /secret/{hash}

**Response (204)**
```
¯\_(ツ)_/¯
```

**Response (404)**
```
¯\_(ツ)_/¯
```