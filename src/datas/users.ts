export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    isOwner: boolean;
}
  
const users: User[] = [
    {
        id: 123,
        name: "Super Admin",
        email: "superadmin@admin.com",
        phone: "123-456-7890",
        address: "Alamat Pengguna",
        role: "admin",
        isOwner: true,
    },
  ];
  
export default users;