function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <p className="text-sm font-bold text-white">로딩중입니다...</p>
    </div>
  );
}

export default LoadingOverlay;
