# Buddy Borrowers

Buddy Borrowers is a campus resource-sharing platform that enables students to lend physical items and offer skills to other students without relying on informal messaging groups.

The platform manages the complete borrowing lifecycle, from creating a listing to requesting, accepting, chatting, and returning the resource.

## Features

### Authentication
- Secure registration using Email OTP verification
- JWT-based authentication
- Protected API endpoints

### Resource Management
- Create, edit and delete resources
- List physical objects or skills
- View personal listings

### Borrowing Workflow
1. Student browses available resources.
2. Sends a request with an offer.
3. Owner accepts or rejects the request.
4. Once accepted, a private chat becomes available.
5. After the resource is returned, the owner marks it as returned.
6. The resource becomes available again.

### Tech Stack

Frontend
- React
- Vite
- Axios
- Lucide React

Backend
- FastAPI
- PostgreSQL
- JWT Authentication
- Email OTP
- REST APIs

Database
- PostgreSQL (Neon)

Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon
