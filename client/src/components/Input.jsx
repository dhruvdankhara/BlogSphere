import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    placeholder,
    value,
    setValue,
    ...props
  },
  ref
) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-base font-medium capitalize text-gray-900"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 ${className}`}
        id={id}
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </div>
  );
});

export default Input;
