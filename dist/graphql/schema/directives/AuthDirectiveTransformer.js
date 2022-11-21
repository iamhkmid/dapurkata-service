"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const authDirective_1 = __importDefault(require("./resolves/authDirective"));
const typeDirectiveArgumentMaps = {};
const AuthDirectiveTransformer = (schema, directiveName) => (0, utils_1.mapSchema)(schema, {
    [utils_1.MapperKind.TYPE]: (type) => {
        var _a;
        const directive = (_a = (0, utils_1.getDirective)(schema, type, directiveName)) === null || _a === void 0 ? void 0 : _a[0];
        if (directive) {
            typeDirectiveArgumentMaps[type.name] = directive;
        }
        return undefined;
    },
    [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        var _a, _b;
        const directive = (_b = (_a = (0, utils_1.getDirective)(schema, fieldConfig, directiveName)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : typeDirectiveArgumentMaps[typeName];
        if (!!directive) {
            const { requires } = directive;
            if (requires) {
                const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async (source, args, context, info) => {
                    const { user } = await (0, authDirective_1.default)({
                        db: context["db"],
                        req: context["req"],
                        requires,
                    });
                    const ctx = Object.assign(Object.assign({}, context), { user });
                    return resolve(source, args, ctx, info);
                };
                return fieldConfig;
            }
        }
    },
});
exports.default = AuthDirectiveTransformer;
