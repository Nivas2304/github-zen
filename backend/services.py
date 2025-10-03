from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from models import User, Repository, PullRequest, Comment
from schemas import (
    UserCreate, RepositoryCreate, PullRequestCreate, CommentCreate,
    GitHubRepository, GitHubPullRequest, GitHubComment
)
from github_client import GitHubClient


class UserService:
    @staticmethod
    def get_user_by_github_id(db: Session, github_id: int) -> Optional[User]:
        """Get user by GitHub ID"""
        return db.query(User).filter(User.github_id == github_id).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create new user"""
        db_user = User(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_user(db: Session, user: User, user_data: dict) -> User:
        """Update user information"""
        for field, value in user_data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    async def sync_user_from_github(db: Session, github_token: str) -> User:
        """Sync user data from GitHub"""
        github_client = GitHubClient(github_token)
        github_user = await github_client.get_user_info()
        
        # Check if user exists
        user = UserService.get_user_by_github_id(db, github_user["id"])
        
        user_data = {
            "github_id": github_user["id"],
            "username": github_user["login"],
            "email": github_user.get("email"),
            "name": github_user.get("name"),
            "avatar_url": github_user.get("avatar_url"),
            "bio": github_user.get("bio"),
            "public_repos": github_user.get("public_repos", 0),
            "followers": github_user.get("followers", 0),
            "following": github_user.get("following", 0),
            "github_access_token": github_token
        }
        
        if user:
            user = UserService.update_user(db, user, user_data)
        else:
            user = UserService.create_user(db, UserCreate(**user_data))
        
        return user


class RepositoryService:
    @staticmethod
    def get_repositories_by_user(db: Session, user_id: int) -> List[Repository]:
        """Get repositories for a user"""
        return db.query(Repository).filter(
            Repository.owner_username == db.query(User.username).filter(User.id == user_id).scalar_subquery()
        ).all()
    
    @staticmethod
    def get_repository_by_github_id(db: Session, github_id: int) -> Optional[Repository]:
        """Get repository by GitHub ID"""
        return db.query(Repository).filter(Repository.github_id == github_id).first()
    
    @staticmethod
    def create_repository(db: Session, repo_data: RepositoryCreate) -> Repository:
        """Create new repository"""
        db_repo = Repository(**repo_data.dict())
        db.add(db_repo)
        db.commit()
        db.refresh(db_repo)
        return db_repo
    
    @staticmethod
    def update_repository(db: Session, repo: Repository, repo_data: dict) -> Repository:
        """Update repository information"""
        for field, value in repo_data.items():
            if hasattr(repo, field):
                setattr(repo, field, value)
        
        db.commit()
        db.refresh(repo)
        return repo
    
    @staticmethod
    async def sync_user_repositories(db: Session, user: User) -> List[Repository]:
        """Sync user's repositories from GitHub"""
        github_client = GitHubClient(user.github_access_token)
        github_repos = await github_client.get_user_repositories()
        
        synced_repos = []
        
        for github_repo in github_repos:
            repo = RepositoryService.get_repository_by_github_id(db, github_repo.id)
            
            repo_data = {
                "github_id": github_repo.id,
                "name": github_repo.name,
                "full_name": github_repo.full_name,
                "description": github_repo.description,
                "html_url": github_repo.html_url,
                "language": github_repo.language,
                "stargazers_count": github_repo.stargazers_count,
                "forks_count": github_repo.forks_count,
                "private": github_repo.private,
                "owner_username": github_repo.owner["login"],
                "owner_avatar_url": github_repo.owner.get("avatar_url"),
                "updated_at": datetime.fromisoformat(github_repo.updated_at.replace('Z', '+00:00')) if github_repo.updated_at else None
            }
            
            if repo:
                repo = RepositoryService.update_repository(db, repo, repo_data)
            else:
                repo = RepositoryService.create_repository(db, RepositoryCreate(**repo_data))
            
            synced_repos.append(repo)
        
        return synced_repos


class PullRequestService:
    @staticmethod
    def get_pull_requests_by_user(db: Session, user_id: int, state: str = "open") -> List[PullRequest]:
        """Get pull requests for a user's repositories"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        return db.query(PullRequest).filter(
            and_(
                PullRequest.author_username == user.username,
                PullRequest.state == state
            )
        ).order_by(PullRequest.updated_at.desc()).all()
    
    @staticmethod
    def get_pull_request_by_github_id(db: Session, github_id: int) -> Optional[PullRequest]:
        """Get pull request by GitHub ID"""
        return db.query(PullRequest).filter(PullRequest.github_id == github_id).first()
    
    @staticmethod
    def create_pull_request(db: Session, pr_data: PullRequestCreate) -> PullRequest:
        """Create new pull request"""
        db_pr = PullRequest(**pr_data.dict())
        db.add(db_pr)
        db.commit()
        db.refresh(db_pr)
        return db_pr
    
    @staticmethod
    async def sync_user_pull_requests(db: Session, user: User) -> List[PullRequest]:
        """Sync user's pull requests from GitHub"""
        github_client = GitHubClient(user.github_access_token)
        github_prs = await github_client.get_user_pull_requests()
        
        synced_prs = []
        
        for github_pr in github_prs:
            pr = PullRequestService.get_pull_request_by_github_id(db, github_pr.id)
            
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
                "created_at": datetime.fromisoformat(github_pr.created_at.replace('Z', '+00:00')) if github_pr.created_at else None,
                "updated_at": datetime.fromisoformat(github_pr.updated_at.replace('Z', '+00:00')) if github_pr.updated_at else None
            }
            
            if pr:
                for field, value in pr_data.items():
                    if hasattr(pr, field):
                        setattr(pr, field, value)
                pr.synced_at = datetime.utcnow()
                db.commit()
                db.refresh(pr)
            else:
                pr = PullRequestService.create_pull_request(db, PullRequestCreate(**pr_data))
            
            synced_prs.append(pr)
        
        return synced_prs


class CommentService:
    @staticmethod
    def get_comments_by_pull_request(db: Session, pr_github_id: int) -> List[Comment]:
        """Get comments for a pull request"""
        return db.query(Comment).filter(
            Comment.pull_request_id == pr_github_id
        ).order_by(Comment.created_at.desc()).all()
    
    @staticmethod
    def create_comment(db: Session, comment_data: CommentCreate) -> Comment:
        """Create new comment"""
        db_comment = Comment(**comment_data.dict())
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    
    @staticmethod
    async def sync_pull_request_comments(
        db: Session, 
        user: User, 
        repo_full_name: str, 
        pr_number: int
    ) -> List[Comment]:
        """Sync comments for a pull request"""
        github_client = GitHubClient(user.github_access_token)
        github_comments = await github_client.get_pull_request_comments(repo_full_name, pr_number)
        
        synced_comments = []
        
        for github_comment in github_comments:
            # Check if comment already exists
            existing_comment = db.query(Comment).filter(
                Comment.github_id == github_comment.id
            ).first()
            
            comment_data = {
                "github_id": github_comment.id,
                "pull_request_id": pr_number,  # Using PR number as identifier
                "body": github_comment.body,
                "author_username": github_comment.user["login"],
                "author_avatar_url": github_comment.user.get("avatar_url"),
                "html_url": github_comment.html_url,
                "created_at": datetime.fromisoformat(github_comment.created_at.replace('Z', '+00:00')) if github_comment.created_at else None,
                "updated_at": datetime.fromisoformat(github_comment.updated_at.replace('Z', '+00:00')) if github_comment.updated_at else None
            }
            
            if existing_comment:
                for field, value in comment_data.items():
                    if hasattr(existing_comment, field):
                        setattr(existing_comment, field, value)
                existing_comment.synced_at = datetime.utcnow()
                db.commit()
                db.refresh(existing_comment)
                synced_comments.append(existing_comment)
            else:
                new_comment = CommentService.create_comment(db, CommentCreate(**comment_data))
                synced_comments.append(new_comment)
        
        return synced_comments

