export type TNotification = {
  id: string;
  title: string;
  message: string;
  valueName: string;
  valueId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLNotification = TNotification;
