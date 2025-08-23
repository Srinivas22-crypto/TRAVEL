import api, { 
  ApiResponse, 
  Destination, 
  SearchParams 
} from '../lib/api';

export interface DestinationSearchParams extends SearchParams {
  country?: string;
  minBudget?: number;
  maxBudget?: number;
}

class DestinationService {
  // Get all destinations
  async getDestinations(params?: DestinationSearchParams): Promise<{
    destinations: Destination[];
    total: number;
    pagination?: any;
  }> {
    try {
      const response = await api.get<ApiResponse<Destination[]>>('/destinations', {
        params,
      });

      return {
        destinations: response.data.data,
        total: response.data.total || 0,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destinations');
    }
  }

  // Get single destination
  async getDestination(id: string): Promise<Destination> {
    try {
      const response = await api.get<ApiResponse<Destination>>(`/destinations/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destination');
    }
  }

  // Search destinations
  async searchDestinations(query: string, filters?: {
    category?: string;
    minBudget?: number;
    maxBudget?: number;
  }): Promise<Destination[]> {
    try {
      const params = {
        q: query,
        ...filters,
      };

      const response = await api.get<ApiResponse<Destination[]>>('/destinations/search', {
        params,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search destinations');
    }
  }

  // Get popular destinations
  async getPopularDestinations(limit: number = 10): Promise<Destination[]> {
    try {
      const response = await api.get<ApiResponse<Destination[]>>('/destinations/popular', {
        params: { limit },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch popular destinations');
    }
  }

  // Get destinations by category
  async getDestinationsByCategory(
    category: string,
    params?: SearchParams
  ): Promise<{
    destinations: Destination[];
    total: number;
  }> {
    try {
      const response = await api.get<ApiResponse<Destination[]>>(
        `/destinations/category/${category}`,
        { params }
      );

      return {
        destinations: response.data.data,
        total: response.data.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destinations by category');
    }
  }

  // Create destination (Admin only)
  async createDestination(destinationData: Omit<Destination, '_id' | 'createdAt' | 'isActive'>): Promise<Destination> {
    try {
      const response = await api.post<ApiResponse<Destination>>('/destinations', destinationData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create destination');
    }
  }

  // Update destination (Admin only)
  async updateDestination(
    id: string,
    destinationData: Partial<Destination>
  ): Promise<Destination> {
    try {
      const response = await api.put<ApiResponse<Destination>>(
        `/destinations/${id}`,
        destinationData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update destination');
    }
  }

  // Delete destination (Admin only)
  async deleteDestination(id: string): Promise<void> {
    try {
      await api.delete(`/destinations/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete destination');
    }
  }

  // Get destination categories
  getCategories(): Array<{ value: string; label: string }> {
    return [
      { value: 'beach', label: 'Beach' },
      { value: 'mountain', label: 'Mountain' },
      { value: 'city', label: 'City' },
      { value: 'cultural', label: 'Cultural' },
      { value: 'adventure', label: 'Adventure' },
      { value: 'relaxation', label: 'Relaxation' },
    ];
  }

  // Filter destinations by budget
  filterByBudget(destinations: Destination[], minBudget?: number, maxBudget?: number): Destination[] {
    return destinations.filter(destination => {
      if (!destination.estimatedBudget) return true;
      
      const budget = destination.estimatedBudget.budget;
      
      if (minBudget && budget < minBudget) return false;
      if (maxBudget && budget > maxBudget) return false;
      
      return true;
    });
  }

  // Sort destinations
  sortDestinations(destinations: Destination[], sortBy: string): Destination[] {
    const sorted = [...destinations];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.averageRating - a.averageRating);
      case 'popular':
        return sorted.sort((a, b) => b.totalReviews - a.totalReviews);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'budget-low':
        return sorted.sort((a, b) => {
          const budgetA = a.estimatedBudget?.budget || 0;
          const budgetB = b.estimatedBudget?.budget || 0;
          return budgetA - budgetB;
        });
      case 'budget-high':
        return sorted.sort((a, b) => {
          const budgetA = a.estimatedBudget?.budget || 0;
          const budgetB = b.estimatedBudget?.budget || 0;
          return budgetB - budgetA;
        });
      default:
        return sorted;
    }
  }
}

// Create and export a singleton instance
const destinationService = new DestinationService();
export default destinationService;
