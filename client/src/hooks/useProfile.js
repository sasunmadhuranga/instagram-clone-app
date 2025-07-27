import { useEffect, useState } from "react";

const useProfile = (token, username) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    photo: "",
    fullname: "",
  });

  const [counts, setCounts] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });

  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const isOwnProfile = !username;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileUrl = isOwnProfile
          ? "http://localhost:5000/api/users/me"
          : `http://localhost:5000/api/users/${username}`;
        
        const postsUrl = isOwnProfile
          ? "http://localhost:5000/api/posts/my-posts"
          : `http://localhost:5000/api/posts/user/${username}`;

        const fetches = [
          fetch(profileUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(postsUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];

        if (isOwnProfile) {
          fetches.push(
            fetch("http://localhost:5000/api/posts/saved-posts", {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        }

        const responses = await Promise.all(fetches);

        if (responses.some((res) => !res.ok)) {
          throw new Error("Failed to fetch profile data");
        }

        const [profileData, postsData, savedData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setForm({
          _id: profileData._id,
          username: profileData.username,
          email: profileData.email || "",
          bio: profileData.bio || "",
          photo: profileData.photo
            ? `http://localhost:5000${profileData.photo}`
            : "",
          fullname: profileData.fullname || "",
        });


        setMyPosts(postsData || []);
        if (isOwnProfile) setSavedPosts(savedData || []);

        setCounts({
          posts: postsData?.length || 0,
          followers: profileData.followers?.length || 0,
          following: profileData.following?.length || 0,
        });
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    if (token) {
      loadProfileData();
    }
  }, [token, username, isOwnProfile]);

  return {
    form,
    setForm,
    counts,
    setCounts,
    myPosts,
    savedPosts,
  };
};

export default useProfile;
