export default function Profilecard(){
    const user = JSON.parse(localStorage.getItem("user"));
    return(
        <div className="flex items-center space-x-3 min-w-[250px] pt-3 border rounded-xl w-full">
            <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={user?.photo || "/default-profile.png"}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{user?.fullname || "No Name Provided"}</p>
              <p className="text-sm text-gray-500">@{user?.username || "unknown"}</p>
            </div>
          </div>
    );
}