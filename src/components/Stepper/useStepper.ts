import { useState } from "react";

export interface UseStepperOptions {
  totalSteps: number;
  onFinish?: () => void;
}

export function useStepper({ totalSteps, onFinish }: UseStepperOptions) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  const isLastStep = activeStep === totalSteps - 1;
  const isFirstStep = activeStep === 0;

  function goNext() {
    if (isFinished) return;

    // Mark the current step as completed the moment you move past it
    setCompletedSteps((prev) => new Set(prev).add(activeStep));

    if (isLastStep) {
      setIsFinished(true);
      onFinish?.();
      return;
    }

    setActiveStep((s) => s + 1);
  }

  function goBack() {
    if (isFirstStep || isFinished) return;
    setActiveStep((s) => s - 1);
  }

  // Jump directly to a step — only allowed for steps already completed or
  // the current one, so users can't skip ahead into unfinished territory
  function goToStep(index: number) {
    if (isFinished) return;
    if (index === activeStep || completedSteps.has(index)) {
      setActiveStep(index);
    }
  }

  function reset() {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setIsFinished(false);
  }

  return {
    activeStep,
    completedSteps,
    isFinished,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    goToStep,
    reset,
  };
}
