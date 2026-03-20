import { Link } from "react-router-dom";

const UserInfoCard = ({ user, location }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = API_URL.replace("/api", ""); 

  const photoUrl = user.photo
    ? user.photo.startsWith('http') 
      ? user.photo 
      : `${BASE_URL}${user.photo}`
    : null;

  return (
    <div className="flex items-center space-x-4">
      <Link to={`/profile/${user.username}`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold uppercase">
            {user.username?.[0] || "U"}
          </div>
        )}
      </Link>
      <div>
        <Link to={`/profile/${user.username}`} className="font-semibold hover:underline">
          {user.username}
        </Link>
        {location && <p className="text-xs text-gray-500">{location}</p>}
      </div>
    </div>
  );
};

export default UserInfoCard;
