import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  updateComment,
  sharePost,
  getPostsByTag,
  getUserPosts,
  savePost,
  unsavePost,
  addReply,
  likeComment,
  unlikeComment,
  markInterested,
  markNotInterested,
  reportPost,
} from '../controllers/posts.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Social posts and community content
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (feed)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, popular, trending]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Create new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               group:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router
  .route('/')
  .get(optionalAuth, getPosts)
  .post(protect, validatePost, createPost);

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: User's posts
 */
router.get('/user/:userId', getUserPosts);

/**
 * @swagger
 * /api/posts/tag/{tag}:
 *   get:
 *     summary: Get posts by tag
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Posts with the tag
 */
router.get('/tag/:tag', getPostsByTag);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get single post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *   put:
 *     summary: Update post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               location:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router
  .route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unliked successfully
 */
router
  .route('/:id/like')
  .post(protect, likePost)
  .delete(protect, unlikePost);

/**
 * @swagger
 * /api/posts/{id}/comment:
 *   post:
 *     summary: Add comment to post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/:id/comment', protect, addComment);

/**
 * @swagger
 * /api/posts/{id}/comment/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/:id/comment/:commentId', protect, deleteComment);

/**
 * @swagger
 * /api/posts/{id}/share:
 *   post:
 *     summary: Share a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post shared successfully
 */
router.post('/:id/share', protect, sharePost);

/**
 * @swagger
 * /api/posts/{id}/save:
 *   post:
 *     summary: Save a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post saved successfully
 *   delete:
 *     summary: Unsave a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 */
router
  .route('/:id/save')
  .post(protect, savePost)
  .delete(protect, unsavePost);

/**
 * @swagger
 * /api/posts/{id}/comment/{commentId}:
 *   put:
 *     summary: Update comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put('/:id/comment/:commentId', protect, updateComment);

/**
 * @swagger
 * /api/posts/{id}/comment/{commentId}/reply:
 *   post:
 *     summary: Add reply to comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply added successfully
 */
router.post('/:id/comment/:commentId/reply', protect, addReply);

/**
 * @swagger
 * /api/posts/{id}/comment/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *   delete:
 *     summary: Unlike a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment unliked successfully
 */
router
  .route('/:id/comment/:commentId/like')
  .post(protect, likeComment)
  .delete(protect, unlikeComment);

/**
 * @swagger
 * /api/posts/{id}/interested:
 *   post:
 *     summary: Mark post as interested
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post marked as interested
 */
router.post('/:id/interested', protect, markInterested);

/**
 * @swagger
 * /api/posts/{id}/not-interested:
 *   post:
 *     summary: Mark post as not interested
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post marked as not interested
 */
router.post('/:id/not-interested', protect, markNotInterested);

/**
 * @swagger
 * /api/posts/{id}/report:
 *   post:
 *     summary: Report a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post reported successfully
 */
router.post('/:id/report', protect, reportPost);

export default router;
