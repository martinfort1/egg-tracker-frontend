"use client"

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Input } from "./input";

type PriceInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<NumericFormatProps, "onValueChange" | "value" | "name" | "customInput"> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  defaultValue?: number | string;
};

export function PriceInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue = 0,
  ...props
}: PriceInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as never}
      render={({ field }) => (
        <NumericFormat
          {...props}
          value={field.value ?? ""}
          onValueChange={(values) => {
            field.onChange(values.floatValue ?? 0);
          }}
          thousandSeparator="."
          decimalSeparator="," 
          allowNegative={false}
          customInput={Input}
          type="text"
          inputMode="decimal"
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
