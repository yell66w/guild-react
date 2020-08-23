export interface DropInterface {
  id: number;
  name: string;
  qty: number;
  gp_price: number;
}
export interface AttendanceDropInterface {
  id: number | string;
  qty: number;
  gp_price: number;
  itemId: number | string;
}
