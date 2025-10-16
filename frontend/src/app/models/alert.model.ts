export interface Alert {
  _id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  type?: string;
  createdAt: string | Date;
}
