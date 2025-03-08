
import { StatCard } from "./StatCard";

export const StatsSection = () => {
  return (
    <section id="stats" className="container-custom py-12 md:py-16 bg-gradient-to-b from-[#F7F5F3] to-[#E7F0FD]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
        <StatCard
          number="10k+"
          label="Active Users"
          gradient="from-[#9b87f5] to-[#543ab7]"
        />
        <StatCard
          number="87%"
          label="Reduced Stress"
          gradient="from-[#543ab7] to-[#00acc1]"
        />
        <StatCard
          number="2M+"
          label="Affirmations"
          gradient="from-[#00acc1] to-[#9b87f5]"
        />
        <StatCard
          number="4.9"
          label="Rating"
          gradient="from-[#543ab7] to-[#9b87f5]"
        />
      </div>
    </section>
  );
};
