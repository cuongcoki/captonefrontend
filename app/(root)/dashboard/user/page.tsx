import UsersPage from "@/components/shared/dashboard/users/Users";
import { UserSearchParams } from "@/types/userTypes";

type Props = {
  searchParams: UserSearchParams;
};

export default function Page({ searchParams }: Props) {
  return (
      <UsersPage searchParams={searchParams} />
  );
}
