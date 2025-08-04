import { useState, useEffect } from 'react';
import type { Employer, NewEmployer } from '@/lib/schema';

export function useEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all employers
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employers');
      if (!response.ok) {
        throw new Error('Failed to fetch employers');
      }
      const data = await response.json();
      setEmployers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new employer
  const createEmployer = async (employerData: NewEmployer) => {
    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employer');
      }

      const newEmployer = await response.json();
      setEmployers(prev => [newEmployer, ...prev]);
      return newEmployer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employer');
      throw err;
    }
  };

  // Update an employer
  const updateEmployer = async (id: number, employerData: Partial<NewEmployer>) => {
    try {
      const response = await fetch(`/api/employers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update employer');
      }

      const updatedEmployer = await response.json();
      setEmployers(prev => 
        prev.map(employer => 
          employer.id === id ? updatedEmployer : employer
        )
      );
      return updatedEmployer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employer');
      throw err;
    }
  };

  // Delete an employer
  const deleteEmployer = async (id: number) => {
    try {
      const response = await fetch(`/api/employers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete employer');
      }

      setEmployers(prev => prev.filter(employer => employer.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employer');
      throw err;
    }
  };

  // Get a specific employer
  const getEmployer = async (id: number) => {
    try {
      const response = await fetch(`/api/employers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employer');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employer');
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return {
    employers,
    loading,
    error,
    fetchEmployers,
    createEmployer,
    updateEmployer,
    deleteEmployer,
    getEmployer,
  };
} 