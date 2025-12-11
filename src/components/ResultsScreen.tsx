// src/components/ResultsScreen.tsx
import React, { useState } from "react";
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
  efficacyPerfectUse?: string;
  efficacyTypicalUse?: string;
  hormones?: string;
  frequency?: string;
  mechanism?: string;
  shouldAvoid?: string[];
  sideEffects?: string[];
  bestFor?: string[];
}

export interface ResultsScreenProps {
  methods: Method[];
  recommended: Set<MethodId>;
  estrogenContraindicated: boolean;
}

export function ResultsScreen({
  methods,
  recommended,
}: ResultsScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  // 🔹 Recommended methods float to the top
  const sortedMethods = [...methods].sort((a, b) => {
    const aRec = recommended.has(a.id) ? 1 : 0;
    const bRec = recommended.has(b.id) ? 1 : 0;
    return bRec - aRec;
  });

  // 🔹 Determine columns dynamically based on screen width
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  let columnsPerRow = 3;

  if (screenWidth < 600) {
    columnsPerRow = 1;
  } else if (screenWidth < 900) {
    columnsPerRow = 2;
  } else {
    columnsPerRow = 3;
  }
  const methodRows: Method[][] = [];
  for (let i = 0; i < sortedMethods.length; i += columnsPerRow) {
    methodRows.push(sortedMethods.slice(i, i + columnsPerRow));
  }

  return (
    <div className="step step-results">
      <h1 className="text-center" style={{ color: "#020144" }}>
        Birth Control Options
      </h1>
      <div style={{ height: "2rem" }} />

      {/* 🔹 CSS grid instead of Bootstrap row/col */}
      <div className="results-grid mt-3">
        {methodRows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((m) => {
              const isRecommended = recommended.has(m.id);
            //   const isSelected = selectedMethod?.id === m.id;

              return (
                <MethodCard
                  key={m.id}
                  method={m}
                  isRecommended={isRecommended}
                  onSelect={() =>
                    setSelectedMethod((prev) =>
                      prev?.id === m.id ? null : m
                    )
                  }
                  isSelected={selectedMethod?.id === m.id}
                />
              );
            })}

            {row.some((m) => m.id === selectedMethod?.id) && selectedMethod && (
              <div className="results-details-row" key={`details-${rowIndex}`}>
                <h3 className="h5 mb-3">{selectedMethod.name}</h3>

                <div className="small mb-3">
                  {selectedMethod.efficacyPerfectUse && (
                    <div>
                      <strong>Efficacy (perfect use):</strong>{" "}
                      {selectedMethod.efficacyPerfectUse}
                    </div>
                  )}
                  {selectedMethod.efficacyTypicalUse && (
                    <div>
                      <strong>Efficacy (typical use):</strong>{" "}
                      {selectedMethod.efficacyTypicalUse}
                    </div>
                  )}
                  {selectedMethod.hormones && (
                    <div>
                      <strong>Hormones:</strong> {selectedMethod.hormones}
                    </div>
                  )}
                  {!selectedMethod.hormones && (
                    <div>
                      <strong>Hormones:</strong> {selectedMethod.type}
                    </div>
                  )}
                  {selectedMethod.frequency && (
                    <div>
                      <strong>Frequency:</strong> {selectedMethod.frequency}
                    </div>
                  )}
                  {selectedMethod.mechanism && (
                    <div>
                      <strong>Mechanism:</strong> {selectedMethod.mechanism}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "2rem" }}></div>

                {(selectedMethod.shouldAvoid?.length ||
                  selectedMethod.sideEffects?.length ||
                  selectedMethod.bestFor?.length) && (
                  <div className="row small mt-3">
                    {selectedMethod.shouldAvoid?.length ? (
                      <div className="col-md-4 mb-3">
                        <strong className="d-block mb-1">Should avoid if</strong>
                        <ul className="mb-0">
                          {selectedMethod.shouldAvoid.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {selectedMethod.sideEffects?.length ? (
                      <div className="col-md-4 mb-3">
                        <strong className="d-block mb-1">Possible side effects</strong>
                        <ul className="mb-0">
                          {selectedMethod.sideEffects.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {selectedMethod.bestFor?.length ? (
                      <div className="col-md-4 mb-3">
                        <strong className="d-block mb-1">Best for patients who</strong>
                        <ul className="mb-0">
                          {selectedMethod.bestFor.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}