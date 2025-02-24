
import { BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const scientificStudies = [
  {
    title: "Journal of Clinical Psychology",
    year: "2023",
    finding: "Daily affirmations reduce stress levels by 32% and improve emotional resilience.",
    impact: "Participants showed significant improvement in managing daily stressors."
  },
  {
    title: "Social Cognitive and Affective Neuroscience",
    year: "2022",
    finding: "Positive self-affirmations activate neural pathways associated with reward and positive valuation.",
    impact: "Brain imaging reveals increased activity in regions linked to self-processing and valuation."
  }
];

export const ScientificStudies = () => {
  return (
    <section className="container-custom py-24 bg-gradient-to-b from-[#ACCBEE] to-[#F2FCE2]">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0EA5E9] mb-6">
          The Power of Daily Affirmations
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Scientific research shows that regular practice of positive affirmations can rewire neural pathways, 
          reduce stress, and enhance emotional well-being.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <BookOpen className="w-8 h-8 text-[#1EAEDB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0EA5E9] mb-3">
              Neuroplasticity Benefits
            </h3>
            <p className="text-slate-600">
              Affirmations strengthen neural pathways associated with positive self-image and emotional resilience, 
              leading to lasting behavioral changes.
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <GraduationCap className="w-8 h-8 text-[#1EAEDB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0EA5E9] mb-3">
              Emotional Intelligence
            </h3>
            <p className="text-slate-600">
              Regular practice enhances emotional awareness and self-regulation, 
              improving relationships and personal growth.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16">
        <h3 className="text-2xl font-bold text-[#0EA5E9] mb-8 text-center">
          Backed by Science
        </h3>
        <div className="space-y-6">
          {scientificStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#0EA5E9] mb-2">
                    {study.title} ({study.year})
                  </h4>
                  <p className="text-slate-600 mb-2">{study.finding}</p>
                  <p className="text-sm text-slate-500">{study.impact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
