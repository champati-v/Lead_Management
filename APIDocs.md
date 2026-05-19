# API Documentation

Base URL:

```txt
http://localhost:5000/api
```

---

# Authentication APIs

## Register User

### POST `/auth/register`

Request Body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

## Login User

### POST `/auth/login`

Request Body:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "token": "JWT_TOKEN"
  }
}
```

---

## Get Current User

### GET `/auth/me`

Headers:

```txt
Authorization: Bearer TOKEN
```

---

# Leads APIs

## Create Lead

### POST `/leads`

Headers:

```txt
Authorization: Bearer TOKEN
```

Request Body:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "qualified",
  "source": "instagram"
}
```

---

## Get All Leads

### GET `/leads`

Supports:

* Pagination
* Search
* Filtering
* Sorting

Example:

```txt
/api/leads?page=1&status=qualified&source=instagram&search=rahul&sort=latest
```

---

## Get Single Lead

### GET `/leads/:id`

Headers:

```txt
Authorization: Bearer TOKEN
```

---

## Update Lead

### PATCH `/leads/:id`

Headers:

```txt
Authorization: Bearer TOKEN
```

Request Body:

```json
{
  "status": "contacted"
}
```

---

## Delete Lead

### DELETE `/leads/:id`

Headers:

```txt
Authorization: Bearer TOKEN
```

Admin only.

---

## Export CSV

### GET `/leads/export/csv`

Headers:

```txt
Authorization: Bearer TOKEN
```

Admin only.

Downloads:

```txt
leads.csv
```

---

# 📌 Query Parameters

| Parameter | Description          |
| --------- | -------------------- |
| page      | Pagination page      |
| search    | Search by name/email |
| status    | Filter by status     |
| source    | Filter by source     |
| sort      | latest / oldest      |

---

# 📄 Response Format

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```
