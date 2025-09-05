import api from '@/lib/api';
import { Post } from './postService';

export interface UserComment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
  isReply?: boolean;
  parentComment?: {
    _id: string;
    content: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  };
  post: {
    _id: string;
    content: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  };
}

export interface ContentPreferences {
  interestedTags: string[];
  notInterestedTags: string[];
  reportedPosts: Array<{
    post: string;
    reason: string;
    reportedAt: string;
  }>;
}

export interface SavedPostsResponse {
  success: boolean;
  count: number;
  total: number;
  data: Post[];
}

export interface UserCommentsResponse {
  success: boolean;
  count: number;
  data: UserComment[];
}

export interface PreferencesResponse {
  success: boolean;
  data: ContentPreferences;
}

class UserService {
  // Get user's saved posts
  async getSavedPosts(params?: { page?: number; limit?: number }): Promise<SavedPostsResponse> {
    const response = await api.get('/users/saved-posts', { params });
    return response.data;
  }

  // Get user's comments
  async getUserComments(params?: { page?: number; limit?: number }): Promise<UserCommentsResponse> {
    const response = await api.get('/users/my-comments', { params });
    return response.data;
  }

  // Get user's content preferences
  async getUserPreferences(): Promise<PreferencesResponse> {
    const response = await api.get('/users/preferences');
    return response.data;
  }

  // Update user's content preferences
  async updateUserPreferences(preferences: {
    interestedTags?: string[];
    notInterestedTags?: string[];
  }): Promise<PreferencesResponse> {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<{
    success: boolean;
    data: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
      profileImage: string;
      role: string;
      isVerified: boolean;
      preferences: {
        language: string;
        currency: string;
        notifications: {
          email: boolean;
          push: boolean;
          marketing: boolean;
        };
      };
      savedPosts: string[];
      contentPreferences: ContentPreferences;
      createdAt: string;
      updatedAt: string;
    };
  }> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  // Upload profile image
  async uploadProfileImage(imageFile: File): Promise<{
    success: boolean;
    message: string;
    data: { imageUrl: string };
  }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/users/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new UserService();