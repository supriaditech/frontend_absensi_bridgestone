import Sidebar from "./navigation/Sidebar";

export interface MasterProps {
  children: React.ReactNode;
  title: string;
  userType: string;
}

export default function Master({ children, title, userType }: MasterProps) {
  return (
    <div>
      {userType === "ADMIN" ? (
        <Sidebar title={title}>{children}</Sidebar>
      ) : (
        <div></div>
      )}
    </div>
  );
}
