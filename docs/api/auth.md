# Auth API

Authentication uses Laravel Sanctum personal access tokens. Include the issued token in the `Authorization` header for protected endpoints.

- Header format: `Authorization: Bearer <token>`
- Content type: `application/json`
- Base path: `/api`

## Login

- Method: `POST`
- URL: `/api/auth/login`
- Auth: Not required

Request Body

```
{
  "login": "<email-or-username>",
  "password": "<password>"
}
```

Notes
- `login` accepts either a valid email or a username.
- Uses the `Auth` facade under the hood: attempts `email` or `username` + `password`.

Success Response (200)

```
{
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "jane",
    "gender": "Male|Female|Other|null",
    "phone": null,
    "codeforces_handle": null,
    "atcoder_handle": null,
    "vjudge_handle": null,
    "department": null,
    "student_id": null,
    "max_cf_rating": 0,
    "profile_picture": "https://.../media/.../thumb.jpg"
  },
  "token": "<sanctum-token>"
}
```

Error Response (422)

```
{
  "message": "Invalid credentials."
}
```

Validation Errors (422)

```
{
  "message": "The given data was invalid.",
  "errors": {
    "login": ["The login field is required."],
    "password": ["The password field is required."]
  }
}
```

## Logout

- Method: `POST`
- URL: `/api/auth/logout`
- Auth: Required (Sanctum bearer token)

Behavior
- Revokes the current access token (logs out only the current device/session).

Success Response (200)

```
{
  "message": "Logged out successfully."
}
```

## Usage Example

Curl

```bash
# Login
curl -sS -X POST "${BASE_URL}/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"login":"jane@example.com","password":"secret"}'

# => capture token from response as TOKEN

# Logout
curl -sS -X POST "${BASE_URL}/api/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}"
```

Postman
- Create a request to `POST /api/auth/login` with a raw JSON body.
- Save the `token` from the response and set it as a Postman variable.
- Create `POST /api/auth/logout` and set `Authorization: Bearer {{token}}`.
