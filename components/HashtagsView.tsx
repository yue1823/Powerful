import React from "react";

interface HashtagsViewProps {
  hashtags: string[];
}

export const HashtagsView: React.FC<HashtagsViewProps> = ({ hashtags }) => {
  const handleCopyAll = () => {
    const allHashtags = hashtags.join(" ");
    navigator.clipboard
      .writeText(allHashtags)
      .then(() => {
        console.log("Copied all hashtags");
      })
      .catch((err) => {
        console.error("Failed to copy all:", err);
      });
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          title="Copy all hashtags"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy All
        </button>
      </div>
      <div className="flex flex-wrap gap-2 p-4 rounded-lg">
        {hashtags.map((hashtag, index) => (
          <div key={index} className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {hashtag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashtagsView;
