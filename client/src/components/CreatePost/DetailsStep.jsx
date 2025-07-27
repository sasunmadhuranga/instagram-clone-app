import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DetailsStep = ({ postData, setPostData, onNext, onBack, isEditing = false }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const file = postData.croppedMedia || postData.originalMedia;

  const previewUrl = isEditing
    ? `http://localhost:5000${postData.media}` 
    : postData.croppedPreviewUrl || postData.previewUrl;


  const isVideo = isEditing
    ? previewUrl?.endsWith(".mp4")
    : file?.type?.startsWith("video/");
    

  const toggleOption = (key) => {
    setPostData((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: !prev.advanced?.[key],
      },
    }));
  };

  
  const handleSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      console.error("No token found");
      return;
    }

    const formData = new FormData();
    if (!isEditing && (postData.croppedMedia || postData.originalMedia)) {
      formData.append("media", postData.croppedMedia || postData.originalMedia);
    }
    formData.append("caption", postData.caption || "");
    formData.append("location", postData.location || "");
    formData.append("hideLikes", postData.advanced?.hideLikes || false);
    formData.append("disableComments", postData.advanced?.disableComments || false);

    try {
      const url = isEditing
        ? `http://localhost:5000/api/posts/${postData._id}` 
        : "http://localhost:5000/api/posts"; 

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onNext(data); 
      } else {
      }
    } catch (err) {
      console.error(isEditing ? "Update error:" : "Upload error:", err);
    }
  };


  return (
    <div className="w-[800px] h-[420px] flex border rounded-lg overflow-hidden bg-white">
      <div className="w-[60%] bg-black flex items-center justify-center">
        {isVideo ? (
          <video
            src={previewUrl}
            controls
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      <div className="w-[40%] h-full flex flex-col bg-white border-l">
        <div className="flex-1 overflow-y-auto p-6">
          <textarea
            placeholder="Write a caption..."
            className="w-full h-32 border border-gray-300 rounded p-2 mb-4 resize-none"
            value={postData.caption || ""}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, caption: e.target.value }))
            }
          />

          <input
            placeholder="Add location"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            value={postData.location || ""}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, location: e.target.value }))
            }
          />

          <button
            type="button"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
            className="flex items-center justify-between w-full text-left font-medium text-indigo-600 mb-2 focus:outline-none"
          >
            <span>Advanced Settings</span>
            {isAdvancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isAdvancedOpen ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 text-sm">Hide like and view counts</span>
              <button
                onClick={() => toggleOption("hideLikes")}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${
                  postData.advanced?.hideLikes ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    postData.advanced?.hideLikes ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Turn off commenting</span>
              <button
                onClick={() => toggleOption("disableComments")}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${
                  postData.advanced?.disableComments ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    postData.advanced?.disableComments
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-between">
          <button
            onClick={onBack}
            className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className={"py-2 px-4 rounded bg-indigo-700 hover:bg-indigo-500 text-white hover"}
          >
            {isEditing ? "Update" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
