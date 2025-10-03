# GitHub Zen - GitHub Integration Application

A full-stack web application that allows users to sign in with GitHub, view their repositories and pull requests, and comment on PRs. Built with React frontend and FastAPI backend.

## Features

- 🔐 GitHub OAuth Authentication
- 📚 Repository Management
- 🔄 Pull Request Tracking
- 💬 PR Commenting
- 📊 Dashboard with Statistics
- 🧪 90%+ Test Coverage
- 🚀 Docker Deployment Ready

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- TanStack Query for state management

### Backend
- FastAPI (Python)
- SQLAlchemy for database ORM
- PostgreSQL/SQLite database
- JWT authentication
- GitHub API integration
- Comprehensive test suite

## Project Structure

```
github-zen/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── data/           # Mock data and types
│   ├── package.json
│   └── Dockerfile
├── backend/                 # FastAPI backend application
│   ├── main.py             # FastAPI app entry point
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── services.py         # Business logic
│   ├── auth.py             # Authentication utilities
│   ├── github_client.py    # GitHub API client
│   ├── tests/              # Test suite
│   ├── requirements.txt
│   └── Dockerfile
└── deployment/             # Deployment configurations
    ├── docker-compose.yml  # Docker Compose setup
    ├── nginx.conf          # Nginx configuration
    └── env.example         # Environment variables template
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)
- GitHub OAuth App (see setup guide below)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd github-zen
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Environment Configuration

Copy environment files and configure:

```bash
# Backend
cp backend/env.example backend/.env

# Frontend (if needed)
cp frontend/.env.example frontend/.env

# Deployment
cp deployment/env.example deployment/.env
```

### 5. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: GitHub Zen
   - **Homepage URL**: `http://localhost:3000` (development)
   - **Authorization callback URL**: `http://localhost:8000/auth/callback`
4. Copy the Client ID and Client Secret to your `.env` files

### 6. Run the Application

#### Development Mode

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production Mode (Docker)

```bash
cd deployment
docker-compose up -d
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Backend Tests

```bash
cd backend
pytest --cov=. --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Docker Deployment

1. Configure environment variables in `deployment/.env`
2. Run the deployment:

```bash
cd deployment
docker-compose up -d
```

### Cloud Deployment Options

#### Heroku
1. Create Heroku apps for frontend and backend
2. Configure environment variables
3. Deploy using Heroku CLI or GitHub integration

#### AWS
1. Use AWS ECS with Fargate for containerized deployment
2. Use RDS for PostgreSQL database
3. Use CloudFront for CDN

#### DigitalOcean
1. Use App Platform for easy deployment
2. Use Managed PostgreSQL database

## Environment Variables

### Backend (.env)
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./github_zen.db
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

### Deployment (.env)
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback
REACT_APP_API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

