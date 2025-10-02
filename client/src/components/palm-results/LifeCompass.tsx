import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Briefcase, Leaf, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompassQuadrant {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  angle: number;
  score: number;
}

interface LifeCompassProps {
  onQuadrantClick?: (quadrantId: string) => void;
  scores: {
    love: number;
    career: number;
    health: number;
    future: number;
  };
}

export function LifeCompass({ onQuadrantClick, scores }: LifeCompassProps) {
  const quadrants: CompassQuadrant[] = [
    {
      id: "love",
      title: "Love",
      icon: <Heart className="w-6 h-6" />,
      color: "from-rose-500 to-pink-500",
      angle: 45,
      score: scores.love,
    },
    {
      id: "career",
      title: "Career",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      angle: 135,
      score: scores.career,
    },
    {
      id: "health",
      title: "Health",
      icon: <Leaf className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      angle: 225,
      score: scores.health,
    },
    {
      id: "future",
      title: "Future",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      angle: 315,
      score: scores.future,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="relative border-0 shadow-lg bg-card/70 backdrop-blur overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
        
        <CardContent className="p-8 pt-9">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Life Compass
            </h3>
            <p className="text-sm text-white/80">Click any quadrant to explore that area</p>
          </div>

          <div className="relative w-full max-w-md mx-auto aspect-square">
            {/* Center circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex items-center justify-center z-10"
            >
              <div className="text-center text-white">
                <div className="text-3xl font-bold">
                  {Math.round((scores.love + scores.career + scores.health + scores.future) / 4)}%
                </div>
                <div className="text-xs uppercase tracking-wider">Overall</div>
              </div>
            </motion.div>

            {/* Quadrants */}
            {quadrants.map((quadrant, index) => {
              const rotateAngle = quadrant.angle - 45;
              const translateDistance = 140;
              
              return (
                <motion.button
                  key={quadrant.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onQuadrantClick?.(quadrant.id)}
                  className={cn(
                    "absolute w-28 h-28 rounded-2xl shadow-lg",
                    "flex flex-col items-center justify-center gap-2",
                    "text-white transition-transform",
                    `bg-gradient-to-br ${quadrant.color}`
                  )}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${rotateAngle}deg) translate(0, -${translateDistance}px) rotate(-${rotateAngle}deg)`,
                  }}
                >
                  <div className="transform group-hover:scale-110 transition-transform">
                    {quadrant.icon}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    {quadrant.title}
                  </div>
                  <div className="text-lg font-bold">{quadrant.score}%</div>
                </motion.button>
              );
            })}

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {quadrants.map((_, index) => {
                const nextIndex = (index + 1) % quadrants.length;
                const angle1 = (quadrants[index].angle * Math.PI) / 180;
                const angle2 = (quadrants[nextIndex].angle * Math.PI) / 180;
                const centerX = 200;
                const centerY = 200;
                const distance = 140;
                
                const x1 = centerX + distance * Math.cos(angle1);
                const y1 = centerY + distance * Math.sin(angle1);
                const x2 = centerX + distance * Math.cos(angle2);
                const y2 = centerY + distance * Math.sin(angle2);
                
                return (
                  <motion.line
                    key={index}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

