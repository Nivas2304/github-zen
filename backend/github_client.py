import httpx
from typing import List, Optional, Dict, Any
from config import settings
from schemas import GitHubRepository, GitHubPullRequest, GitHubComment


class GitHubClient:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Zen-App"
        }
    
    async def get_user_info(self) -> Dict[str, Any]:
        """Get authenticated user information"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/user",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def get_user_repositories(
        self, 
        page: int = 1, 
        per_page: int = 100,
        sort: str = "updated"
    ) -> List[GitHubRepository]:
        """Get user's repositories"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/user/repos",
                headers=self.headers,
                params={
                    "page": page,
                    "per_page": per_page,
                    "sort": sort,
                    "direction": "desc"
                }
            )
            response.raise_for_status()
            repos_data = response.json()
            return [GitHubRepository(**repo) for repo in repos_data]
    
    async def get_pull_requests(
        self, 
        repo_full_name: str,
        state: str = "open",
        page: int = 1,
        per_page: int = 100
    ) -> List[GitHubPullRequest]:
        """Get pull requests for a repository"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{repo_full_name}/pulls",
                headers=self.headers,
                params={
                    "state": state,
                    "page": page,
                    "per_page": per_page,
                    "sort": "updated",
                    "direction": "desc"
                }
            )
            response.raise_for_status()
            prs_data = response.json()
            return [GitHubPullRequest(**pr) for pr in prs_data]
    
    async def get_user_pull_requests(
        self,
        state: str = "open",
        page: int = 1,
        per_page: int = 100
    ) -> List[GitHubPullRequest]:
        """Get all pull requests across user's repositories"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search/issues",
                headers=self.headers,
                params={
                    "q": f"is:pr is:{state} author:@me",
                    "page": page,
                    "per_page": per_page,
                    "sort": "updated",
                    "order": "desc"
                }
            )
            response.raise_for_status()
            search_data = response.json()
            prs = []
            
            for issue in search_data.get("items", []):
                # Get full PR details
                pr_url = issue["pull_request"]["url"]
                pr_response = await client.get(pr_url, headers=self.headers)
                pr_response.raise_for_status()
                pr_data = pr_response.json()
                prs.append(GitHubPullRequest(**pr_data))
            
            return prs
    
    async def get_pull_request_comments(
        self,
        repo_full_name: str,
        pr_number: int
    ) -> List[GitHubComment]:
        """Get comments for a specific pull request"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{repo_full_name}/issues/{pr_number}/comments",
                headers=self.headers,
                params={"sort": "created", "direction": "desc"}
            )
            response.raise_for_status()
            comments_data = response.json()
            return [GitHubComment(**comment) for comment in comments_data]
    
    async def create_pull_request_comment(
        self,
        repo_full_name: str,
        pr_number: int,
        body: str
    ) -> GitHubComment:
        """Create a comment on a pull request"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/repos/{repo_full_name}/issues/{pr_number}/comments",
                headers=self.headers,
                json={"body": body}
            )
            response.raise_for_status()
            comment_data = response.json()
            return GitHubComment(**comment_data)
    
    async def get_repository(self, repo_full_name: str) -> GitHubRepository:
        """Get a specific repository"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{repo_full_name}",
                headers=self.headers
            )
            response.raise_for_status()
            repo_data = response.json()
            return GitHubRepository(**repo_data)
    
    async def get_repository_contents(self, repo_full_name: str, path: str = "") -> List[Dict[str, Any]]:
        """Get repository contents at a specific path"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{repo_full_name}/contents/{path}" if path else f"{self.base_url}/repos/{repo_full_name}/contents"
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
    
    
    async def get_file_content(self, repo_full_name: str, path: str) -> str:
        """Get the content of a specific file"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/repos/{repo_full_name}/contents/{path}",
                headers=self.headers
            )
            response.raise_for_status()
            file_data = response.json()
            
            if file_data.get("encoding") == "base64":
                import base64
                return base64.b64decode(file_data["content"]).decode("utf-8")
            return file_data["content"]
    
    async def search_repository_files(self, repo_full_name: str, query: str) -> List[Dict[str, Any]]:
        """Search for files in a repository"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search/code",
                headers=self.headers,
                params={
                    "q": f"{query} repo:{repo_full_name}",
                    "per_page": 100
                }
            )
            response.raise_for_status()
            return response.json().get("items", [])


class GitHubOAuth:
    @staticmethod
    async def exchange_code_for_token(code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code
                },
                headers={"Accept": "application/json"}
            )
            response.raise_for_status()
            return response.json()
    
    @staticmethod
    def get_authorization_url(state: Optional[str] = None) -> str:
        """Get GitHub OAuth authorization URL"""
        params = {
            "client_id": settings.github_client_id,
            "redirect_uri": settings.github_redirect_uri,
            "scope": "repo,user:email"
        }
        
        if state:
            params["state"] = state
            
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"https://github.com/login/oauth/authorize?{query_string}"

