export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: 'WAITING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  steps?: Step[];
  percent?: number;
  author: string;
}

export interface Step {
  id: string;
  title?: string;
  message?: any;
  type?: string;
  status?: 'WAITING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  createdAt?: string;
  updatedAt: string;
}
