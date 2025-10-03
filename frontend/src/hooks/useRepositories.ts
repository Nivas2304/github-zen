import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import { Repository } from '@/data/mockData';

export const useRepositories = () => {
  const queryClient = useQueryClient();

  const {
    data: repositories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const response = await apiService.getRepositories();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    retry: 1,
  });

  return {
    repositories,
    isLoading,
    error,
    refetch,
  };
};

