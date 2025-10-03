from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    github_id: int
    username: str
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    public_repos: int = 0
    followers: int = 0
    following: int = 0


class UserCreate(UserBase):
    github_access_token: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RepositoryBase(BaseModel):
    github_id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: Optional[str] = None
    language: Optional[str] = None
    stargazers_count: int = 0
    forks_count: int = 0
    private: bool = False
    owner_username: str
    owner_avatar_url: Optional[str] = None
    updated_at: Optional[datetime] = None


class RepositoryCreate(RepositoryBase):
    pass


class RepositoryResponse(RepositoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PullRequestBase(BaseModel):
    github_id: int
    number: int
    title: str
    body: Optional[str] = None
    state: str
    html_url: Optional[str] = None
    repo_name: str
    repo_full_name: str
    author_username: str
    author_avatar_url: Optional[str] = None
    head_ref: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class PullRequestCreate(PullRequestBase):
    pass


class PullRequestResponse(PullRequestBase):
    id: int
    synced_at: datetime
    
    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    github_id: int
    pull_request_id: int
    body: str
    author_username: str
    author_avatar_url: Optional[str] = None
    html_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: int
    synced_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class GitHubOAuthRequest(BaseModel):
    code: str
    state: Optional[str] = None


class GitHubRepository(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    language: Optional[str] = None
    stargazers_count: int
    forks_count: int
    private: bool
    updated_at: str
    owner: dict


class GitHubPullRequest(BaseModel):
    id: int
    number: int
    title: str
    body: Optional[str] = None
    state: str
    html_url: str
    created_at: str
    updated_at: str
    user: dict
    base: dict
    head: dict
    labels: List[dict] = []


class GitHubComment(BaseModel):
    id: int
    body: str
    html_url: str
    created_at: str
    updated_at: str
    user: dict


class CommentCreateRequest(BaseModel):
    body: str

