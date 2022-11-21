"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyNowItems = exports.buyNowWeight = exports.sCartItems = exports.sCartWeight = exports.courierCost = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const cuid_1 = __importDefault(require("cuid"));
const courierCost = async (props) => {
    const { api, courier, destination, service, weight } = props;
    const costs = await api.rajaOngkir.getCost({
        origin: process.env.ORIGIN_CITY_ID,
        courier,
        destination,
        weight,
    });
    const cost = costs.costs.find((val) => val.service === service);
    if (!cost)
        throw new apollo_server_express_1.ApolloError("Courier service not found");
    return {
        cost: cost.cost[0].value,
        code: courier,
        service: cost.service,
        description: cost.description,
    };
};
exports.courierCost = courierCost;
const sCartWeight = (props) => {
    const { shoppingCart } = props;
    const maxWeight = Number(process.env.MAX_COURIER_WEIGHT);
    const cartWeight = shoppingCart.reduce((acc, curr) => acc + curr.Book.weight * curr.amount, 0);
    if (cartWeight > maxWeight)
        throw new apollo_server_express_1.ApolloError("Maksimal berat keranjang 30kg.");
    return cartWeight;
};
exports.sCartWeight = sCartWeight;
const sCartItems = (props) => {
    const { shoppingCart, courier } = props;
    const itemDetails = shoppingCart.reduce((acc, curr) => [
        ...acc,
        {
            id: (0, cuid_1.default)(),
            itemId: curr.Book.id,
            name: curr.Book.title,
            price: curr.Book.price - (curr.Book.price * curr.Book.discount) / 100,
            quantity: curr.amount,
        },
    ], []);
    const gross_amount = shoppingCart.reduce((acc, curr) => acc +
        (curr.Book.price - (curr.Book.price * curr.Book.discount) / 100) *
            curr.amount, 0);
    return {
        item_details: [
            ...itemDetails,
            {
                id: (0, cuid_1.default)(),
                itemId: courier.code,
                name: `Ongkos Kirim ${courier.code.toUpperCase()} - ${courier.service}`,
                price: courier.cost,
                quantity: 1,
            },
        ],
        gross_amount: gross_amount + courier.cost,
    };
};
exports.sCartItems = sCartItems;
const buyNowWeight = async (props) => {
    const { book, amount } = props;
    const weight = book.weight * amount;
    const maxWeight = Number(process.env.MAX_COURIER_WEIGHT);
    if (weight > maxWeight)
        throw new apollo_server_express_1.ApolloError("Maksimal berat keranjang 30kg.");
    return weight;
};
exports.buyNowWeight = buyNowWeight;
const buyNowItems = (props) => {
    const { book, courier, amount } = props;
    const gross_amount = (book.price - (book.price * book.discount) / 100) * amount;
    return {
        item_details: [
            {
                id: (0, cuid_1.default)(),
                itemId: courier.code,
                name: `Ongkos Kirim ${courier.code.toUpperCase()} - ${courier.service}`,
                price: courier.cost,
                quantity: 1,
            },
            {
                id: (0, cuid_1.default)(),
                itemId: book.id,
                name: book.title,
                price: book.price - (book.price * book.discount) / 100,
                quantity: amount,
            },
        ],
        gross_amount: gross_amount + courier.cost,
    };
};
exports.buyNowItems = buyNowItems;
