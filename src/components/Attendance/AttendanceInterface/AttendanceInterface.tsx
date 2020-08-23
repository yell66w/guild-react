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

export const AttendanceInit = {
  id: "",
  activityPoint: {
    ap: 0,
    name: "",
  },
  name: "",
  ap_total: 0,
  gp_total: 0,
  author: "",
  createdAt: "",
  participants: [
    {
      id: "",
      userId: "",
      mark: "",
      percentage: "",
    },
  ],
  items: [
    {
      id: "",
      itemId: "",
      qty: 0,
      gp_price: 0,
    },
  ],
  remarks: "",
  result: "",
  status: "",
  updatedAt: "",
  category: "",
};

export interface AttendanceEditInterface {
  id: string;
  activityPoint: {
    activityPointId: number;
    ap: number;
    name: string;
  };
  name: string;
  ap_total: number;
  gp_total: number;
  author: string;
  createdAt: string;
  participants?: [
    {
      id: string;
      userId: string;
      mark: string;
      percentage: string;
    }
  ];
  items?: [
    {
      id: string;
      itemId: string;
      qty: number;
      gp_price: number;
    }
  ];
  remarks: string;
  result: string;
  status: string;
  updatedAt: string;
  category: string;
}
