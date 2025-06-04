import { UserForm } from "@/components/users/user/user-form";

export default function EditUserPage({ params }: { params: { userId: string } }) {
 
  return (
    <div>
      <UserForm mode="edit" userId={params.userId} />
    </div>
  );
  
}