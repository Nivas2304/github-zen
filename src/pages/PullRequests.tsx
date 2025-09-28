import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, GitPullRequest, ExternalLink, Filter, Clock, User } from 'lucide-react';
import { mockPullRequests, getUniqueRepoNames } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PullRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [repositoryFilter, setRepositoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const repositories = ['all', ...getUniqueRepoNames()];
  const statuses = ['all', 'open', 'closed', 'merged'];

  // Filter pull requests
  const filteredPullRequests = useMemo(() => {
    return mockPullRequests.filter(pr => {
      const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pr.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pr.user.login.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRepository = repositoryFilter === 'all' || pr.base.repo.name === repositoryFilter;
      const matchesStatus = statusFilter === 'all' || pr.state === statusFilter;
      return matchesSearch && matchesRepository && matchesStatus;
    });
  }, [searchQuery, repositoryFilter, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-success/10 text-success border-success/20';
      case 'closed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'merged':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Pull Requests</h1>
        <p className="text-muted-foreground">
          Manage and review pull requests across your repositories
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pull requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={repositoryFilter} onValueChange={setRepositoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map(repo => (
                  <SelectItem key={repo} value={repo}>
                    {repo === 'all' ? 'All Repositories' : repo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredPullRequests.length} pull requests</span>
          {searchQuery && (
            <Badge variant="secondary" className="ml-2">
              Search: "{searchQuery}"
            </Badge>
          )}
          {repositoryFilter !== 'all' && (
            <Badge variant="secondary">
              Repo: {repositoryFilter}
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary">
              Status: {statusFilter}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Pull Requests List */}
      {filteredPullRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <GitPullRequest className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pull requests found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setRepositoryFilter('all');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredPullRequests.map((pr, index) => (
            <motion.div
              key={pr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-card transition-smooth group gradient-card backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={pr.user.avatar_url} alt={pr.user.login} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge className={`${getStatusColor(pr.state)} shrink-0`}>
                            {pr.state}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            #{pr.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/pull-requests/${pr.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a 
                              href={pr.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div>
                        <Link to={`/pull-requests/${pr.id}`}>
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {pr.title}
                          </h3>
                        </Link>
                        {pr.body && (
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                            {pr.body}
                          </p>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {pr.user.login}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitPullRequest className="h-3 w-3" />
                          {pr.base.repo.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(pr.created_at)}
                        </span>
                        {pr.head.ref && (
                          <Badge variant="outline" className="text-xs">
                            {pr.head.ref}
                          </Badge>
                        )}
                      </div>

                      {/* Labels */}
                      {pr.labels && pr.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {pr.labels.slice(0, 3).map((label) => (
                            <Badge
                              key={label.name}
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: `#${label.color}20`,
                                borderColor: `#${label.color}40`,
                              }}
                            >
                              {label.name}
                            </Badge>
                          ))}
                          {pr.labels.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{pr.labels.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};