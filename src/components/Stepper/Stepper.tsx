import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Stepper.module.css";

export interface StepperStep {
  label: string;
  description?: string;
  content?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  activeStep: number;
  completedSteps?: Set<number>;
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const NO_COMPLETED_STEPS: Set<number> = new Set();

export function Stepper({
  steps,
  activeStep,
  completedSteps = NO_COMPLETED_STEPS,
  onStepClick,
  orientation = "horizontal",
  className,
  ref,
  ...rest
}: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      {...rest}
      ref={ref}
      className={className}
      data-fara-stepper
      data-orientation={orientation}
    >
      <div
        className={clsx(styles.stepper, isVertical && styles.stepperVertical)}
        role="list"
        data-fara-stepper-list
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
                data-fara-stepper-circle
                data-active={isActive || undefined}
                data-completed={isCompleted || undefined}
              >
                {isCompleted ? (
                  <svg
                    className={styles.checkIcon}
                    data-fara-stepper-check-icon
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

              <span className={styles.textColumn} data-fara-stepper-text>
                <span
                  className={clsx(styles.label, isActive && styles.labelActive)}
                  data-fara-stepper-label
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className={styles.description} data-fara-stepper-description>
                    {step.description}
                  </span>
                )}
              </span>
            </>
          );

          return (
            <div
              key={index}
              className={clsx(styles.step, isVertical && styles.stepVertical)}
              role="listitem"
              data-fara-stepper-step
              data-active={isActive || undefined}
              data-completed={isCompleted || undefined}
            >
              {isClickable ? (
                <button
                  type="button"
                  className={clsx(styles.header, styles.headerClickable)}
                  data-fara-stepper-header
                  onClick={() => onStepClick?.(index)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {header}
                </button>
              ) : (
                <div
                  className={styles.header}
                  data-fara-stepper-header
                  aria-current={isActive ? "step" : undefined}
                >
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
                      data-fara-stepper-connector
                      data-completed={isCompleted || undefined}
                    />
                  )}
                  {isActive && step.content && (
                    <div
                      key={activeStep}
                      className={clsx(styles.content, styles.contentVertical)}
                      data-fara-stepper-content
                    >
                      {step.content}
                    </div>
                  )}
                </>
              ) : (
                !isLast && (
                  <div
                    className={clsx(styles.connector, isCompleted && styles.connectorCompleted)}
                    data-fara-stepper-connector
                    data-completed={isCompleted || undefined}
                  />
                )
              )}
            </div>
          );
        })}
      </div>

      {!isVertical && steps[activeStep]?.content && (
        <div key={activeStep} className={styles.content} data-fara-stepper-content>
          {steps[activeStep].content}
        </div>
      )}
    </div>
  );
}
