const SQLite = require('expo-sqlite');
const { v4: uuidv4 } = require('uuid');

// This script seeds the database with test data
// Run with: npm run db:seed

// Helper to execute SQL
const executeSql = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error('SQL Error:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Sample data for testing
const sampleUsers = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    phone: '555-123-4567',
    role: 'housekeeper',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Professional cleaner with 5 years of experience. Specializing in deep cleaning and organization.',
    rate: 25,
    location: 'Downtown',
    completedJobs: 47,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    phone: '555-987-6543',
    role: 'housekeeper',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Detailed-oriented cleaning professional. Eco-friendly products and techniques.',
    rate: 30,
    location: 'Uptown',
    completedJobs: 32,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    password: 'password123',
    phone: '555-456-7890',
    role: 'seeker',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Looking for regular cleaning services for my home office.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    phone: '555-789-0123',
    role: 'seeker',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    bio: 'Busy professional seeking help with weekly apartment cleaning.',
    createdAt: new Date().toISOString()
  }
];

const samplePosts = [
  {
    id: 'post1',
    userId: 'user3',
    title: 'Need Weekly House Cleaning',
    description: 'Looking for someone to clean my 2-bedroom apartment weekly. Tasks include vacuuming, dusting, and bathroom cleaning.',
    rate: 100,
    location: 'Downtown',
    type: 'request',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
  },
  {
    id: 'post3',
    userId: 'user1',
    title: 'Professional House Cleaning Services',
    description: 'Offering detailed cleaning services for homes and apartments. Eco-friendly products available upon request.',
    rate: 25,
    location: 'Downtown',
    type: 'offer',
    createdAt: new Date().toISOString()
  },
  {
    id: 'post4',
    userId: 'user2',
    title: 'Deep Cleaning Specialist',
    description: 'Specializing in deep cleaning for move-in/move-out. Attention to detail guaranteed.',
    rate: 30,
    location: 'Uptown',
    type: 'offer',
    createdAt: new Date().toISOString()
  }
];

const sampleJobs = [
  {
    id: 'job1',
    postId: 'post1',
    housekeeperId: 'user1',
    seekerId: 'user3',
    status: 'completed',
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job2',
    postId: 'post2',
    housekeeperId: 'user2',
    seekerId: 'user4',
    status: 'completed',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const sampleReviews = [
  {
    id: 'review1',
    jobId: 'job1',
    fromUserId: 'user3',
    toUserId: 'user1',
    rating: 5,
    comment: 'John did an amazing job! My apartment has never been cleaner.',
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review2',
    jobId: 'job2',
    fromUserId: 'user4',
    toUserId: 'user2',
    rating: 4,
    comment: 'Very thorough cleaning. Would hire again.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Seed database function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    const db = SQLite.openDatabase('cleanconnect.db');
    
    // Create tables if they don't exist
    await executeSql(
      db,
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
    
    await executeSql(
      db,
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
    
    await executeSql(
      db,
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
    
    await executeSql(
      db,
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
    
    // Clear existing data
    await executeSql(db, 'DELETE FROM reviews');
    await executeSql(db, 'DELETE FROM jobs');
    await executeSql(db, 'DELETE FROM posts');
    await executeSql(db, 'DELETE FROM users');
    
    console.log('Tables created and cleared. Inserting sample data...');
    
    // Insert sample data
    for (const user of sampleUsers) {
      await executeSql(
        db,
        `INSERT INTO users (id, name, email, password, phone, role, photo, bio, rate, location, completedJobs, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.phone,
          user.role,
          user.photo,
          user.bio,
          user.rate,
          user.location,
          user.completedJobs || 0,
          user.createdAt
        ]
      );
    }
    
    for (const post of samplePosts) {
      await executeSql(
        db,
        `INSERT INTO posts (id, userId, title, description, rate, location, type, dateTime, createdAt)
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
          post.createdAt
        ]
      );
    }
    
    for (const job of sampleJobs) {
      await executeSql(
        db,
        `INSERT INTO jobs (id, postId, housekeeperId, seekerId, status, completedAt, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          job.id,
          job.postId,
          job.housekeeperId,
          job.seekerId,
          job.status,
          job.completedAt,
          job.createdAt
        ]
      );
    }
    
    for (const review of sampleReviews) {
      await executeSql(
        db,
        `INSERT INTO reviews (id, jobId, fromUserId, toUserId, rating, comment, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          review.id,
          review.jobId,
          review.fromUserId,
          review.toUserId,
          review.rating,
          review.comment,
          review.createdAt
        ]
      );
    }
    
    console.log('Database seeded successfully!');
    
    // Verify counts
    const userCount = await executeSql(db, 'SELECT COUNT(*) as count FROM users');
    const postCount = await executeSql(db, 'SELECT COUNT(*) as count FROM posts');
    const jobCount = await executeSql(db, 'SELECT COUNT(*) as count FROM jobs');
    const reviewCount = await executeSql(db, 'SELECT COUNT(*) as count FROM reviews');
    
    console.log(`Users: ${userCount.rows._array[0].count}`);
    console.log(`Posts: ${postCount.rows._array[0].count}`);
    console.log(`Jobs: ${jobCount.rows._array[0].count}`);
    console.log(`Reviews: ${reviewCount.rows._array[0].count}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
seedDatabase();