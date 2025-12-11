// src/components/ResultsScreen.tsx
import { MethodCard } from "./MethodCard";

export type MethodId =
  | "combinedPill"
  | "progestinPill"
  | "patch"
  | "nuvaring"
  | "annovera"
  | "shot"
  | "diaphragm";

export interface Method {
  id: MethodId;
  name: string;
  type: "Estrogen" | "Progestin" | "Non Hormonal" | "Estrogen + Progestin";
  tagline: string;
  notes: string;
  pros: string[];
  cons: string[];
  icon: string;
}

export interface ResultsScreenProps {
  methods: Method[];
  recommended: Set<MethodId>;
  estrogenContraindicated: boolean;
}

export function ResultsScreen({
  methods,
  recommended,
  estrogenContraindicated
}: ResultsScreenProps) {
  // 🔹 Recommended methods float to the top
  const sortedMethods = [...methods].sort((a, b) => {
    const aRec = recommended.has(a.id) ? 1 : 0;
    const bRec = recommended.has(b.id) ? 1 : 0;
    return bRec - aRec;
  });

  return (
    <div className="step step-results">
      <h1 className="text-center" style={{ color: "#020144" }}>
        Birth Control Options
      </h1>
      <div style={{ height: "2rem" }} />

      {estrogenContraindicated}

      {/* 🔹 CSS grid instead of Bootstrap row/col */}
      <div className="results-grid mt-3">
        {sortedMethods.map((m) => {
          const isRecommended = recommended.has(m.id);

          return (
            <MethodCard key={m.id} method={m} isRecommended={isRecommended} />
          );
        })}
      </div>
    </div>
  );
}