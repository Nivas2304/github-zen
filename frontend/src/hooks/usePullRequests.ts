import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import { PullRequest } from '@/data/mockData';

export const usePullRequests = (state: string = 'open') => {
  const queryClient = useQueryClient();

  const {
    data: pullRequests = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pullRequests', state],
    queryFn: async () => {
      const response = await apiService.getPullRequests(state);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    retry: 1,
  });

  return {
    pullRequests,
    isLoading,
    error,
    refetch,
  };
};

export const useRepositoryPullRequests = (repoName: string, state: string = 'open') => {
  const {
    data: pullRequests = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['repositoryPullRequests', repoName, state],
    queryFn: async () => {
      const response = await apiService.getRepositoryPullRequests(repoName, state);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !!repoName,
    retry: 1,
  });

  return {
    pullRequests,
    isLoading,
    error,
    refetch,
  };
};

export const usePullRequestComments = (repoName: string, prNumber: number) => {
  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pullRequestComments', repoName, prNumber],
    queryFn: async () => {
      const response = await apiService.getPullRequestComments(repoName, prNumber);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !!repoName && !!prNumber,
    retry: 1,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (body: string) => {
      const response = await apiService.createPullRequestComment(repoName, prNumber, body);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch comments after creating a new one
      queryClient.invalidateQueries({ queryKey: ['pullRequestComments', repoName, prNumber] });
    },
  });

  const createComment = (body: string) => {
    createCommentMutation.mutate(body);
  };

  return {
    comments,
    isLoading,
    error,
    refetch,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
    createCommentError: createCommentMutation.error,
  };
};

