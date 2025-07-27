import { useEffect, useState } from "react";
import Profilecard from "../Profilecard";
import SuggestedUser from "../SuggestedUser";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const authToken = storedUser?.token;

    if (!authToken) {
      console.warn("No token found. User might not be logged in.");
      return;
    }

    setToken(authToken);

    const fetchSuggestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/suggested", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        setSuggestedUsers(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  // Handler to update suggestedUsers state when a user is followed/unfollowed
  const handleFollowToggle = (userId, isFollowing) => {
    setSuggestedUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  return (
    <div className="w-[300px] hidden lg:flex flex-col pt-6 ml-3 p-4 pr-6">
      <div className="ml-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <Profilecard />
          <button className="text-blue-500 text-sm font-semibold">Switch</button>
        </div>
        <h2 className="text-lg font-bold mt-6 mb-4">Suggested for you</h2>
        {suggestedUsers.map((u) => (
          <SuggestedUser
            key={u._id}
            user={u}
            currentUserToken={token}
            onFollowToggle={handleFollowToggle}  // pass the handler here
          />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
