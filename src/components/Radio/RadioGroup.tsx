import { Radio } from "./Radio";
import styles from "./Radio.module.css";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({ name, options, value, onChange, disabled = false }: RadioGroupProps) {
  return (
    <div className={styles.group}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          label={opt.label}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
