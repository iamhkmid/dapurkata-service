import { TGQLFooterSocialMedia } from "../../../types/footerInfo";
import {
  TFooterInfoMutation,
  TFooterInfoQuery,
  TPublisher,
  TPublisherMutation,
  TPublisherQuery,
} from "../../../types/graphql";

export const Query: TFooterInfoQuery = {
  footerPhone: async (_, __, { db }) => {
    const footerInfo = await db.footerInfo.findFirst({
      where: { type: "phone" },
    });
    return {
      id: footerInfo.id,
      type: footerInfo.type,
      phone: footerInfo.value,
    };
  },
  footerAddress: async (_, __, { db }) => {
    const footerInfo = await db.footerInfo.findFirst({
      where: { type: "address" },
    });
    return {
      id: footerInfo.id,
      type: footerInfo.type,
      address: footerInfo.value,
    };
  },
  footerMessage: async (_, __, { db }) => {
    const footerInfo = await db.footerInfo.findFirst({
      where: { type: "message" },
    });
    return {
      id: footerInfo.id,
      type: footerInfo.type,
      message: footerInfo.value,
    };
  },
  footerSocialMedia: async (_, __, { db }) => {
    const footerInfo = await db.footerInfo.findMany({
      where: { type: "social_media" },
    });

    const socialMedia = footerInfo.reduce((acc, curr) => {
      const { id, isEnabled, type, value } = curr;
      const values = JSON.parse(value);
      const name = values["name"] || "";
      const url = values["url"] || "/";
      return [...acc, { id, isEnabled, type, name, url }];
    }, [] as TGQLFooterSocialMedia[]);

    return socialMedia;
  },
};

export const Mutation: TFooterInfoMutation = {
  updateFooterPhone: async (_, { id, phone }, { db }) => {
    const updatePhone = await db.footerInfo.update({
      where: { id },
      data: { value: phone },
    });
    return {
      id: updatePhone.id,
      type: updatePhone.type,
      phone: updatePhone.value,
    };
  },
  updateFooterAddress: async (_, { id, address }, { db }) => {
    const updateAddress = await db.footerInfo.update({
      where: { id },
      data: { value: address },
    });
    return {
      id: updateAddress.id,
      type: updateAddress.type,
      address: updateAddress.value,
    };
  },
  updateFooterMessage: async (_, { id, message }, { db }) => {
    const updateMessage = await db.footerInfo.update({
      where: { id },
      data: { value: message },
    });
    return {
      id: updateMessage.id,
      type: updateMessage.type,
      message: updateMessage.value,
    };
  },
  updateFooterSocialMedia: async (_, { id, url, isEnabled }, { db }) => {
    const findAddress = await db.footerInfo.findUnique({
      where: { id },
      select: { value: true },
    });
    const name = JSON.parse(findAddress.value)["name"];
    const updateAddress = await db.footerInfo.update({
      where: { id },
      data: { value: JSON.stringify({ name, url }), isEnabled },
    });
    const updateAddresVal = JSON.parse(updateAddress.value);
    return {
      id: updateAddress.id,
      isEnabled: updateAddress.isEnabled,
      type: updateAddress.type,
      name: updateAddresVal["name"],
      url: updateAddresVal["url"] || "/",
    };
  },
};

export const Publisher: TPublisher = {
  Book: async ({ id }, _, { db }) => {
    const Publisher = await db.publisher.findUnique({
      where: { id },
      select: { Book: true },
    });
    return Publisher.Book;
  },
};
