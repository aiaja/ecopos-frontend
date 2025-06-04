import  { UserForm } from '@/components/users/user/user-form';

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <UserForm />
    </div>
  );
}