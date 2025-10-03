import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, MessageSquare, Send, GitPullRequest, Calendar, User, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { usePullRequests } from '@/hooks/usePullRequests';
import { usePullRequestComments } from '@/hooks/usePullRequests';
import apiService from '@/services/api';

export const PullRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pullRequest, setPullRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get pull requests data
  const { pullRequests, isLoading: prsLoading } = usePullRequests('open');

  // Find the specific pull request
  useEffect(() => {
    if (prsLoading || !id) return;
    
    const foundPR = pullRequests.find(pr => pr.number === Number(id));
    
    if (foundPR) {
      setPullRequest(foundPR);
    } else {
      navigate('/pull-requests');
    }
    setLoading(false);
  }, [pullRequests, prsLoading, id, navigate]);

  // Use the hook for comments
  const { comments, createComment, isCreatingComment } = usePullRequestComments(
    pullRequest?.repo_name || '', 
    Number(id)
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
    if (!comment.trim() || !pullRequest) return;

    try {
      setIsSubmitting(true);
      await createComment(comment);
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the pull request.",
      });

      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelloWorldComment = async () => {
    if (!pullRequest) return;

    try {
      setIsSubmitting(true);
      await createComment("Hello World! 👋");
      
      toast({
        title: "Hello World comment posted!",
        description: "A friendly greeting has been added to the pull request.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                      <AvatarImage src={pullRequest?.author_avatar_url} />
                      <AvatarFallback>{pullRequest?.author_username?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{pullRequest?.author_username}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(pullRequest?.created_at || '')}</span>
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

                <Separator />

                {/* Existing Comments */}
                <div>
                  <h4 className="font-medium mb-3">Comments ({comments?.length || 0})</h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments && comments.length > 0 ? (
                      comments.map((comment: any, index: number) => (
                        <div key={comment.id || index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.author_avatar_url} />
                              <AvatarFallback>{comment.author_username?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{comment.author_username}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
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
                    <p className="font-medium">{pullRequest.repo_full_name || pullRequest.repo_name}</p>
                    <p className="text-sm text-muted-foreground">Repository</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium">{pullRequest.head_ref || 'main'}</p>
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
                          <AvatarImage src={pullRequest.author_avatar_url} />
                          <AvatarFallback>{pullRequest.author_username?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{pullRequest.author_username}</span>
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