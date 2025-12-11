// src/components/MethodCard.tsx
import type { Method } from "./ResultsScreen";

interface MethodCardProps {
  method: Method;
  isRecommended: boolean;
}

export function MethodCard({ method, isRecommended }: MethodCardProps) {
  const { icon, name, type, pros, cons } = method;

  return (
    <div
      className={
        "method-card card shadow-sm d-flex flex-column position-relative " +
        (isRecommended ? "border-primary" : "border-light")
      }
    >
      {/* Recommended badge at top-right */}
      {isRecommended && (
        <span
          className="badge bg-primary position-absolute"
          style={{ top: 10, right: 10 }}
        >
          Recommended
        </span>
      )}

      <div className="card-body d-flex flex-column">
        {/* Name */}
        <h5 className="card-title mb-2 text-center">{name}</h5>

        {/* Icon image in soft circle */}
        <div className="d-flex justify-content-center mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 128,
              height: 128,
              backgroundColor: "#f7f7f7",
            }}
          >
            <img
              src={icon}
              alt={name}
              style={{ width: 120, height: 120, objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Hormones + Frequency as chips */}
        <div className="d-flex justify-content-center gap-2 mb-2 small">
          <span className="badge rounded-pill bg-light text-dark border">
            {type}
          </span>
          <span className="badge rounded-pill bg-light text-muted border">
            {method.tagline}
          </span>
        </div>

        {/* Pros */}
        <div className="mb-2">
          <strong className="d-block mb-1">Pros</strong>
          <ul className="mb-2 small">
            {pros.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="mb-3">
          <strong className="d-block mb-1">Cons</strong>
          <ul className="mb-0 small">
            {cons.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Learn more button pinned to bottom */}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm mt-auto w-100"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}