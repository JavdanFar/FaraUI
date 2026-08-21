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
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  completedSteps,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div>
      <div className={clsx(styles.stepper, className)} role="list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isActive = index === activeStep;
          const isLast = index === steps.length - 1;
          const isClickable = Boolean(onStepClick) && (isCompleted || isActive);

          return (
            <div key={index} className={styles.step} role="listitem">
              <div className={styles.circleColumn}>
                <span
                  className={clsx(
                    styles.circle,
                    isClickable && styles.circleClickable,
                    isActive && styles.circleActive,
                    isCompleted && styles.circleCompleted,
                  )}
                  onClick={() => isClickable && onStepClick?.(index)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <svg
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
              </div>

              <div className={styles.textColumn}>
                <div className={clsx(styles.label, isActive && styles.labelActive)}>
                  {step.label}
                </div>
                {step.description && <div className={styles.description}>{step.description}</div>}
              </div>

              {!isLast && (
                <div className={clsx(styles.connector, isCompleted && styles.connectorCompleted)} />
              )}
            </div>
          );
        })}
      </div>

      {steps[activeStep]?.content && (
        <div className={styles.content}>{steps[activeStep].content}</div>
      )}
    </div>
  );
}
