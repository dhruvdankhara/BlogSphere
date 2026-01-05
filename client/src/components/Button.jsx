function Button({ children, className, disabled = false, ...props }) {
  return (
    <button
      className={`rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:text-base ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
