import { useEffect, useState } from "react";

const useProfile = (token, username) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = API_URL.replace("/api", "");
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
          ? `${API_URL}/users/me`
          : `${API_URL}/users/${username}`;
        
        const postsUrl = isOwnProfile
          ? `${API_URL}/posts/my-posts`
          : `${API_URL}/posts/user/${username}`;

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
            fetch(`${API_URL}/posts/saved-posts`, {
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
            ? `${BASE_URL}${profileData.photo}`
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
  }, [token, username, isOwnProfile, API_URL, BASE_URL]);

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
