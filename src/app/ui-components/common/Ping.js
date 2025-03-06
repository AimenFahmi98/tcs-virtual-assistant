function Ping({ children, isPing }) {
  return (
    <div className="relative">
      {isPing && (
        <>
          <span className="absolute -right-0.5 -top-0.5 z-50 h-2 w-2 animate-ping rounded-full bg-red-500" />
          <span className="absolute -right-0.5 -top-0.5 z-50 h-2 w-2 rounded-full bg-red-500" />
        </>
      )}
      {children}
    </div>
  );
}

export default Ping;
