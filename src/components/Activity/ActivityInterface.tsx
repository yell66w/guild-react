export interface ActivityInterface {
  id: number | string;
  name: string;
  activityPoints: [
    {
      id: number;
      name: string;
      ap: number;
    }
  ];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityPointInterface {
  id: number | string;
  name: string;
  ap: number;
}
