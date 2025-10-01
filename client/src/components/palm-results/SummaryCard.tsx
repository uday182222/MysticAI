import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles } from "lucide-react";

interface CircularProgressProps {
  value: number;
  label: string;
  color: string;
  delay: number;
}

function CircularProgress({ value, label, color, delay }: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="transform -rotate-90 w-28 h-28">
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
            className="text-2xl font-bold"
            style={{ color }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 mt-2">{label}</span>
    </div>
  );
}

interface SummaryCardProps {
  imageUrl: string;
  personalityOverview: string;
  traits?: string[];
  lifeEnergy: number;
  emotionalBalance: number;
  careerPotential: number;
}

export function SummaryCard({
  imageUrl,
  personalityOverview,
  traits = [],
  lifeEnergy,
  emotionalBalance,
  careerPotential,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100/20 to-blue-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
        
        <CardContent className="relative p-8 pt-9">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left: Palm Image & Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md ring-2 ring-violet-100">
                    <img
                      src={imageUrl}
                      alt="Your Palm"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Sparkles className="w-6 h-6 text-violet-600" />
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Your Palm Insights
                    </h2>
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-gray-700 leading-relaxed"
                  >
                    {personalityOverview}
                  </motion.p>

                  {traits.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-wrap gap-2"
                    >
                      {traits.map((trait, index) => (
                        <motion.div
                          key={trait}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        >
                          <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-3 py-1">
                            {trait}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Progress Rings */}
            <div className="lg:border-l lg:border-gray-200/50 lg:pl-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
                Life Metrics
              </h3>
              <div className="space-y-6">
                <CircularProgress
                  value={lifeEnergy}
                  label="Life Energy"
                  color="#8b5cf6"
                  delay={0.2}
                />
                <CircularProgress
                  value={emotionalBalance}
                  label="Emotional Balance"
                  color="#a855f7"
                  delay={0.4}
                />
                <CircularProgress
                  value={careerPotential}
                  label="Career Potential"
                  color="#3b82f6"
                  delay={0.6}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

