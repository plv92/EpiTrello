export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  lists: string[];
}

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: "blank",
    name: "Board vierge",
    description: "Commencez avec un board vide",
    lists: [],
  },
  {
    id: "kanban",
    name: "Kanban simple",
    description: "À faire, En cours, Terminé",
    lists: ["À faire", "En cours", "Terminé"],
  },
  {
    id: "agile",
    name: "Agile/Scrum",
    description: "Backlog, À faire, En cours, Revue, Terminé",
    lists: ["Backlog", "À faire", "En cours", "Revue", "Terminé"],
  },
  {
    id: "project",
    name: "Gestion de projet",
    description: "Idées, Planification, En cours, Terminé",
    lists: ["Idées", "Planification", "En cours", "Terminé"],
  },
];
