import { Navbar } from "@/app/(marketing)/_components/navbar";

const DashboadrdLayout = ({
    children
}: {
    children: React.ReactNode;
 }) => {
    return (
        <div className="h-full">
            <Navbar />
            {children}
        </div>
    )
 };

export default DashboadrdLayout;