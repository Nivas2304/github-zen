const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com'  // Update with your Render URL
  : 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/';
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Authentication
  async getGitHubAuthUrl(state?: string): Promise<ApiResponse<{ authorization_url: string }>> {
    const url = state ? `/auth/github/url?state=${encodeURIComponent(state)}` : '/auth/github/url';
    return this.request(url);
  }

  async githubAuth(code: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> {
    const response = await this.request('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    if (response.data) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  // User
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/user/me');
  }

  async syncUserData(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/user/sync', { method: 'POST' });
  }

  // Repositories
  async getRepositories(): Promise<ApiResponse<any[]>> {
    return this.request('/repositories');
  }

  async syncRepositories(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/repositories/sync', { method: 'POST' });
  }

  // Pull Requests
  async getPullRequests(state: string = 'open'): Promise<ApiResponse<any[]>> {
    return this.request(`/pull-requests?state=${state}`);
  }

  async syncPullRequests(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/pull-requests/sync', { method: 'POST' });
  }

  async getRepositoryPullRequests(repoName: string, state: string = 'open'): Promise<ApiResponse<any[]>> {
    return this.request(`/repositories/${repoName}/pull-requests?state=${state}`);
  }

  // Comments
  async getPullRequestComments(repoName: string, prNumber: number): Promise<ApiResponse<any[]>> {
    return this.request(`/pull-requests/${prNumber}/comments?repo_name=${repoName}`);
  }

  async createPullRequestComment(
    repoName: string,
    prNumber: number,
    body: string
  ): Promise<ApiResponse<any>> {
    return this.request(`/pull-requests/${prNumber}/comments?repo_name=${repoName}`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  // Repository file operations
  getRepositoryContents(repoName: string, path: string = ''): Promise<ApiResponse<any[]>> {
    return this.request(`/repositories/${repoName}/contents?path=${encodeURIComponent(path)}`);
  }

  getFileContent(repoName: string, path: string): Promise<ApiResponse<{ content: string; path: string }>> {
    return this.request(`/repositories/${repoName}/file?path=${encodeURIComponent(path)}`);
  }

  searchRepositoryFiles(repoName: string, query: string): Promise<ApiResponse<any[]>> {
    return this.request(`/repositories/${repoName}/search?query=${encodeURIComponent(query)}`);
  }

}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;

