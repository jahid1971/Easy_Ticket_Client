import { Search, CheckSquare, CreditCard } from "lucide-react";

const items = [
    {
        title: "Search",
        desc: "Enter your starting point, destination, and travel date to explore available buses.",
        icon: Search,
    },
    {
        title: "Select",
        desc: "Choose your preferred bus, view seat layout, and pick your seat.",
        icon: CheckSquare,
    },
    {
        title: "Pay",
        desc: "Complete your booking securely using cards, mobile banking, or other options.",
        icon: CreditCard,
    },
];

export function Steps() {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-center text-2xl font-semibold">
                <span className="text-primary">Buy tickets</span> in 3 easy steps
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {items.map((it, idx) => (
                    <div key={it.title} className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <it.icon className="size-5" />
                            </div>
                            <div className="ml-auto flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                {idx + 1}
                            </div>
                        </div>
                        <h3 className="text-lg font-medium">{it.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Steps;
