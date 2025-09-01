import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AstrologyAnalysisResult } from "@shared/schema";
import { Circle, Star, Sun, Moon } from "lucide-react";

interface KundliChartProps {
  kundliData: AstrologyAnalysisResult['kundliChart'];
}

const HOUSE_POSITIONS = [
  { x: 250, y: 50, rotation: 0 },    // House 1 (Top)
  { x: 350, y: 100, rotation: 30 },  // House 2 (Top Right)
  { x: 400, y: 200, rotation: 60 },  // House 3 (Right)
  { x: 350, y: 300, rotation: 90 },  // House 4 (Bottom Right)
  { x: 250, y: 350, rotation: 120 }, // House 5 (Bottom)
  { x: 150, y: 300, rotation: 150 }, // House 6 (Bottom Left)
  { x: 100, y: 200, rotation: 180 }, // House 7 (Left)
  { x: 150, y: 100, rotation: 210 }, // House 8 (Top Left)
  { x: 200, y: 75, rotation: 240 },  // House 9
  { x: 300, y: 75, rotation: 270 },  // House 10  
  { x: 375, y: 150, rotation: 300 }, // House 11
  { x: 325, y: 250, rotation: 330 }, // House 12
];

const PLANET_COLORS = {
  sun: "#FFD700",
  moon: "#C0C0C0", 
  mercury: "#90EE90",
  venus: "#FFC0CB",
  mars: "#FF6347",
  jupiter: "#FFD700",
  saturn: "#8B4513",
  rahu: "#800080",
  ketu: "#800080"
};

const PLANET_SYMBOLS = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  rahu: "☊",
  ketu: "☋"
};

export function KundliChart({ kundliData }: KundliChartProps) {
  const getPlanetSymbol = (planetName: string) => {
    const key = planetName.toLowerCase() as keyof typeof PLANET_SYMBOLS;
    return PLANET_SYMBOLS[key] || planetName.charAt(0);
  };

  const getPlanetColor = (planetName: string) => {
    const key = planetName.toLowerCase() as keyof typeof PLANET_COLORS;
    return PLANET_COLORS[key] || "#666";
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Kundli Chart Visualization */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="text-center">
          <CardTitle className="text-indigo-800 flex items-center justify-center gap-2">
            <Star className="h-5 w-5" />
            Kundli Chart (Birth Chart)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative w-[500px] h-[400px]">
            {/* Chart Background */}
            <svg width="500" height="400" className="absolute inset-0">
              {/* Outer Circle */}
              <circle
                cx="250"
                cy="200"
                r="180"
                fill="none"
                stroke="#4338ca"
                strokeWidth="2"
                className="opacity-30"
              />
              
              {/* Inner Circle */}
              <circle
                cx="250"
                cy="200"
                r="120"
                fill="none"
                stroke="#4338ca"
                strokeWidth="1"
                className="opacity-20"
              />

              {/* House Division Lines */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x1 = 250 + Math.cos(angle) * 120;
                const y1 = 200 + Math.sin(angle) * 120;
                const x2 = 250 + Math.cos(angle) * 180;
                const y2 = 200 + Math.sin(angle) * 180;
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#4338ca"
                    strokeWidth="1"
                    className="opacity-30"
                  />
                );
              })}
            </svg>

            {/* Houses */}
            {kundliData.houses.map((house, index) => {
              const position = HOUSE_POSITIONS[index] || HOUSE_POSITIONS[0];
              const planetsInHouse = house.planets || [];
              
              return (
                <div
                  key={house.number}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: position.x,
                    top: position.y,
                  }}
                >
                  {/* House Number and Sign */}
                  <div className="text-center bg-white rounded-lg border border-indigo-200 p-2 shadow-sm min-w-[80px]">
                    <div className="font-bold text-indigo-800 text-sm">
                      {house.number}
                    </div>
                    <div className="text-xs text-indigo-600 truncate">
                      {house.sign}
                    </div>
                    
                    {/* Planets in this house */}
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {planetsInHouse.map((planet, planetIndex) => (
                        <div
                          key={planetIndex}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: getPlanetColor(planet) }}
                          title={planet}
                        >
                          {getPlanetSymbol(planet)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Central Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg border-2 border-indigo-300 p-3 shadow-lg">
                <div className="text-center">
                  <Sun className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-xs font-semibold text-indigo-800">
                    Kundli
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planetary Positions Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Circle className="h-5 w-5" />
            Planetary Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(kundliData.planetaryPositions).map(([planet, data]) => (
            <div key={planet} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getPlanetColor(planet) }}
                >
                  {getPlanetSymbol(planet)}
                </div>
                <div>
                  <div className="font-semibold capitalize text-gray-800">
                    {planet}
                  </div>
                  <div className="text-sm text-gray-600">
                    {data.sign} • House {data.house}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {data.degrees.toFixed(1)}°
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Houses Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Star className="h-5 w-5" />
            Houses & Their Significance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kundliData.houses.map((house) => (
              <div key={house.number} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-indigo-800">
                    House {house.number}
                  </h4>
                  <Badge variant="secondary">{house.sign}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Ruling:</span> {house.ruling}
                </div>
                {house.planets && house.planets.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {house.planets.map((planet, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: getPlanetColor(planet) }}
                      >
                        {getPlanetSymbol(planet)} {planet}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planetary Aspects */}
      {kundliData.aspects && kundliData.aspects.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Planetary Aspects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {kundliData.aspects.map((aspect, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getPlanetColor(aspect.from) }}
                    >
                      {getPlanetSymbol(aspect.from)}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getPlanetColor(aspect.to) }}
                    >
                      {getPlanetSymbol(aspect.to)}
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      {aspect.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{aspect.influence}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}