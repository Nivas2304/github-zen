import React from 'react';
import { motion } from 'framer-motion';
import { Github, GitPullRequest, MessageSquare, Star, Eye, Users } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { BackgroundShapes } from '@/components/BackgroundShapes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const Landing: React.FC = () => {
  const { login, isLoading, loginStep } = useAuth();

  const getLoadingText = () => {
    switch (loginStep) {
      case 'redirecting':
        return 'Redirecting to GitHub...';
      case 'processing':
        return 'Processing authentication...';
      default:
        return 'Connecting...';
    }
  };

  const features = [
    {
      icon: Eye,
      title: 'Repository Overview',
      description: 'View and manage all your GitHub repositories in one clean interface with detailed statistics.'
    },
    {
      icon: GitPullRequest,
      title: 'Pull Request Management',
      description: 'Efficiently manage pull requests with filtering, sorting, and quick actions.'
    },
    {
      icon: MessageSquare,
      title: 'Comment System',
      description: 'Add comments and interact with your team directly from the dashboard.'
    }
  ];

  const stats = [
    { 
      icon: Star, 
      value: 'Dynamic', 
      label: 'Stars Managed',
      description: 'Real-time GitHub stars across all repositories'
    },
    { 
      icon: GitPullRequest, 
      value: 'Live', 
      label: 'PRs Processed',
      description: 'Active pull requests with real-time updates'
    },
    { 
      icon: Users, 
      value: 'Real', 
      label: 'GitHub Integration',
      description: 'Direct connection to your GitHub account'
    }
  ];

  return (
    <div className="min-h-screen bg-app">
      {/* Hero Section with Custom Background */}
      <HeroGeometric 
        badge="GitHub Manager"
        title1="Streamline Your"
        title2="GitHub Workflow"
        ctaButton={
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col items-center mt-8 space-y-4"
          >
            <Button
              size="lg"
              onClick={login}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-elegant"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{getLoadingText()}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>Sign in with GitHub</span>
                </div>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Having trouble signing in with a different account? Try clearing your browser cache or use an incognito window.
            </p>
          </motion.div>
        }
      />

      <div className="relative">
        <BackgroundShapes variant="minimal" />
        
        {/* Features Section */}
        <section className="relative z-10 py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your GitHub repositories and pull requests efficiently
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card className="h-full hover:shadow-elegant transition-smooth border-border/50 gradient-card backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center text-muted-foreground leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Trusted by Developers</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers who use GitHub Manager to streamline their workflow
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-success/20">
                      <Icon className="w-8 h-8 text-success" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-muted-foreground mb-2">{stat.label}</div>
                    <div className="text-sm text-muted-foreground/80 max-w-xs mx-auto">{stat.description}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="gradient-card backdrop-blur-sm border border-border/50 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect your GitHub account and start managing your repositories and pull requests more efficiently today.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-elegant"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>{getLoadingText()}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Github className="w-5 h-5" />
                    <span>Get Started Free</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};