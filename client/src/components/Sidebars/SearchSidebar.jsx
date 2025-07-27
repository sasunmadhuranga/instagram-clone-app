import { useState, useEffect } from 'react';
import UserInfoCard from '../UserInfoCard';
import { toast } from 'react-toastify';

const SearchSidebar = ({ onClose, visible }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [debounced, setDebounced] = useState(query);

  // Debounce the input
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debounced.trim()) {
        setResults([]);
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(debounced)}`, {
            headers: { Authorization: `Bearer ${token}` }
            });

        const data = await res.json();
        if (res.ok) setResults(data);
        else toast.error(data.msg || 'Search failed');
      } catch (err) {
        toast.error('Server error');
      }
    };

    fetchUsers();
  }, [debounced]);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white w-[350px] shadow-lg transform transition-transform ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Search Users</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black">&times;</button>
      </div>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by name or username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        {results.length ? (
          <div className="space-y-4">
            {results.map((u) => (
              <UserInfoCard key={u._id} user={u} />
            ))}
          </div>
        ) : debounced ? (
          <p>No users found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchSidebar;
