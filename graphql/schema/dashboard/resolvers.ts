import { withFilter } from "graphql-subscriptions";
import { TGQLDashboardGraph, TGQLOnlineUsers } from "../../../types/dashboard";
import { TDashboardQuery, TDashboardSubcription } from "../../../types/graphql";
import pubsub from "../../services/pubsub";

export const Query: TDashboardQuery = {
  dashboard: async (_, __, { db, cache }) => {
    const totalOrders = await db.order.count({
      where: {
        transactionStatus: "settlement",
      },
    });
    const totalIncome = await db.order.aggregate({
      _sum: {
        grossAmount: true,
      },
      where: {
        transactionStatus: "settlement",
      },
    });
    const totalProducts = await db.book.count();
    const totalUsers = await db.user.count({ where: { role: "USER" } });
    const lastOrders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        grossAmount: true,
        CustomerDetail: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        transactionStatus: true,
        transactionTime: true,
      },
    });
    const successOrders = await db.order.findMany({
      where: {
        transactionStatus: "settlement",
        fraudStatus: "accept",
        transactionTime: {
          gte: new Date(`${new Date().getFullYear()}-01-01`),
          lt: new Date(`${new Date().getFullYear() + 1}-01-01`),
        },
      },
      select: {
        grossAmount: true,
        transactionTime: true,
      },
    });
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const graph = successOrders.reduce(
      (acc, curr) => {
        const data = acc.data;
        data[curr.transactionTime.getMonth()] =
          acc.data[curr.transactionTime.getMonth()] + curr.grossAmount;
        return {
          labels: acc.labels,
          data,
        };
      },
      {
        labels,
        data: new Array(12).fill(0),
      } as TGQLDashboardGraph
    );
    return {
      totalOrders,
      totalIncome: totalIncome._sum.grossAmount || 0,
      totalProducts,
      totalUsers,
      lastOrders,
      graph,
    };
  },
  onlineUsers: async (_, __, { db, cache }) => {
    const onlineUsers = cache.get("online-user") as TGQLOnlineUsers[];
    return onlineUsers;
  },
};

export const Subscription: TDashboardSubcription = {
  onlineUsers: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("ONLINE_USER"),
      async (payload, variables, context) => {
        return context.user.role === "ADMIN";
      }
    ),
  },
};
