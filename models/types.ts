export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'housekeeper' | 'seeker';
  photo?: string;
  bio?: string;
  rate?: number;
  location?: string;
  completedJobs?: number;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  rate: number;
  location: string;
  type: 'offer' | 'request';
  dateTime?: string | null;
  photos?: string[];
  availability?: string[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  postId: string;
  fromUserId: string;
  message: string;
  proposedRate: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  postId: string;
  housekeeperId: string;
  seekerId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  completedAt?: string;
  createdAt: string;
}

export interface FilterOptions {
  minRate?: number;
  maxRate?: number;
  location?: string;
  date?: Date | null;
}