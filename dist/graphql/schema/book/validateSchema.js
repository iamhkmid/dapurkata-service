"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const yup = __importStar(require("yup"));
const validateSchema = async ({ data, type }) => {
    switch (type) {
        case "CREATE_BOOK": {
            let schema = yup.object().shape({
                title: yup.string().required("Title is required"),
                description: yup.string().required("Description is required"),
                edition: yup
                    .string()
                    .test("len", "Edition must be less than 10 characters", (val) => val ? val.length < 10 : true),
                series: yup
                    .string()
                    .test("len", "Series must be number and less than 1000", (val) => !!val ? Number(val) < 1000 : true),
                releaseYear: yup
                    .string()
                    .required("Required")
                    .matches(/^20((0[5-9])|([1-9][0-9]))$/, "Release Year minimum is 2005"),
                numberOfPages: yup
                    .number()
                    .required("Required")
                    .typeError("Number of page must be number")
                    .positive("Number of page must be positive number"),
                length: yup
                    .number()
                    .required("Required")
                    .typeError("length must be number")
                    .positive("length must be positive number"),
                width: yup
                    .number()
                    .required("Required")
                    .typeError("Width must be number")
                    .positive("Width must be positive number"),
                weight: yup
                    .number()
                    .required("Required")
                    .typeError("Weight must be number")
                    .positive("Weight must be positive number"),
                stock: yup
                    .number()
                    .typeError("Stock must be number")
                    .required("Required"),
                price: yup
                    .number()
                    .required("Required")
                    .typeError("Price must be number")
                    .positive("Price must be positive number"),
                condition: yup
                    .string()
                    .required("Required")
                    .matches(/^(NEW|PRELOVED)$/),
                coverType: yup
                    .string()
                    .required("Required")
                    .matches(/^(EBOOK|HARD COVER)$/),
                discount: yup
                    .string()
                    .matches(/^[0-9][0-9]?$|^100$/, "Discount range must be 1-100"),
                language: yup.string().required("Required"),
                isbn: yup.string(),
                authorId: yup.string().required("Required"),
                categoryIds: yup.array().of(yup.string()),
            });
            try {
                await schema.validate(data);
            }
            catch (err) {
                const errors = err.errors;
                if (err.name === "ValidationError")
                    throw new apollo_server_errors_1.ApolloError(errors.join(", "));
                throw new apollo_server_errors_1.ApolloError(err.name);
            }
        }
        default:
            break;
    }
};
exports.default = validateSchema;
