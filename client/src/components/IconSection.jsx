import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const IconSection = ({ post, handleLike, handleComment, handleSave }) => {
  const {
    _id,
    likedByCurrentUser,
    likesCount,
    savedByCurrentUser,
    hideLikes, 
  } = post;

  return (
    <>
      <div className="flex items-center justify-between mt-2 mb-1">
        <div className="flex items-center space-x-4">
          <Heart
            className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
              likedByCurrentUser
                ? "text-red-500 hover:text-red-700"
                : "text-gray-500 hover:text-red-700"
            }`}
            onClick={() => handleLike(_id)}
          />
          <MessageCircle
            className="w-6 h-6 cursor-pointer hover:text-blue-500"
            onClick={() => handleComment(post)}
          />
          <Send className="w-6 h-6 cursor-pointer hover:text-green-500" />
        </div>

        <Bookmark
          className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
            savedByCurrentUser
              ? "text-yellow-500 hover:text-yellow-700"
              : "text-gray-500 hover:text-yellow-500"
          }`}
          onClick={() => handleSave(_id)}
        />
      </div>

      {!hideLikes && likesCount > 0 && (
        <div className="text-sm font-semibold px-1 mb-1">
          {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
        </div>
      )}
    </>
  );
};

export default IconSection;
