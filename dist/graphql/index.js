"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const graphql_1 = require("graphql");
const schema_1 = __importDefault(require("./schema"));
const context_1 = __importDefault(require("./context"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodeCache_1 = __importDefault(require("./services/nodeCache"));
const pubsub_1 = __importDefault(require("./services/pubsub"));
const __1 = require("..");
const graphql = async ({ app, httpServer }) => {
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: schema_1.default,
        context: context_1.default,
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
    apolloServer.applyMiddleware({ app, cors: __1.corsOptions });
    const subscriptionServer = subscriptions_transport_ws_1.SubscriptionServer.create({
        schema: schema_1.default,
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe,
        onConnect: async (connectionParams, webSocket, context) => {
            var _a;
            console.log("Connected!");
            const token = (_a = connectionParams === null || connectionParams === void 0 ? void 0 : connectionParams.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!!token) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                    if (!!decoded) {
                        if (nodeCache_1.default.has("online-user")) {
                            const currOnline = [...nodeCache_1.default.get("online-user")];
                            if (!currOnline.find((val) => val["id"] === decoded["id"])) {
                                nodeCache_1.default.set("online-user", [
                                    {
                                        id: decoded["id"],
                                        role: decoded["role"],
                                        firstName: decoded["firstName"],
                                        lastName: decoded["lastName"],
                                    },
                                    ...currOnline,
                                ]);
                            }
                        }
                        else {
                            nodeCache_1.default.set("online-user", [
                                {
                                    id: decoded["id"],
                                    role: decoded["role"],
                                    firstName: decoded["firstName"],
                                    lastName: decoded["lastName"],
                                },
                            ]);
                        }
                        pubsub_1.default.publish("ONLINE_USER", {
                            onlineUsers: nodeCache_1.default.get("online-user") || [],
                        });
                        return { user: decoded };
                    }
                }
                catch (error) {
                    throw error;
                }
            }
        },
        onDisconnect: async (webSocket, context) => {
            var _a;
            console.log("Disconnected!");
            const initialContext = await context.initPromise;
            if (initialContext &&
                typeof initialContext === "object" &&
                Reflect.has(initialContext, "user")) {
                if (nodeCache_1.default.has("online-user") && !!((_a = initialContext === null || initialContext === void 0 ? void 0 : initialContext.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    const currUser = nodeCache_1.default.get("online-user");
                    const filterUser = currUser.filter((val) => val["id"] !== initialContext.user.id);
                    nodeCache_1.default.set("online-user", filterUser);
                    pubsub_1.default.publish("ONLINE_USER", {
                        onlineUsers: filterUser,
                    });
                }
            }
        },
    }, { server: httpServer, path: apolloServer.graphqlPath });
};
exports.default = graphql;
