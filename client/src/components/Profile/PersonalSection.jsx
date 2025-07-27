import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PersonalSection() {
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState(userData?.email || "");

  const initialBirthday = userData?.birthday ? new Date(userData.birthday) : null;
  const [day, setDay] = useState(initialBirthday?.getDate() || '');
  const [month, setMonth] = useState(initialBirthday ? String(initialBirthday.getMonth() + 1).padStart(2, '0') : '');
  const [year, setYear] = useState(initialBirthday?.getFullYear() || '');


  const closePopup = () => {
    setIsPopupOpen(false);
    setIsEditingEmail(false);
    setIsEditingBirthday(false);
  };

  const handleSaveEmail = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.msg || "Update failed");

      const updated = { ...userData, email: data.email };
      setUserData(updated); 
      localStorage.setItem("user", JSON.stringify(updated));
      closePopup();
    } catch (err) {
      console.error(err);
      toast.error("Error updating email");
    }
  };

  const handleSaveBirthday = async () => {
    if (!day || !month || !year) return;

    const birthday = `${year}-${month}-${String(day).padStart(2, "0")}`;

    try {
      const res = await fetch("http://localhost:5000/api/users/update-birthday", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ birthday }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.msg || "Update failed");

      const updated = { ...userData, birthday: data.birthday };
      setUserData(updated); 
      localStorage.setItem("user", JSON.stringify(updated));
      closePopup();
    } catch (err) {
      console.error(err);
      toast.error("Error updating birthday");
    }
  };


  const formattedBirthday = userData?.birthday
    ? new Date(userData.birthday).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { name: 'January', value: '01' }, { name: 'February', value: '02' },
    { name: 'March', value: '03' }, { name: 'April', value: '04' },
    { name: 'May', value: '05' }, { name: 'June', value: '06' },
    { name: 'July', value: '07' }, { name: 'August', value: '08' },
    { name: 'September', value: '09' }, { name: 'October', value: '10' },
    { name: 'November', value: '11' }, { name: 'December', value: '12' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);


  return (
    <div className="relative">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold mb-5 p-2">Personal details</h2>

      <div className="border-2 rounded-2xl overflow-hidden">
        <div
          onClick={() => {
            setIsEditingEmail(true);
            setIsPopupOpen(true);
          }}
          className="w-full flex flex-col space-y-3 pl-3 border-b py-2 border-gray-300 hover:bg-gray-200 cursor-pointer transition"
        >
          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-900">Contact info</span>
            <span className="text-base text-gray-600">{userData?.email}</span>
          </div>
        </div>

        <div
          onClick={() => {
            setIsEditingBirthday(true);
            setIsPopupOpen(true);
          }}
          className="w-full flex flex-col space-y-3 pl-3 py-2 hover:bg-gray-200 cursor-pointer transition"
        >
          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-900">Birthday</span>
            <span className="text-base text-gray-600">{formattedBirthday}</span>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <>
          <div
            onClick={closePopup}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-lg max-w-xl w-full p-6 relative">
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close popup"
              >
                &times;
              </button>


              {isEditingEmail && (
                <div className="max-w-lg mx-auto min-h-[250px] px-4 py-6 flex flex-col">
                  <label htmlFor="email" className="mb-2 font-semibold text-lg">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              )}

              {isEditingBirthday && (
                <div className="max-w-lg mx-auto min-h-[250px] px-4 py-6 flex flex-col">
                  <label className="mb-2 font-semibold text-lg">Birthday</label>
                  <div className="flex space-x-2 mb-6">
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="border p-2 rounded w-1/3">
                      <option value="">Day</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded w-1/3">
                      <option value="">Month</option>
                      {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="border p-2 rounded w-1/3">
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleSaveBirthday}
                    className="bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
