from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    avatar_url = Column(String(500))
    bio = Column(Text)
    public_repos = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    github_access_token = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Repository(Base):
    __tablename__ = "repositories"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    description = Column(Text)
    html_url = Column(String(500))
    language = Column(String(100))
    stargazers_count = Column(Integer, default=0)
    forks_count = Column(Integer, default=0)
    private = Column(Boolean, default=False)
    owner_username = Column(String(255), nullable=False)
    owner_avatar_url = Column(String(500))
    updated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PullRequest(Base):
    __tablename__ = "pull_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    number = Column(Integer, nullable=False)
    title = Column(String(500), nullable=False)
    body = Column(Text)
    state = Column(String(50), nullable=False)  # open, closed, merged
    html_url = Column(String(500))
    repo_name = Column(String(255), nullable=False)
    repo_full_name = Column(String(255), nullable=False)
    author_username = Column(String(255), nullable=False)
    author_avatar_url = Column(String(500))
    head_ref = Column(String(255))
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))
    synced_at = Column(DateTime(timezone=True), server_default=func.now())


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    pull_request_id = Column(Integer, nullable=False)
    body = Column(Text, nullable=False)
    author_username = Column(String(255), nullable=False)
    author_avatar_url = Column(String(500))
    html_url = Column(String(500))
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))
    synced_at = Column(DateTime(timezone=True), server_default=func.now())

