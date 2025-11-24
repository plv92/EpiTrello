import { Card, List, CardAssignee, CardLabel, ChecklistItem, CardAttachment } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { 
  list: List;
  assignees: CardAssignee[];
  labels: CardLabel[];
  checklist: ChecklistItem[];
  attachments: CardAttachment[];
};
