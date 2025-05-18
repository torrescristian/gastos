export type Subcategory = {
  id: number;
  name: string;
  icon: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  subcategories: Subcategory[];
};

export const categories = [
  {
    id: 1,
    name: "Alimentación",
    icon: "🍔",
    subcategories: [
      {
        id: 1,
        name: "Comida",
        icon: "🍔",
      },
    ],
  },
] as Category[];
