export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  base: {
    repo: {
      name: string;
      full_name: string;
    };
  };
  head: {
    ref: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const mockUser: User = {
  login: "alexdeveloper",
  id: 12345,
  avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4",
  name: "Alex Developer",
  bio: "Full-stack developer passionate about open source",
  public_repos: 42,
  followers: 156,
  following: 89,
};

export const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "awesome-react-components",
    full_name: "alexdeveloper/awesome-react-components",
    description: "A curated list of awesome React components and libraries for building modern UIs",
    html_url: "https://github.com/alexdeveloper/awesome-react-components",
    language: "TypeScript",
    stargazers_count: 1248,
    forks_count: 89,
    updated_at: "2024-01-15T10:30:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 2,
    name: "api-gateway-service",
    full_name: "alexdeveloper/api-gateway-service",
    description: "Microservices API Gateway built with Node.js and Express for scalable applications",
    html_url: "https://github.com/alexdeveloper/api-gateway-service",
    language: "JavaScript",
    stargazers_count: 567,
    forks_count: 34,
    updated_at: "2024-01-12T14:22:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 3,
    name: "machine-learning-toolkit",
    full_name: "alexdeveloper/machine-learning-toolkit",
    description: "Complete ML toolkit with preprocessing, model training, and evaluation utilities",
    html_url: "https://github.com/alexdeveloper/machine-learning-toolkit",
    language: "Python",
    stargazers_count: 892,
    forks_count: 167,
    updated_at: "2024-01-10T09:15:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 4,
    name: "mobile-app-template",
    full_name: "alexdeveloper/mobile-app-template",
    description: "React Native template with navigation, authentication, and state management setup",
    html_url: "https://github.com/alexdeveloper/mobile-app-template",
    language: "JavaScript",
    stargazers_count: 445,
    forks_count: 78,
    updated_at: "2024-01-08T16:45:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 5,
    name: "blockchain-explorer",
    full_name: "alexdeveloper/blockchain-explorer",
    description: "Web3 blockchain explorer with real-time transaction monitoring and analytics",
    html_url: "https://github.com/alexdeveloper/blockchain-explorer",
    language: "Solidity",
    stargazers_count: 723,
    forks_count: 92,
    updated_at: "2024-01-05T11:20:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 6,
    name: "design-system-ui",
    full_name: "alexdeveloper/design-system-ui",
    description: "Modern design system with reusable components, tokens, and comprehensive documentation",
    html_url: "https://github.com/alexdeveloper/design-system-ui",
    language: "TypeScript",
    stargazers_count: 334,
    forks_count: 45,
    updated_at: "2024-01-03T13:10:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 7,
    name: "devops-automation",
    full_name: "alexdeveloper/devops-automation",
    description: "CI/CD pipelines and infrastructure automation scripts for modern deployment workflows",
    html_url: "https://github.com/alexdeveloper/devops-automation",
    language: "Shell",
    stargazers_count: 198,
    forks_count: 23,
    updated_at: "2024-01-01T08:30:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: 8,
    name: "data-visualization-dashboard",
    full_name: "alexdeveloper/data-visualization-dashboard",
    description: "Interactive dashboard for real-time data visualization with charts, graphs, and metrics",
    html_url: "https://github.com/alexdeveloper/data-visualization-dashboard",
    language: "Vue",
    stargazers_count: 612,
    forks_count: 87,
    updated_at: "2023-12-28T15:45:00Z",
    private: false,
    owner: {
      login: "alexdeveloper",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  }
];

export const mockPullRequests: PullRequest[] = [
  {
    id: 101,
    number: 45,
    title: "Add support for TypeScript strict mode configuration",
    body: "This PR enables strict TypeScript configuration to improve type safety and catch potential runtime errors during compilation.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/awesome-react-components/pull/45",
    created_at: "2024-01-14T10:30:00Z",
    updated_at: "2024-01-15T09:20:00Z",
    user: {
      login: "sarah-dev",
      avatar_url: "https://avatars.githubusercontent.com/u/67890?v=4"
    },
    base: {
      repo: {
        name: "awesome-react-components",
        full_name: "alexdeveloper/awesome-react-components"
      }
    },
    head: { ref: "feature/typescript-strict-mode" },
    labels: [
      { name: "enhancement", color: "a2eeef" },
      { name: "typescript", color: "0052cc" }
    ]
  },
  {
    id: 102,
    number: 23,
    title: "Implement rate limiting middleware for API endpoints",
    body: "Added configurable rate limiting to prevent API abuse and ensure fair usage across all clients.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/api-gateway-service/pull/23",
    created_at: "2024-01-13T14:15:00Z",
    updated_at: "2024-01-14T16:30:00Z",
    user: {
      login: "mike-backend",
      avatar_url: "https://avatars.githubusercontent.com/u/54321?v=4"
    },
    base: {
      repo: {
        name: "api-gateway-service",
        full_name: "alexdeveloper/api-gateway-service"
      }
    },
    head: { ref: "feature/rate-limiting" },
    labels: [
      { name: "security", color: "d93f0b" },
      { name: "api", color: "0052cc" }
    ]
  },
  {
    id: 103,
    number: 67,
    title: "Optimize neural network training performance",
    body: "Implemented vectorized operations and GPU acceleration to reduce training time by 40%.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/machine-learning-toolkit/pull/67",
    created_at: "2024-01-12T11:45:00Z",
    updated_at: "2024-01-13T08:20:00Z",
    user: {
      login: "ml-researcher",
      avatar_url: "https://avatars.githubusercontent.com/u/98765?v=4"
    },
    base: {
      repo: {
        name: "machine-learning-toolkit",
        full_name: "alexdeveloper/machine-learning-toolkit"
      }
    },
    head: { ref: "optimize/neural-network-performance" },
    labels: [
      { name: "performance", color: "fbca04" },
      { name: "ml", color: "0e8a16" }
    ]
  },
  {
    id: 104,
    number: 34,
    title: "Add dark theme support to navigation components",
    body: "Implemented system-aware dark theme with smooth transitions and proper contrast ratios.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/mobile-app-template/pull/34",
    created_at: "2024-01-11T16:20:00Z",
    updated_at: "2024-01-12T10:15:00Z",
    user: {
      login: "ui-designer",
      avatar_url: "https://avatars.githubusercontent.com/u/11111?v=4"
    },
    base: {
      repo: {
        name: "mobile-app-template",
        full_name: "alexdeveloper/mobile-app-template"
      }
    },
    head: { ref: "feature/dark-theme-navigation" },
    labels: [
      { name: "ui/ux", color: "e99695" },
      { name: "theme", color: "5319e7" }
    ]
  },
  {
    id: 105,
    number: 12,
    title: "Integrate Web3 wallet connection with MetaMask",
    body: "Added seamless MetaMask integration with connection state management and error handling.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/blockchain-explorer/pull/12",
    created_at: "2024-01-10T13:30:00Z",
    updated_at: "2024-01-11T15:45:00Z",
    user: {
      login: "web3-dev",
      avatar_url: "https://avatars.githubusercontent.com/u/22222?v=4"
    },
    base: {
      repo: {
        name: "blockchain-explorer",
        full_name: "alexdeveloper/blockchain-explorer"
      }
    },
    head: { ref: "feature/metamask-integration" },
    labels: [
      { name: "web3", color: "f9d0c4" },
      { name: "wallet", color: "d4c5f9" }
    ]
  },
  {
    id: 106,
    number: 89,
    title: "Update component documentation with new props",
    body: "Added comprehensive documentation for all new component properties and usage examples.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/design-system-ui/pull/89",
    created_at: "2024-01-09T09:10:00Z",
    updated_at: "2024-01-10T14:25:00Z",
    user: {
      login: "docs-writer",
      avatar_url: "https://avatars.githubusercontent.com/u/33333?v=4"
    },
    base: {
      repo: {
        name: "design-system-ui",
        full_name: "alexdeveloper/design-system-ui"
      }
    },
    head: { ref: "docs/component-props-update" },
    labels: [
      { name: "documentation", color: "0075ca" },
      { name: "components", color: "cfd3d7" }
    ]
  },
  {
    id: 107,
    number: 56,
    title: "Add Docker containerization for development environment",
    body: "Created Docker setup with hot-reload support and environment-specific configurations.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/devops-automation/pull/56",
    created_at: "2024-01-08T12:00:00Z",
    updated_at: "2024-01-09T17:30:00Z",
    user: {
      login: "devops-engineer",
      avatar_url: "https://avatars.githubusercontent.com/u/44444?v=4"
    },
    base: {
      repo: {
        name: "devops-automation",
        full_name: "alexdeveloper/devops-automation"
      }
    },
    head: { ref: "feature/docker-development" },
    labels: [
      { name: "docker", color: "006b75" },
      { name: "devops", color: "1d76db" }
    ]
  },
  {
    id: 108,
    number: 78,
    title: "Implement real-time WebSocket data streaming",
    body: "Added WebSocket support for live data updates with connection recovery and message queuing.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/data-visualization-dashboard/pull/78",
    created_at: "2024-01-07T15:45:00Z",
    updated_at: "2024-01-08T11:20:00Z",
    user: {
      login: "fullstack-dev",
      avatar_url: "https://avatars.githubusercontent.com/u/55555?v=4"
    },
    base: {
      repo: {
        name: "data-visualization-dashboard",
        full_name: "alexdeveloper/data-visualization-dashboard"
      }
    },
    head: { ref: "feature/websocket-streaming" },
    labels: [
      { name: "websocket", color: "c5def5" },
      { name: "realtime", color: "b60205" }
    ]
  },
  {
    id: 109,
    number: 91,
    title: "Fix memory leak in component lifecycle hooks",
    body: "Resolved memory leak caused by event listeners not being properly cleaned up in useEffect.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/awesome-react-components/pull/91",
    created_at: "2024-01-06T08:30:00Z",
    updated_at: "2024-01-07T12:15:00Z",
    user: {
      login: "performance-expert",
      avatar_url: "https://avatars.githubusercontent.com/u/66666?v=4"
    },
    base: {
      repo: {
        name: "awesome-react-components",
        full_name: "alexdeveloper/awesome-react-components"
      }
    },
    head: { ref: "fix/memory-leak-cleanup" },
    labels: [
      { name: "bug", color: "d73a4a" },
      { name: "performance", color: "fbca04" }
    ]
  },
  {
    id: 110,
    number: 15,
    title: "Add comprehensive unit tests for authentication service",
    body: "Implemented full test coverage for authentication flows including edge cases and error scenarios.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/api-gateway-service/pull/15",
    created_at: "2024-01-05T14:20:00Z",
    updated_at: "2024-01-06T16:40:00Z",
    user: {
      login: "test-engineer",
      avatar_url: "https://avatars.githubusercontent.com/u/77777?v=4"
    },
    base: {
      repo: {
        name: "api-gateway-service",
        full_name: "alexdeveloper/api-gateway-service"
      }
    },
    head: { ref: "test/auth-service-coverage" },
    labels: [
      { name: "testing", color: "0e8a16" },
      { name: "authentication", color: "5319e7" }
    ]
  },
  {
    id: 111,
    number: 43,
    title: "Implement automated model validation pipeline",
    body: "Added automated validation pipeline with cross-validation and performance metrics tracking.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/machine-learning-toolkit/pull/43",
    created_at: "2024-01-04T10:15:00Z",
    updated_at: "2024-01-05T09:30:00Z",
    user: {
      login: "data-scientist",
      avatar_url: "https://avatars.githubusercontent.com/u/88888?v=4"
    },
    base: {
      repo: {
        name: "machine-learning-toolkit",
        full_name: "alexdeveloper/machine-learning-toolkit"
      }
    },
    head: { ref: "feature/automated-validation" },
    labels: [
      { name: "automation", color: "1d76db" },
      { name: "validation", color: "0052cc" }
    ]
  },
  {
    id: 112,
    number: 27,
    title: "Optimize bundle size with code splitting",
    body: "Implemented dynamic imports and route-based code splitting to reduce initial bundle size by 35%.",
    state: "open",
    html_url: "https://github.com/alexdeveloper/mobile-app-template/pull/27",
    created_at: "2024-01-03T16:45:00Z",
    updated_at: "2024-01-04T13:20:00Z",
    user: {
      login: "performance-dev",
      avatar_url: "https://avatars.githubusercontent.com/u/99999?v=4"
    },
    base: {
      repo: {
        name: "mobile-app-template",
        full_name: "alexdeveloper/mobile-app-template"
      }
    },
    head: { ref: "optimize/code-splitting" },
    labels: [
      { name: "optimization", color: "fbca04" },
      { name: "bundling", color: "c5def5" }
    ]
  }
];

// Get pull requests for a specific repository
export const getPullRequestsByRepo = (repoName: string) => {
  return mockPullRequests.filter(pr => 
    pr.base.repo.name === repoName || pr.base.repo.full_name.includes(repoName)
  );
};

// Get unique repository names from pull requests
export const getUniqueRepoNames = () => {
  const repoNames = mockPullRequests.map(pr => pr.base.repo.name);
  return [...new Set(repoNames)];
};