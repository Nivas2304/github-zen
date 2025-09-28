import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderGit2, GitPullRequest, Star, Users, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockRepositories, mockPullRequests } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const totalStars = mockRepositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = mockRepositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  const openPRs = mockPullRequests.filter(pr => pr.state === 'open').length;

  const stats = [
    {
      title: 'Total Repositories',
      value: mockRepositories.length.toString(),
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

  const recentRepositories = mockRepositories
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  const recentPullRequests = mockPullRequests
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

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
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your repositories</p>
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
        >
          <Card className="gradient-card backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5" />
                  Recent Repositories
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/repositories">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRepositories.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{repo.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      {repo.language && (
                        <span className="text-xs text-muted-foreground">
                          {repo.language}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Pull Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="gradient-card backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Recent Pull Requests
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/pull-requests">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{pr.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      #{pr.number} • {pr.base.repo.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={pr.user.avatar_url} />
                        <AvatarFallback className="text-xs">{pr.user.login[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {pr.user.login}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pr.state === 'open' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {pr.state}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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