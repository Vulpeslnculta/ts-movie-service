# ts-movie-service
[![CI](https://github.com/Vulpeslnculta/ts-movie-service/actions/workflows/CI.yml/badge.svg)](https://github.com/Vulpeslnculta/ts-movie-service/actions/workflows/CI.yml)

--- 

# AuthClient API

## Overview

The AuthClient API provides endpoints for issuing and validating JWT tokens.

## Base URL

`http://localhost:{port}`

Default port: `8080`

## Endpoints

### 1. Validate a JWT Token

**Endpoint:** `/validate-token`

**Method:** `POST`

**Summary:** Validate a JWT token.

**Request Body:**

- **Content-Type:** `application/json`
- **Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "token": {
        "type": "string",
        "description": "The JWT token to validate"
      }
    },
    "required": ["token"]
  }
  ```

#### Responses:

- 200: Token is valid
- 400: Invalid token
- 500: Internal Server Error

### 2. Issue a New JWT Token
Endpoint: /issue-token

Method: `POST`

Summary: Issue a new JWT token.

Request Body:

- **Content-Type:** `application/json`
- **Schema:**
```json
{
  "type": "object",
  "properties": {
    "userId": {
      "type": "string",
      "description": "The user ID for which to issue the token"
    }
  },
  "required": ["userId"]
}
```
#### Responses:

- 200: Token issued successfully
- 500: Internal Server Error

---

# Movie Service API

## Overview

The Movie Service API provides endpoints for managing movies and user authentication.

## Base URL

`http://localhost:{port}`


Default port: `4040`

## Endpoints

### Movies

#### 1. Get All Movies

**Endpoint:** `/movies`

**Method:** `GET`

**Summary:** Get all movies.

**Responses:**

- **200:** A list of movies

#### 2. Add a New Movie

**Endpoint:** `/movies`

**Method:** `POST`

**Summary:** Add a new movie.

**Responses:**

- **201:** Movie added successfully

#### 3. Update a Movie

**Endpoint:** `/movies`

**Method:** `PUT`

**Summary:** Update a movie.

**Responses:**

- **200:** Movie updated successfully

#### 4. Delete a Movie

**Endpoint:** `/movies`

**Method:** `DELETE`

**Summary:** Delete a movie.

**Responses:**

- **200:** Movie deleted successfully

#### 5. Get a Specific Movie

**Endpoint:** `/movie`

**Method:** `GET`

**Summary:** Get a specific movie.

**Responses:**

- **200:** Movie details

### Authentication

#### 1. User Login

**Endpoint:** `/auth/login`

**Method:** `POST`

**Summary:** User login.

**Responses:**

- **200:** User logged in successfully

#### 2. User Registration

**Endpoint:** `/auth/register`

**Method:** `POST`

**Summary:** User registration.

**Responses:**

- **201:** User registered successfully

#### 3. Change User Premium Status

**Endpoint:** `/auth/changePremium`

**Method:** `POST`

**Summary:** Change user premium status.

**Responses:**

- **200:** User premium status changed successfully

#### 4. Delete a User

**Endpoint:** `/auth/deleteUser`

**Method:** `POST`

**Summary:** Delete a user.

**Responses:**

- **200:** User deleted successfully

#### 5. Get All Users

**Endpoint:** `/auth/allusers`

**Method:** `GET`

**Summary:** Get all users.

**Responses:**

- **200:** A list of users