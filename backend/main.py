from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from database import get_db, create_tables
from config import settings
from models import User
from schemas import (
    Token, GitHubOAuthRequest, CommentCreateRequest,
    UserResponse, RepositoryResponse, PullRequestResponse, CommentResponse
)
from auth import create_access_token, get_current_user
from github_client import GitHubOAuth, GitHubClient
from services import UserService, RepositoryService, PullRequestService, CommentService

# Create FastAPI app
app = FastAPI(
    title="GitHub Zen API",
    description="A GitHub integration API for viewing repositories and pull requests",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://localhost:3002", 
        "http://localhost:3000",
        "http://localhost:8081",
        settings.frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "GitHub Zen API is running!"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Authentication endpoints
@app.post("/auth/github", response_model=Token)
async def github_oauth(request: GitHubOAuthRequest, db: Session = Depends(get_db)):
    """Exchange GitHub OAuth code for access token"""
    try:
        # Exchange code for GitHub access token
        token_response = await GitHubOAuth.exchange_code_for_token(request.code)
        
        if "error" in token_response:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub OAuth error: {token_response['error']}"
            )
        
        github_token = token_response["access_token"]
        
        # Sync user from GitHub
        user = await UserService.sync_user_from_github(db, github_token)
        
        # Automatically sync repositories and pull requests
        try:
            await RepositoryService.sync_user_repositories(db, user)
            await PullRequestService.sync_user_pull_requests(db, user)
        except Exception as sync_error:
            # Log sync error but don't fail the login
            print(f"Auto-sync warning: {sync_error}")
        
        # Create JWT token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@app.get("/auth/github/url")
async def get_github_oauth_url(state: str = None):
    """Get GitHub OAuth authorization URL"""
    auth_url = GitHubOAuth.get_authorization_url(state)
    return {"authorization_url": auth_url}


# User endpoints
@app.get("/user/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@app.post("/user/sync")
async def sync_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync user data from GitHub"""
    try:
        # Sync user info
        user = await UserService.sync_user_from_github(db, current_user.github_access_token)
        
        # Sync repositories
        await RepositoryService.sync_user_repositories(db, user)
        
        return {"message": "User data synced successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sync failed: {str(e)}"
        )


@app.post("/repositories/sync")
async def sync_repositories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync repositories from GitHub"""
    try:
        synced_repos = await RepositoryService.sync_user_repositories(db, current_user)
        return {"message": f"Synced {len(synced_repos)} repositories"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Repository sync failed: {str(e)}"
        )


@app.post("/pull-requests/sync")
async def sync_pull_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync pull requests from GitHub"""
    try:
        synced_prs = await PullRequestService.sync_user_pull_requests(db, current_user)
        return {"message": f"Synced {len(synced_prs)} pull requests"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pull request sync failed: {str(e)}"
        )


# Repository endpoints
@app.get("/repositories", response_model=List[RepositoryResponse])
async def get_user_repositories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's repositories"""
    repositories = RepositoryService.get_repositories_by_user(db, current_user.id)
    return repositories




# Pull Request endpoints
@app.get("/pull-requests", response_model=List[PullRequestResponse])
async def get_user_pull_requests(
    state: str = "open",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's pull requests"""
    pull_requests = PullRequestService.get_pull_requests_by_user(db, current_user.id, state)
    return pull_requests




@app.get("/repositories/{repo_name}/pull-requests", response_model=List[PullRequestResponse])
async def get_repository_pull_requests(
    repo_name: str,
    state: str = "open",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pull requests for a specific repository"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        github_prs = await github_client.get_pull_requests(f"{current_user.username}/{repo_name}", state)
        
        # Convert to response format
        pull_requests = []
        for github_pr in github_prs:
            pr_data = {
                "github_id": github_pr.id,
                "number": github_pr.number,
                "title": github_pr.title,
                "body": github_pr.body,
                "state": github_pr.state,
                "html_url": github_pr.html_url,
                "repo_name": github_pr.base["repo"]["name"],
                "repo_full_name": github_pr.base["repo"]["full_name"],
                "author_username": github_pr.user["login"],
                "author_avatar_url": github_pr.user.get("avatar_url"),
                "head_ref": github_pr.head["ref"],
                "created_at": github_pr.created_at,
                "updated_at": github_pr.updated_at
            }
            pull_requests.append(PullRequestResponse(**pr_data, id=github_pr.id, synced_at="2024-01-01T00:00:00Z"))
        
        return pull_requests
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch repository pull requests: {str(e)}"
        )


# Comment endpoints
@app.get("/pull-requests/{pr_number}/comments", response_model=List[CommentResponse])
async def get_pull_request_comments(
    pr_number: int,
    repo_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comments for a pull request"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        github_comments = await github_client.get_pull_request_comments(
            f"{current_user.username}/{repo_name}", 
            pr_number
        )
        
        # Convert to response format
        comments = []
        for github_comment in github_comments:
            comment_data = {
                "github_id": github_comment.id,
                "pull_request_id": pr_number,
                "body": github_comment.body,
                "author_username": github_comment.user["login"],
                "author_avatar_url": github_comment.user.get("avatar_url"),
                "html_url": github_comment.html_url,
                "created_at": github_comment.created_at,
                "updated_at": github_comment.updated_at
            }
            comments.append(CommentResponse(**comment_data, id=github_comment.id, synced_at="2024-01-01T00:00:00Z"))
        
        return comments
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch comments: {str(e)}"
        )


@app.post("/pull-requests/{pr_number}/comments")
async def create_pull_request_comment(
    pr_number: int,
    repo_name: str,
    comment_request: CommentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a pull request"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        github_comment = await github_client.create_pull_request_comment(
            f"{current_user.username}/{repo_name}",
            pr_number,
            comment_request.body
        )
        
        return {
            "message": "Comment created successfully",
            "comment": {
                "id": github_comment.id,
                "body": github_comment.body,
                "author_username": github_comment.user["login"],
                "created_at": github_comment.created_at,
                "html_url": github_comment.html_url
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create comment: {str(e)}"
        )


# Repository file endpoints
@app.get("/repositories/{repo_name}/contents")
async def get_repository_contents(
    repo_name: str,
    path: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get repository contents at a specific path"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        repo_full_name = f"{current_user.username}/{repo_name}"
        contents = await github_client.get_repository_contents(repo_full_name, path)
        return contents
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch repository contents: {str(e)}"
        )


@app.get("/repositories/{repo_name}/file")
async def get_file_content(
    repo_name: str,
    path: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the content of a specific file"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        repo_full_name = f"{current_user.username}/{repo_name}"
        content = await github_client.get_file_content(repo_full_name, path)
        return {"content": content, "path": path}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch file content: {str(e)}"
        )


@app.get("/repositories/{repo_name}/search")
async def search_repository_files(
    repo_name: str,
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search for files in a repository"""
    try:
        github_client = GitHubClient(current_user.github_access_token)
        repo_full_name = f"{current_user.username}/{repo_name}"
        results = await github_client.search_repository_files(repo_full_name, query)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search repository files: {str(e)}"
        )




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

