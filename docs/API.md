# Baobab Bush Portal - API Reference

## Overview

The Baobab Bush Portal API provides RESTful endpoints for accessing portal data, ecosystem metrics, and managing interactions.

**Base URL:** `http://localhost:3000/api`  
**Version:** 2.0.0  
**Content-Type:** `application/json`

---

## Authentication

Currently, the API is open and does not require authentication. Future versions will implement JWT-based authentication.

---

## Rate Limiting

No rate limiting is currently enforced. Future implementations will include rate limiting to prevent abuse.

---

## Endpoints

### System Health

#### GET /health

Returns the health status of the server.

**URL:** `/health`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T02:43:19.564Z",
  "uptime": 123.45,
  "service": "Baobab Bush Portal",
  "version": "2.0.0"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### Share Price

#### GET /api/share-price

Retrieves the current FAA share price with real-time fluctuations.

**URL:** `/api/share-price`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "success": true,
  "data": {
    "current": 4247.89,
    "change": 23.45,
    "percentChange": 0.55,
    "lastUpdate": "2026-01-11T02:43:19.564Z"
  }
}
```

**Response Fields:**
- `current` (number) - Current share price
- `change` (number) - Absolute change from previous value
- `percentChange` (number) - Percentage change
- `lastUpdate` (string) - ISO 8601 timestamp

**Status Codes:**
- `200 OK` - Request successful
- `500 Internal Server Error` - Server error

---

### Seedwave Data

#### GET /api/seedwave

Retrieves Seedwave brand growth metrics.

**URL:** `/api/seedwave`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "success": true,
  "data": {
    "treatedBrands": 7038,
    "activeBrands": 6891,
    "growth": 147,
    "lastUpdate": "2026-01-11T02:43:19.564Z"
  }
}
```

**Response Fields:**
- `treatedBrands` (number) - Total Treaty brands activated
- `activeBrands` (number) - Currently active brands
- `growth` (number) - Brand growth count
- `lastUpdate` (string) - ISO 8601 timestamp

**Status Codes:**
- `200 OK` - Request successful
- `500 Internal Server Error` - Server error

---

### Ecosystem Status

#### GET /api/ecosystem

Retrieves the overall ecosystem status and metrics.

**URL:** `/api/ecosystem`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "success": true,
  "data": {
    "repositories": 84,
    "activeWorkflows": 8,
    "pulseInterval": "9s",
    "status": "operational"
  }
}
```

**Response Fields:**
- `repositories` (number) - Number of ecosystem repositories
- `activeWorkflows` (number) - Active GitHub workflows
- `pulseInterval` (string) - Pulse heartbeat interval
- `status` (string) - System status (operational, degraded, down)

**Status Codes:**
- `200 OK` - Request successful
- `500 Internal Server Error` - Server error

---

### Pulse Data

#### GET /api/pulse

Retrieves real-time pulse and performance metrics.

**URL:** `/api/pulse`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-01-11T02:43:19.564Z",
    "pulse": "9s",
    "status": "active",
    "metrics": {
      "requestsPerSecond": 75,
      "activeConnections": 320,
      "uptime": 123.45
    }
  }
}
```

**Response Fields:**
- `timestamp` (string) - Current timestamp (ISO 8601)
- `pulse` (string) - Pulse interval
- `status` (string) - Pulse status (active, inactive)
- `metrics` (object) - Performance metrics
  - `requestsPerSecond` (number) - Current RPS
  - `activeConnections` (number) - Active connections
  - `uptime` (number) - Server uptime in seconds

**Status Codes:**
- `200 OK` - Request successful
- `500 Internal Server Error` - Server error

---

### Sectors

#### GET /api/sectors

Retrieves the list of available industry sectors.

**URL:** `/api/sectors`  
**Method:** `GET`  
**Auth Required:** No

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agriculture",
      "name": "Agriculture",
      "icon": "🌾",
      "active": true
    },
    {
      "id": "banking",
      "name": "Banking",
      "icon": "🏦",
      "active": true
    }
  ]
}
```

**Response Fields:**
- `data` (array) - Array of sector objects
  - `id` (string) - Unique sector identifier
  - `name` (string) - Display name
  - `icon` (string) - Emoji icon
  - `active` (boolean) - Sector status

**Status Codes:**
- `200 OK` - Request successful
- `500 Internal Server Error` - Server error

---

### Contact Form

#### POST /api/contact

Submits a contact form message.

**URL:** `/api/contact`  
**Method:** `POST`  
**Auth Required:** No  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in learning more about Fruitful."
}
```

**Required Fields:**
- `name` (string) - Sender's name
- `email` (string) - Valid email address
- `message` (string) - Message content

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you for your message. We will get back to you soon!"
}
```

**Error Response (400 - Missing Fields):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Error Response (400 - Invalid Email):**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Status Codes:**
- `200 OK` - Form submitted successfully
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

**Validation Rules:**
- Name: Required, non-empty string
- Email: Required, valid email format
- Message: Required, non-empty string

---

## Error Responses

All API endpoints use a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

In development mode, error responses include stack traces:

```json
{
  "error": "Internal Server Error",
  "stack": "Error: ... at ..."
}
```

---

## Response Format

All successful API responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Or for simple messages:

```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

---

## CORS Policy

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins:** Configurable via `ALLOWED_ORIGINS` environment variable
- **Default:** `*` (all origins in development)
- **Credentials:** Supported
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

---

## Examples

### JavaScript (Fetch API)

```javascript
// Get share price
fetch('http://localhost:3000/api/share-price')
  .then(response => response.json())
  .then(data => {
    console.log('Share Price:', data.data.current);
  })
  .catch(error => console.error('Error:', error));

// Submit contact form
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data.message);
  })
  .catch(error => console.error('Error:', error));
```

### cURL

```bash
# Get share price
curl http://localhost:3000/api/share-price

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Hello!"}'
```

### Python (requests)

```python
import requests

# Get share price
response = requests.get('http://localhost:3000/api/share-price')
data = response.json()
print(f"Share Price: {data['data']['current']}")

# Submit contact form
response = requests.post('http://localhost:3000/api/contact', json={
    'name': 'John Doe',
    'email': 'john@example.com',
    'message': 'Hello!'
})
print(response.json()['message'])
```

---

## Changelog

### Version 2.0.0 (2026-01-11)

**Added:**
- Initial API implementation
- Health check endpoint
- Share price endpoint
- Seedwave data endpoint
- Ecosystem status endpoint
- Pulse data endpoint
- Sectors endpoint
- Contact form endpoint

**Security:**
- Helmet.js integration
- CORS configuration
- Input validation
- Error handling

---

## Future API Features

### Planned Endpoints (v2.1.0)

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/user/profile` - User profile data
- `GET /api/analytics` - Analytics data
- `GET /api/notifications` - User notifications
- `POST /api/feedback` - User feedback submission

### Planned Features

- JWT authentication
- Rate limiting (100 requests/minute)
- WebSocket support for real-time updates
- GraphQL endpoint
- Pagination for large datasets
- Filtering and sorting parameters
- API versioning (v1, v2)

---

## Support

For API support, issues, or feature requests:

- **GitHub Issues:** https://github.com/heyns1000/fruitful/issues
- **Documentation:** https://github.com/heyns1000/fruitful/docs

---

**Last Updated:** January 11, 2026  
**API Version:** 2.0.0  
**Documentation Version:** 1.0.0
