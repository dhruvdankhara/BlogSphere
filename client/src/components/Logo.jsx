function Logo({ tetxColor = "text-indigo-600", textSize = "text-2xl" }) {
  return (
    <h1 className={`font-bold text-indigo-950 ${textSize}`}>
      Blog<span className={`text-indigo-600`}>Sphere</span>
    </h1>
  );
}

export default Logo;
