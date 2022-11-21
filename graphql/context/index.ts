import api from "../services/api";
import { Request, Response } from "express";
import { ExecutionParams } from "subscriptions-transport-ws";
import { TCtx } from "../../types/gContext";
import { db } from "../services/db";
import pubsub from "../services/pubsub";
import cache from "../services/nodeCache";
import { transporter } from "../services/nodeMailer";

type TParamsCtx = {
  req: Request;
  res: Response;
};
type TContext = (params: TParamsCtx) => Promise<TCtx>;

const context: TContext = async ({ req, res }) => {
  return { api, req, res, db, pubsub, cache, mail: transporter };
};

export default context;
