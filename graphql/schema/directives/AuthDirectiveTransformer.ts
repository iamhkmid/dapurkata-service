import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import authDirective from "./resolves/authDirective";

const typeDirectiveArgumentMaps: Record<string, any> = {};
const AuthDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName: string
) =>
  mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const directive = getDirective(schema, type, directiveName)?.[0];
      if (directive) {
        typeDirectiveArgumentMaps[type.name] = directive;
      }
      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const directive =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName];
      if (!!directive) {
        const { requires } = directive;
        if (requires) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            const { user } = await authDirective({
              db: context["db"],
              req: context["req"],
              requires,
            });
            const ctx = { ...context, user };
            return resolve(source, args, ctx, info);
          };
          return fieldConfig;
        }
      }
    },
  });

export default AuthDirectiveTransformer;
