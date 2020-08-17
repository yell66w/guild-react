export interface AttendanceInterface {
  id: number | string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  gp_total: number;
  ap_total: number;
  result: string;
  category: string;
  author: string;
  remarks: string;
}
