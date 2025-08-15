import HeroSearch from "@/components/home/HeroSearch";
import Steps from "@/components/home/Steps";

export default function HomePage() {
    return (
        <main>
            <section className="container mx-auto px-4 pt-8">
                <HeroSearch />
            </section>

            <section className="container mx-auto px-4">
                <Steps />
            </section>
        </main>
    );
}
