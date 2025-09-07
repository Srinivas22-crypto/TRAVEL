import api, { Post, Comment, Reply } from '@/lib/api';

export type { Post, Comment, Reply };

export interface CreatePostData {
  content: string;
  images?: string[];
  location?: string;
  tags?: string[];
}

export interface PostsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: Post[];
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    likeCount: number;
    isLiked: boolean;
  };
}

export interface SaveResponse {
  success: boolean;
  message: string;
  data: {
    isSaved: boolean;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export interface ReplyResponse {
  success: boolean;
  message: string;
  data: Reply;
}

class PostService {
  // Get all posts
  async getPosts(params?: {
    page?: number;
    limit?: number;
    tag?: string;
    location?: string;
    sort?: 'latest' | 'popular' | 'trending';
  }): Promise<PostsResponse> {
    const response = await api.get('/posts', { params });
    return response.data;
  }

  // Get single post
  async getPost(id: string): Promise<PostResponse> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }

  // Create new post
  async createPost(data: CreatePostData): Promise<PostResponse> {
    const response = await api.post('/posts', data);
    return response.data;
  }

  // Update post
  async updatePost(id: string, data: Partial<CreatePostData>): Promise<PostResponse> {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  }

  // Delete post
  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }

  // Like post
  async likePost(id: string): Promise<LikeResponse> {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  }

  // Unlike post
  async unlikePost(id: string): Promise<LikeResponse> {
    const response = await api.delete(`/posts/${id}/like`);
    return response.data;
  }

  // Save post
  async savePost(id: string): Promise<SaveResponse> {
    const response = await api.post(`/posts/${id}/save`);
    return response.data;
  }

  // Unsave post
  async unsavePost(id: string): Promise<SaveResponse> {
    const response = await api.delete(`/posts/${id}/save`);
    return response.data;
  }

  // Add comment
  async addComment(id: string, content: string): Promise<CommentResponse> {
    const response = await api.post(`/posts/${id}/comment`, { content });
    return response.data;
  }

  // Update comment
  async updateComment(postId: string, commentId: string, content: string): Promise<CommentResponse> {
    const response = await api.put(`/posts/${postId}/comment/${commentId}`, { content });
    return response.data;
  }

  // Delete comment
  async deleteComment(postId: string, commentId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
    return response.data;
  }

  // Add reply to comment
  async addReply(postId: string, commentId: string, content: string): Promise<ReplyResponse> {
    const response = await api.post(`/posts/${postId}/comment/${commentId}/reply`, { content });
    return response.data;
  }

  // Like comment
  async likeComment(postId: string, commentId: string): Promise<LikeResponse> {
    const response = await api.post(`/posts/${postId}/comment/${commentId}/like`);
    return response.data;
  }

  // Unlike comment
  async unlikeComment(postId: string, commentId: string): Promise<LikeResponse> {
    const response = await api.delete(`/posts/${postId}/comment/${commentId}/like`);
    return response.data;
  }

  // Share post
  async sharePost(id: string): Promise<{ success: boolean; message: string; data: { shares: number } }> {
    const response = await api.post(`/posts/${id}/share`);
    return response.data;
  }

  // Mark as interested
  async markInterested(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/posts/${id}/interested`);
    return response.data;
  }

  // Mark as not interested
  async markNotInterested(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/posts/${id}/not-interested`);
    return response.data;
  }

  // Report post
  async reportPost(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/posts/${id}/report`, { reason });
    return response.data;
  }

  // Get posts by tag
  async getPostsByTag(tag: string, params?: { page?: number; limit?: number }): Promise<PostsResponse> {
    const response = await api.get(`/posts/tag/${tag}`, { params });
    return response.data;
  }

  // Get posts by user
  async getUserPosts(userId: string, params?: { page?: number; limit?: number }): Promise<PostsResponse> {
    const response = await api.get(`/posts/user/${userId}`, { params });
    return response.data;
  }
}

export default new PostService();