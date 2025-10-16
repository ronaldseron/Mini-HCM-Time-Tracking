const PunchCard = ({ handlePunchIn, handlePunchOut, loading, isPunchedIn }) => {
  return (
    <div className="flex-1 w-170 flex self-center items-stretch justify-center my-8 gap-12">
      <button
        onClick={handlePunchIn}
        className={`flex-1 flex items-center justify-center bg-accent text-white rounded-4xl text-5xl font-extrabold ${
          isPunchedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={loading || isPunchedIn}
      >
        {loading ? "Time In..." : "Time In"}
      </button>

      <button
        onClick={handlePunchOut}
        className={`flex-1 flex items-center justify-center bg-accent text-white rounded-4xl text-5xl font-extrabold ${
          !isPunchedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={loading || !isPunchedIn}
      >
        Time Out
      </button>
    </div>
  );
};

export default PunchCard;
