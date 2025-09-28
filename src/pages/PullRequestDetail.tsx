import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, MessageSquare, Send, GitPullRequest, Calendar, User, Code } from 'lucide-react';
import { mockPullRequests } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const PullRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pullRequest = mockPullRequests.find(pr => pr.id === Number(id));

  if (!pullRequest) {
    return <Navigate to="/pull-requests" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the pull request.",
    });

    setComment('');
    setIsSubmitting(false);
  };

  const handleHelloWorldComment = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Hello World comment posted!",
      description: "A friendly greeting has been added to the pull request.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/pull-requests" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pull Requests
          </Link>
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pull Request Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(pullRequest.state)} text-sm`}>
                      {pullRequest.state.toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground">#{pullRequest.number}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={pullRequest.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
                
                <CardTitle className="text-2xl leading-tight">
                  {pullRequest.title}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pullRequest.user.avatar_url} />
                      <AvatarFallback>{pullRequest.user.login[0]}</AvatarFallback>
                    </Avatar>
                    <span>{pullRequest.user.login}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(pullRequest.created_at)}</span>
                </div>
              </CardHeader>

              {pullRequest.body && (
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {pullRequest.body}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Labels */}
          {pullRequest.labels && pullRequest.labels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="gradient-card backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Labels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pullRequest.labels.map((label) => (
                      <Badge
                        key={label.name}
                        variant="outline"
                        style={{
                          backgroundColor: `#${label.color}20`,
                          borderColor: `#${label.color}40`,
                          color: `#${label.color}`,
                        }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments & Actions
                </CardTitle>
                <CardDescription>
                  Add comments or perform quick actions on this pull request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Action */}
                <div>
                  <h4 className="font-medium mb-3">Quick Action</h4>
                  <Button 
                    onClick={handleHelloWorldComment}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? 'Posting...' : 'Post "Hello World" Comment'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Quickly post a friendly greeting to this pull request
                  </p>
                </div>

                <Separator />

                {/* Custom Comment */}
                <div>
                  <h4 className="font-medium mb-3">Add a Comment</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Leave a comment on this pull request..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {comment.length}/1000 characters
                      </p>
                      <Button 
                        onClick={handleSubmitComment}
                        disabled={!comment.trim() || isSubmitting}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Repository Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{pullRequest.base.repo.full_name}</p>
                    <p className="text-sm text-muted-foreground">Target Repository</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium">{pullRequest.head.ref}</p>
                    <p className="text-sm text-muted-foreground">Source Branch</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pull Request Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Author</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={pullRequest.user.avatar_url} />
                          <AvatarFallback>{pullRequest.user.login[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{pullRequest.user.login}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(pullRequest.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(pullRequest.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href={pullRequest.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/pull-requests" className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4" />
                    All Pull Requests
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};