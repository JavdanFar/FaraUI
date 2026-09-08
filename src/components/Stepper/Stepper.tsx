import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Stepper.module.css";

export interface StepperStep {
  label: string;
  description?: string;
  content?: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  activeStep: number;
  completedSteps: Set<number>;
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  completedSteps,
  onStepClick,
  orientation = "horizontal",
  className,
}: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <div>
      <div
        className={clsx(styles.stepper, isVertical && styles.stepperVertical, className)}
        role="list"
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isActive = index === activeStep;
          const isLast = index === steps.length - 1;
          const isClickable = Boolean(onStepClick) && (isCompleted || isActive);

          const header = (
            <>
              <span
                className={clsx(
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                )}
              >
                {isCompleted ? (
                  <svg
                    className={styles.checkIcon}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              <span className={styles.textColumn}>
                <span className={clsx(styles.label, isActive && styles.labelActive)}>
                  {step.label}
                </span>
                {step.description && <span className={styles.description}>{step.description}</span>}
              </span>
            </>
          );

          return (
            <div
              key={index}
              className={clsx(styles.step, isVertical && styles.stepVertical)}
              role="listitem"
            >
              {isClickable ? (
                <button
                  type="button"
                  className={clsx(styles.header, styles.headerClickable)}
                  onClick={() => onStepClick?.(index)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {header}
                </button>
              ) : (
                <div className={styles.header} aria-current={isActive ? "step" : undefined}>
                  {header}
                </div>
              )}

              {isVertical ? (
                <>
                  {!isLast && (
                    <div
                      className={clsx(
                        styles.connectorVertical,
                        isCompleted && styles.connectorCompleted,
                      )}
                    />
                  )}
                  {isActive && step.content && (
                    <div key={activeStep} className={clsx(styles.content, styles.contentVertical)}>
                      {step.content}
                    </div>
                  )}
                </>
              ) : (
                !isLast && (
                  <div
                    className={clsx(styles.connector, isCompleted && styles.connectorCompleted)}
                  />
                )
              )}
            </div>
          );
        })}
      </div>

      {!isVertical && steps[activeStep]?.content && (
        <div key={activeStep} className={styles.content}>
          {steps[activeStep].content}
        </div>
      )}
    </div>
  );
}
