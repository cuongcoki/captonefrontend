import RenderTableUsers from "./table/users/RenderTable";
import { UserSearchParams } from "@/types/userTypes";

type Props = {
  searchParams: UserSearchParams;
};

export default function UsersPage({ searchParams }: Props) {
  return (
    <div className="!mb-15">
      <RenderTableUsers searchParams={searchParams} />
    </div>
  );
}
