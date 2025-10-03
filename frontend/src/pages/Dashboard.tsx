import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderGit2, GitPullRequest, Star, Users, Activity, TrendingUp, RefreshCw, GitFork } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRepositories } from '@/hooks/useRepositories';
import { usePullRequests } from '@/hooks/usePullRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const { user, syncUserData } = useAuth();
  const { toast } = useToast();
  
  const { repositories, isLoading: reposLoading } = useRepositories();
  const { pullRequests, isLoading: prsLoading } = usePullRequests('open');
  
  const isLoading = reposLoading || prsLoading;
  
  const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
  const openPRs = pullRequests.filter(pr => pr.state === 'open').length;

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamic subtitle based on user activity
  const getSubtitle = () => {
    if (repositories.length === 0) return "Let's get started with your first repository!";
    if (openPRs > 0) return `You have ${openPRs} open pull request${openPRs > 1 ? 's' : ''} to review`;
    if (totalStars > 100) return "Your repositories are getting popular! 🌟";
    return "Here's what's happening with your repositories";
  };

  const stats = [
    {
      title: 'Total Repositories',
      value: repositories.length.toString(),
      icon: FolderGit2,
      description: 'Public repositories',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Open Pull Requests',
      value: openPRs.toString(),
      icon: GitPullRequest,
      description: 'Awaiting review',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Stars',
      value: totalStars.toLocaleString(),
      icon: Star,
      description: 'Across all repositories',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Forks',
      value: totalForks.toString(),
      icon: TrendingUp,
      description: 'Community contributions',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const recentRepositories = repositories
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
    .slice(0, 4);

  const recentPullRequests = pullRequests
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
    .slice(0, 4);


  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Welcome Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-12 w-12 bg-muted/50 rounded-full animate-pulse"></div>
          <div>
            <div className="h-8 w-64 bg-muted/50 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-muted/50 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-32 bg-muted/20 rounded-lg animate-pulse"></div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="h-[500px] bg-muted/20 rounded-lg animate-pulse"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">{getSubtitle()}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-card transition-smooth gradient-card backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Repositories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="h-[500px]"
        >
          <Card className="gradient-card backdrop-blur-sm border-border/50 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5" />
                  Recent Repositories
                  <span className="text-sm text-muted-foreground font-normal">
                    ({recentRepositories.length} of {repositories.length})
                  </span>
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/repositories">View all ({repositories.length})</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {recentRepositories.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FolderGit2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="font-medium mb-1">
                        {repositories.length === 0 ? "No repositories yet" : "No recent activity"}
                      </p>
                      <p className="text-sm">
                        {repositories.length === 0 
                          ? "Create your first repository on GitHub to get started!" 
                          : "Your repositories haven't been updated recently"}
                      </p>
                    </div>
                  </div>
                ) : (
                  recentRepositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{repo.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {repo.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          {repo.language && (
                            <span className="text-xs text-foreground bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
                              💻 {repo.language}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            ⭐ {repo.stargazers_count || 0}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            🍴 {repo.forks_count || 0}
                          </span>
                          {repo.private && (
                            <span className="text-xs text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full">
                              🔒 Private
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Pull Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="h-[500px]"
        >
          <Card className="gradient-card backdrop-blur-sm border-border/50 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Recent Pull Requests
                  <span className="text-sm text-muted-foreground font-normal">
                    ({recentPullRequests.length} of {pullRequests.length})
                  </span>
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/pull-requests">View all ({pullRequests.length})</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {recentPullRequests.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <GitPullRequest className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="font-medium mb-1">
                        {pullRequests.length === 0 ? "No pull requests yet" : "No recent PR activity"}
                      </p>
                      <p className="text-sm">
                        {pullRequests.length === 0 
                          ? "Create or review pull requests to see them here!" 
                          : "Your recent pull requests haven't been updated"}
                      </p>
                    </div>
                  </div>
                ) : (
                  recentPullRequests.map((pr) => (
                    <div
                      key={pr.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{pr.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          #{pr.number} • {pr.repo_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={pr.author_avatar_url} />
                            <AvatarFallback className="text-xs">{pr.author_username[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {pr.author_username}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pr.state === 'open' ? 'bg-success/10 text-success border border-success/20' : 
                            pr.state === 'closed' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                            'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          }`}>
                            {pr.state === 'open' ? '🟢 Open' : 
                             pr.state === 'closed' ? '🔴 Closed' : 
                             '🟣 Merged'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="gradient-card backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to help you manage your GitHub workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" size="lg" className="h-auto p-4" asChild>
                <Link to="/repositories" className="flex flex-col items-center gap-2">
                  <FolderGit2 className="h-6 w-6" />
                  <span className="font-medium">Browse Repositories</span>
                  <span className="text-xs text-muted-foreground">
                    View and manage your repositories
                  </span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-auto p-4" asChild>
                <Link to="/pull-requests" className="flex flex-col items-center gap-2">
                  <GitPullRequest className="h-6 w-6" />
                  <span className="font-medium">Review Pull Requests</span>
                  <span className="text-xs text-muted-foreground">
                    Check pending pull requests
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};