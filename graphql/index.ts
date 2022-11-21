import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import schema from "./schema";
import context from "./context";
import jwt from "jsonwebtoken";
import cache from "./services/nodeCache";
import pubsub from "./services/pubsub";

const graphql = async ({ app, httpServer }) => {
  const apolloServer = new ApolloServer({
    schema,
    context,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (connectionParams, webSocket, context) => {
        console.log("Connected!");

        const token = connectionParams?.authorization?.split(" ")[1];
        if (!!token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!!decoded) {
              if (cache.has("online-user")) {
                const currOnline = [...(cache.get("online-user") as [])];
                if (!currOnline.find((val) => val["id"] === decoded["id"])) {
                  cache.set("online-user", [
                    {
                      id: decoded["id"],
                      role: decoded["role"],
                      firstName: decoded["firstName"],
                      lastName: decoded["lastName"],
                    },
                    ...currOnline,
                  ]);
                }
              } else {
                cache.set("online-user", [
                  {
                    id: decoded["id"],
                    role: decoded["role"],
                    firstName: decoded["firstName"],
                    lastName: decoded["lastName"],
                  },
                ]);
              }
              pubsub.publish("ONLINE_USER", {
                onlineUsers: cache.get("online-user") || [],
              });
              return { user: decoded };
            }
          } catch (error) {
            throw error;
          }
        }
      },
      onDisconnect: async (webSocket, context) => {
        console.log("Disconnected!");
        const initialContext = await context.initPromise;
        if (
          initialContext &&
          typeof initialContext === "object" &&
          Reflect.has(initialContext, "user")
        ) {
          if (cache.has("online-user") && !!initialContext?.user?.id) {
            const currUser = cache.get("online-user") as [];
            const filterUser = currUser.filter(
              (val) => val["id"] !== initialContext.user.id
            );
            cache.set("online-user", filterUser);
            pubsub.publish("ONLINE_USER", {
              onlineUsers: filterUser,
            });
          }
        }
      },
    },
    { server: httpServer, path: apolloServer.graphqlPath }
  );
};

export default graphql;
