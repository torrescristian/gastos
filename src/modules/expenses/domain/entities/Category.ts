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
};
