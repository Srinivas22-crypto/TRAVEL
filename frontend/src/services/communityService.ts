import api, { 
  ApiResponse, 
  Post, 
  Group, 
  SearchParams 
} from '../lib/api';

export interface CreatePostData {
  content: string;
  images?: string[];
  location?: string;
  tags?: string[];
  group?: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  category: string;
  image?: string;
  isPrivate?: boolean;
  rules?: string[];
  tags?: string[];
}

class CommunityService {
  // Posts API
  
  // Get all posts (feed)
  async getPosts(params?: SearchParams & {
    tag?: string;
    location?: string;
    sort?: 'latest' | 'popular' | 'trending';
    group?: string;
  }): Promise<{
    posts: Post[];
    total: number;
    pagination?: any;
  }> {
    try {
      const response = await api.get<ApiResponse<Post[]>>('/posts', { params });

      return {
        posts: response.data.data,
        total: response.data.total || 0,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  }

  // Get single post
  async getPost(id: string): Promise<Post> {
    try {
      const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch post');
    }
  }

  // Create new post
  async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await api.post<ApiResponse<Post>>('/posts', postData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  }

  // Update post
  async updatePost(id: string, postData: Partial<CreatePostData>): Promise<Post> {
    try {
      const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, postData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  }

  // Delete post
  async deletePost(id: string): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete post');
    }
  }

  // Like post
  async likePost(id: string): Promise<{ likeCount: number; isLiked: boolean }> {
    try {
      const response = await api.post(`/posts/${id}/like`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to like post');
    }
  }

  // Unlike post
  async unlikePost(id: string): Promise<{ likeCount: number; isLiked: boolean }> {
    try {
      const response = await api.delete(`/posts/${id}/like`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unlike post');
    }
  }

  // Add comment to post
  async addComment(id: string, content: string): Promise<any> {
    try {
      const response = await api.post(`/posts/${id}/comment`, { content });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  // Delete comment
  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      await api.delete(`/posts/${postId}/comment/${commentId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }

  // Share post
  async sharePost(id: string): Promise<{ shares: number }> {
    try {
      const response = await api.post(`/posts/${id}/share`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to share post');
    }
  }

  // Get posts by tag
  async getPostsByTag(tag: string, params?: SearchParams): Promise<{
    posts: Post[];
    total: number;
  }> {
    try {
      const response = await api.get<ApiResponse<Post[]>>(`/posts/tag/${tag}`, { params });

      return {
        posts: response.data.data,
        total: response.data.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts by tag');
    }
  }

  // Get posts by user
  async getPostsByUser(userId: string, params?: SearchParams): Promise<{
    posts: Post[];
    total: number;
  }> {
    try {
      const response = await api.get<ApiResponse<Post[]>>(`/posts/user/${userId}`, { params });

      return {
        posts: response.data.data,
        total: response.data.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }

  // Groups API

  // Get all groups
  async getGroups(params?: SearchParams): Promise<{
    groups: Group[];
    total: number;
    pagination?: any;
  }> {
    try {
      const response = await api.get<ApiResponse<Group[]>>('/groups', { params });

      return {
        groups: response.data.data,
        total: response.data.total || 0,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch groups');
    }
  }

  // Get single group
  async getGroup(id: string): Promise<Group> {
    try {
      const response = await api.get<ApiResponse<Group>>(`/groups/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group');
    }
  }

  // Create new group
  async createGroup(groupData: CreateGroupData): Promise<Group> {
    try {
      const response = await api.post<ApiResponse<Group>>('/groups', groupData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create group');
    }
  }

  // Update group
  async updateGroup(id: string, groupData: Partial<CreateGroupData>): Promise<Group> {
    try {
      const response = await api.put<ApiResponse<Group>>(`/groups/${id}`, groupData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update group');
    }
  }

  // Delete group
  async deleteGroup(id: string): Promise<void> {
    try {
      await api.delete(`/groups/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  }

  // Join group
  async joinGroup(id: string): Promise<{ memberCount: number }> {
    try {
      const response = await api.post(`/groups/${id}/join`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to join group');
    }
  }

  // Leave group
  async leaveGroup(id: string): Promise<{ memberCount: number }> {
    try {
      const response = await api.post(`/groups/${id}/leave`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to leave group');
    }
  }

  // Get group members
  async getGroupMembers(id: string): Promise<Group['members']> {
    try {
      const response = await api.get<ApiResponse<Group['members']>>(`/groups/${id}/members`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group members');
    }
  }

  // Get group posts
  async getGroupPosts(id: string, params?: SearchParams): Promise<{
    posts: Post[];
    total: number;
  }> {
    try {
      const response = await api.get<ApiResponse<Post[]>>(`/groups/${id}/posts`, { params });

      return {
        posts: response.data.data,
        total: response.data.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group posts');
    }
  }

  // Utility functions

  // Format post date
  formatPostDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Extract hashtags from text
  extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
  }

  // Format hashtags in text
  formatHashtagsInText(text: string): string {
    return text.replace(/#[\w]+/g, '<span class="text-blue-600 font-medium">$&</span>');
  }

  // Check if user can edit post
  canEditPost(post: Post, currentUserId: string): boolean {
    return post.author._id === currentUserId;
  }

  // Check if user can delete post
  canDeletePost(post: Post, currentUserId: string, isAdmin: boolean = false): boolean {
    return post.author._id === currentUserId || isAdmin;
  }

  // Check if user is group member
  isGroupMember(group: Group, userId: string): boolean {
    return group.members.some(member => member.user._id === userId);
  }

  // Get user role in group
  getUserRoleInGroup(group: Group, userId: string): string | null {
    const member = group.members.find(member => member.user._id === userId);
    return member ? member.role : null;
  }
}

// Create and export a singleton instance
const communityService = new CommunityService();
export default communityService;
