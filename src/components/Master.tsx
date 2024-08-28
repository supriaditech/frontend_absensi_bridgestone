import Sidebar from "./navigation/Sidebar";
import StickyNavbar from "./navigation/StickyNavbar";

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
        <StickyNavbar title={title}>{children}</StickyNavbar>
      )}
    </div>
  );
}
