"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const validateUser_1 = require("../../utils/validateUser");
exports.Query = {
    recipient: async (_, { recipientId }, { db, user }) => {
        const recipient = await db.recipient.findUnique({
            where: { id: recipientId },
            include: { City: { include: { Province: true } } },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: recipient === null || recipient === void 0 ? void 0 : recipient.userId,
            currRole: user.role,
            currId: user.id,
        });
        return recipient;
    },
    recipients: async (_, { userId }, { db, user }) => {
        const findUser = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                Recipient: { include: { City: { include: { Province: true } } } },
            },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            currRole: user.role,
            currId: user.id,
        });
        return findUser.Recipient;
    },
};
exports.Mutation = {
    createRecipient: async (_, { data }, { api, user, db }) => {
        const { cityId, address, firstName, lastName, phone, email } = data;
        const resApi = await api.rajaOngkir.getCity({
            city_id: cityId,
        });
        const createRcpt = await db.recipient.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                City: {
                    connectOrCreate: {
                        where: { id: cityId },
                        create: {
                            id: cityId,
                            name: resApi.city_name,
                            postalCode: resApi.postal_code,
                            Province: {
                                connectOrCreate: {
                                    where: { id: resApi.province_id },
                                    create: { id: resApi.province_id, name: resApi.province },
                                },
                            },
                        },
                    },
                },
                address,
                User: { connect: { id: user.id } },
            },
            include: { City: { include: { Province: true } } },
        });
        return createRcpt;
    },
    updateRecipient: async (_, { data }, { api, user, db }) => {
        const { cityId, address, firstName, lastName, phone, recipientId, email } = data;
        const findRcpt = await db.recipient.findUnique({
            where: { id: recipientId },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: findRcpt === null || findRcpt === void 0 ? void 0 : findRcpt.userId,
            currRole: user.role,
            currId: user.id,
        });
        const resApi = await api.rajaOngkir.getCity({
            city_id: cityId,
        });
        const updateRcpt = await db.recipient.update({
            where: { id: recipientId },
            data: {
                firstName,
                lastName,
                email,
                phone,
                City: {
                    connectOrCreate: {
                        where: { id: cityId },
                        create: {
                            id: cityId,
                            name: resApi.city_name,
                            postalCode: resApi.postal_code,
                            Province: {
                                connectOrCreate: {
                                    where: { id: resApi.province_id },
                                    create: { id: resApi.province_id, name: resApi.province },
                                },
                            },
                        },
                    },
                },
                address,
            },
            include: { City: { include: { Province: true } } },
        });
        return updateRcpt;
    },
    deleteRecipient: async (_, { recipientId }, { user, db }) => {
        const findRcpt = await db.recipient.findUnique({
            where: { id: recipientId },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: findRcpt === null || findRcpt === void 0 ? void 0 : findRcpt.userId,
            currRole: user.role,
            currId: user.id,
        });
        const delRcpt = await db.recipient.delete({ where: { id: recipientId } });
        return Object.assign(Object.assign({}, delRcpt), { City: null });
    },
};
