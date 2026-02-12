
export type UserRole = 'member' | 'vip' | 'developer';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  isFollowing?: boolean;
  role: UserRole;
  level: number;
}

export interface VideoClip {
  id: string;
  url: string;
  uri?: string;
  start: number; // 0 to 1
  end: number;   // 0 to 1
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  videoSequence?: VideoClip[];
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  shares: number;
  views: number;
  bookmarks: number;
  quotes: number;
  liked?: boolean;
  retweeted?: boolean;
  shared?: boolean;
}

export interface Trend {
  id: string;
  category: string;
  topic: string;
  postCount: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'retweet' | 'message';
  user: User;
  content?: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isRequest?: boolean;
}
