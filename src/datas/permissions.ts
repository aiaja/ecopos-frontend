export interface Permission {
  id: number;
  name: string;
  guardName: string;
}

export const permissionsWeb: Permission[] = [
  { id: 1, name: "create category", guardName: "web" },
  { id: 2, name: "read category", guardName: "web" },
  { id: 3, name: "update category", guardName: "web" },
  { id: 4, name: "delete category", guardName: "web" },
  { id: 5, name: "create product", guardName: "web" },
  { id: 6, name: "read product", guardName: "web" },
];

export const permissionsMobile: Permission[] = [
  { id: 1, name: "create category", guardName: "sanctum" },
  { id: 2, name: "read category", guardName: "sanctum" },
  { id: 3, name: "update category", guardName: "sanctum" },
  { id: 4, name: "delete category", guardName: "sanctum" },
  { id: 5, name: "create product", guardName: "sanctum" },
  { id: 6, name: "read product", guardName: "sanctum" },
];