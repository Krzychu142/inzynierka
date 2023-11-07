import React from "react";
import { Select } from "antd";
import "./sortSection.css";

const { Option } = Select;

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

const SortSelect: React.FC<SortSelectProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  return (
    <section className="sort-section">
      <b className="darker sort-section__b">{label}</b>
      <Select
        className="sort-section__select"
        value={value}
        onChange={(value) => onChange(value)}
        placeholder="Select sorting order"
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </section>
  );
};

export default SortSelect;
