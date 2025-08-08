export type Subcategory = {
  id: string;
  name: string;
  icon: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
  // When true, the category is kept for data consistency but hidden from selection lists
  isLegacy?: boolean;
};
