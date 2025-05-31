import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { executeSql } from './database';
import { User, Post, Proposal, Review, Job, FilterOptions } from '@/models/types';

const db = SQLite.openDatabase('cleanconnect.db');

// Auth APIs
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const result = await executeSql(
      db,
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    return result.rows._array[0] as User;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: 'housekeeper' | 'seeker'
): Promise<User> => {
  try {
    // Check if email already exists
    const existingUser = await executeSql(
      db,
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('Email already in use');
    }
    
    const userId = uuidv4();
    const createdAt = new Date().toISOString();
    
    await executeSql(
      db,
      `INSERT INTO users (id, name, email, password, phone, role, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, password, phone, role, createdAt]
    );
    
    // Return the newly created user
    return {
      id: userId,
      name,
      email,
      phone,
      role,
      createdAt,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// User APIs
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const result = await executeSql(
      db,
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows._array[0] as User;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const getHousekeepers = async (filters?: FilterOptions): Promise<User[]> => {
  try {
    let query = 'SELECT * FROM users WHERE role = "housekeeper"';
    const params: any[] = [];
    
    if (filters) {
      if (filters.location && filters.location.trim() !== '') {
        query += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
      }
      
      if (filters.minRate !== undefined) {
        query += ' AND rate >= ?';
        params.push(filters.minRate);
      }
      
      if (filters.maxRate !== undefined) {
        query += ' AND rate <= ?';
        params.push(filters.maxRate);
      }
    }
    
    query += ' ORDER BY createdAt DESC LIMIT 20';
    
    const result = await executeSql(db, query, params);
    return result.rows._array as User[];
  } catch (error) {
    console.error('Get housekeepers error:', error);
    throw error;
  }
};

// Post APIs
export const getRequests = async (filters?: FilterOptions): Promise<Post[]> => {
  try {
    let query = 'SELECT * FROM posts WHERE type = "request"';
    const params: any[] = [];
    
    if (filters) {
      if (filters.location && filters.location.trim() !== '') {
        query += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
      }
      
      if (filters.minRate !== undefined) {
        query += ' AND rate >= ?';
        params.push(filters.minRate);
      }
      
      if (filters.maxRate !== undefined) {
        query += ' AND rate <= ?';
        params.push(filters.maxRate);
      }
      
      if (filters.date) {
        const dateStr = filters.date.toISOString().split('T')[0];
        query += ' AND dateTime LIKE ?';
        params.push(`${dateStr}%`);
      }
    }
    
    query += ' ORDER BY createdAt DESC LIMIT 20';
    
    const result = await executeSql(db, query, params);
    return result.rows._array as Post[];
  } catch (error) {
    console.error('Get requests error:', error);
    throw error;
  }
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const result = await executeSql(
      db,
      'SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return result.rows._array as Post[];
  } catch (error) {
    console.error('Get user posts error:', error);
    throw error;
  }
};

export const createPost = async (postData: Partial<Post>): Promise<Post> => {
  try {
    const postId = uuidv4();
    const createdAt = new Date().toISOString();
    
    await executeSql(
      db,
      `INSERT INTO posts (id, userId, title, description, rate, location, type, dateTime, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postId,
        postData.userId,
        postData.title,
        postData.description,
        postData.rate,
        postData.location,
        postData.type,
        postData.dateTime || null,
        createdAt,
      ]
    );
    
    return {
      id: postId,
      userId: postData.userId!,
      title: postData.title!,
      description: postData.description!,
      rate: postData.rate!,
      location: postData.location!,
      type: postData.type!,
      dateTime: postData.dateTime || null,
      createdAt,
    };
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

// Review APIs
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const result = await executeSql(
      db,
      'SELECT * FROM reviews WHERE toUserId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return result.rows._array as Review[];
  } catch (error) {
    console.error('Get user reviews error:', error);
    throw error;
  }
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  try {
    const reviewId = uuidv4();
    const createdAt = new Date().toISOString();
    
    await executeSql(
      db,
      `INSERT INTO reviews (id, jobId, fromUserId, toUserId, rating, comment, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reviewId,
        reviewData.jobId,
        reviewData.fromUserId,
        reviewData.toUserId,
        reviewData.rating,
        reviewData.comment || null,
        createdAt,
      ]
    );
    
    return {
      id: reviewId,
      jobId: reviewData.jobId!,
      fromUserId: reviewData.fromUserId!,
      toUserId: reviewData.toUserId!,
      rating: reviewData.rating!,
      comment: reviewData.comment,
      createdAt,
    };
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

// Job APIs
export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  try {
    const jobId = uuidv4();
    const createdAt = new Date().toISOString();
    
    await executeSql(
      db,
      `INSERT INTO jobs (id, postId, housekeeperId, seekerId, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        jobData.postId,
        jobData.housekeeperId,
        jobData.seekerId,
        jobData.status || 'scheduled',
        createdAt,
      ]
    );
    
    return {
      id: jobId,
      postId: jobData.postId!,
      housekeeperId: jobData.housekeeperId!,
      seekerId: jobData.seekerId!,
      status: jobData.status || 'scheduled',
      createdAt,
    };
  } catch (error) {
    console.error('Create job error:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId: string, status: Job['status'], completedAt?: string): Promise<void> => {
  try {
    if (status === 'completed' && !completedAt) {
      completedAt = new Date().toISOString();
    }
    
    await executeSql(
      db,
      'UPDATE jobs SET status = ?, completedAt = ? WHERE id = ?',
      [status, completedAt || null, jobId]
    );
    
    if (status === 'completed') {
      // Update the completed jobs count for the housekeeper
      const job = await executeSql(
        db,
        'SELECT housekeeperId FROM jobs WHERE id = ?',
        [jobId]
      );
      
      if (job.rows.length > 0) {
        const housekeeperId = job.rows._array[0].housekeeperId;
        await executeSql(
          db,
          'UPDATE users SET completedJobs = completedJobs + 1 WHERE id = ?',
          [housekeeperId]
        );
      }
    }
  } catch (error) {
    console.error('Update job status error:', error);
    throw error;
  }
};