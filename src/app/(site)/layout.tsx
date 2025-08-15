import Navbar from "@/components/ui/Navbar";

export const metadata = {
    title: 'EasyTicket',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
