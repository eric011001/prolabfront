interface Params {
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

const LoadingCard = ({ subtitle, title, showSubtitle = true }: Params) => {
  return (
    <div className="block cursor-pointer max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      {showSubtitle ? (
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          {subtitle}
        </p>
      ) : ''}
    </div>
  );
};

export default LoadingCard;