const NoData = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full my-20">
            <div className="text-6xl mb-4">😢</div>
            <p className="text-gray-600 mt-2">{title || "No data found"}</p>
        </div>
    );
};

export default NoData;
