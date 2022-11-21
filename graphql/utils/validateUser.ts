import { ApolloError, AuthenticationError } from "apollo-server-express";

type TParams =
  | {
      currRole: string;
      target: "SPECIFIC_USER" | "SPECIFIC_USER_OR_ADMIN";
      currId: string;
      targetId: string;
    }
  | {
      currRole: string;
      target: "ADMIN_ONLY";
    };

type TValidateUser = (params: TParams) => void;
export const validateUser: TValidateUser = (params) => {
  if (params.currRole !== "ADMIN" && params.currRole !== "USER") {
    throw new AuthenticationError("Invalid user role");
  } else {
    if (params.target === "ADMIN_ONLY") {
      if (params.currRole !== "ADMIN")
        throw new AuthenticationError(
          "Authentication user role does not match"
        );
    } else {
      const { currId, currRole, target, targetId } = params;
      if (!targetId) {
        throw new ApolloError("Data not found");
      } else if (
        target === "SPECIFIC_USER_OR_ADMIN" &&
        currRole !== "ADMIN" &&
        currRole === "USER" &&
        currId !== targetId
      ) {
        throw new AuthenticationError(
          "Authentication user id or role does not match"
        );
      } else if (
        target === "SPECIFIC_USER" &&
        currRole === "USER" &&
        currId !== targetId
      ) {
        throw new AuthenticationError("Authentication user id does not match");
      }
    }
  }
};
