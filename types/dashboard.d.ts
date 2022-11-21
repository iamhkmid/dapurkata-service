type TGQLDashboardGraph = { labels: string[]; data: number[] };

export type TGQLOnlineUsers = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type TGQLDashboardQuery = {
  totalOrders: number;
  totalIncome: number;
  totalUsers: number;
  totalProducts: number;
  lastOrders: {
    id: string;
    grossAmount: number;
    CustomerDetail: {
      firstName: string;
      lastName: string;
    };
    transactionStatus: string;
    transactionTime: Date;
  }[];
  graph: TGQLDashboardGraph;
};
