import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { User, Post, Proposal, Review, Job } from '@/models/types';

// Abrir banco apenas se não for web
const db = Platform.OS !== 'web' ? SQLite.openDatabase('cleanconnect.db') : null;

// Dados fictícios
const sampleUsers: Partial<User>[] = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-123-4567',
    role: 'housekeeper',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Professional cleaner with 5 years of experience. Specializing in deep cleaning and organization.',
    rate: 25,
    location: 'Downtown',
    completedJobs: 47,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-987-6543',
    role: 'housekeeper',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Detailed-oriented cleaning professional. Eco-friendly products and techniques.',
    rate: 30,
    location: 'Uptown',
    completedJobs: 32,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '555-456-7890',
    role: 'seeker',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Looking for regular cleaning services for my home office.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '555-789-0123',
    role: 'seeker',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Busy professional seeking help with weekly apartment cleaning.',
    createdAt: new Date().toISOString(),
  },
];

const samplePosts: Partial<Post>[] = [
  {
    id: 'post1',
    userId: 'user3',
    title: 'Need Weekly House Cleaning',
    description: 'Looking for someone to clean my 2-bedroom apartment weekly. Tasks include vacuuming, dusting, and bathroom cleaning.',
    rate: 100,
    location: 'Downtown',
    type: 'request',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post2',
    userId: 'user4',
    title: 'One-time Deep Kitchen Cleaning',
    description: 'Need a thorough kitchen cleaning including inside appliances, cabinets, and floor scrubbing.',
    rate: 150,
    location: 'Uptown',
    type: 'request',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post3',
    userId: 'user1',
    title: 'Professional House Cleaning Services',
    description: 'Offering detailed cleaning services for homes and apartments. Eco-friendly products available upon request.',
    rate: 25,
    location: 'Downtown',
    type: 'offer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post4',
    userId: 'user2',
    title: 'Deep Cleaning Specialist',
    description: 'Specializing in deep cleaning for move-in/move-out. Attention to detail guaranteed.',
    rate: 30,
    location: 'Uptown',
    type: 'offer',
    createdAt: new Date().toISOString(),
  },
];

const sampleReviews: Partial<Review>[] = [
  {
    id: 'review1',
    jobId: 'job1',
    fromUserId: 'user3',
    toUserId: 'user1',
    rating: 5,
    comment: 'John did an amazing job! My apartment has never been cleaner.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'review2',
    jobId: 'job2',
    fromUserId: 'user4',
    toUserId: 'user2',
    rating: 4,
    comment: 'Very thorough cleaning. Would hire again.',
    createdAt: new Date().toISOString(),
  },
];

// Inicializa o banco
export const initDatabase = async (): Promise<any> => {
  if (Platform.OS === 'web') {
    console.warn('SQLite não é suportado na web. Nenhuma operação será realizada.');
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            role TEXT NOT NULL,
            photo TEXT,
            bio TEXT,
            rate REAL,
            location TEXT,
            completedJobs INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            rate REAL NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL,
            dateTime TEXT,
            photos TEXT,
            availability TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id)
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS proposals (
            id TEXT PRIMARY KEY,
            postId TEXT NOT NULL,
            fromUserId TEXT NOT NULL,
            message TEXT NOT NULL,
            proposedRate REAL NOT NULL,
            status TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES posts (id),
            FOREIGN KEY (fromUserId) REFERENCES users (id)
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            postId TEXT NOT NULL,
            housekeeperId TEXT NOT NULL,
            seekerId TEXT NOT NULL,
            status TEXT NOT NULL,
            completedAt TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES posts (id),
            FOREIGN KEY (housekeeperId) REFERENCES users (id),
            FOREIGN KEY (seekerId) REFERENCES users (id)
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            jobId TEXT NOT NULL,
            fromUserId TEXT NOT NULL,
            toUserId TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (jobId) REFERENCES jobs (id),
            FOREIGN KEY (fromUserId) REFERENCES users (id),
            FOREIGN KEY (toUserId) REFERENCES users (id)
          );`
        );

        sampleUsers.forEach((user) => {
          tx.executeSql(
            `INSERT OR IGNORE INTO users (id, name, email, password, phone, role, photo, bio, rate, location, completedJobs, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user.id,
              user.name,
              user.email,
              'password123',
              user.phone,
              user.role,
              user.photo,
              user.bio,
              user.rate,
              user.location,
              user.completedJobs || 0,
              user.createdAt,
            ]
          );
        });

        samplePosts.forEach((post) => {
          tx.executeSql(
            `INSERT OR IGNORE INTO posts (id, userId, title, description, rate, location, type, dateTime, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              post.id,
              post.userId,
              post.title,
              post.description,
              post.rate,
              post.location,
              post.type,
              post.dateTime,
              post.createdAt,
            ]
          );
        });

        sampleReviews.forEach((review) => {
          tx.executeSql(
            `INSERT OR IGNORE INTO reviews (id, jobId, fromUserId, toUserId, rating, comment, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              review.id,
              review.jobId,
              review.fromUserId,
              review.toUserId,
              review.rating,
              review.comment,
              review.createdAt,
            ]
          );
        });
      },
      (error) => {
        console.error('Erro ao inicializar banco de dados:', error);
        reject(error);
      },
      () => {
        console.log('Banco de dados inicializado com sucesso');
        resolve(db);
      }
    );
  });
};

// Executar comandos SQL
export const executeSql = (
  query: string,
  params: any[] = []
): Promise<SQLite.SQLResultSet | null> => {
  if (Platform.OS === 'web') {
    console.warn('executeSql não disponível na web.');
    return Promise.resolve(null);
  }

  if (!db) {
    return Promise.reject('Banco de dados não inicializado');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error('Erro SQL:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};
