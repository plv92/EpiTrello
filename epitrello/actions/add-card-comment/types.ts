export type AddCardCommentInput = {
  cardId: string;
  userId: string;
  content: string;
};

export type AddCardCommentOutput = {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    };
  };
};
