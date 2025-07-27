import { useState } from "react";
import UploadStep from "./UploadStep";
import EditStep from "./EditStep";
import DetailsStep from "./DetailsStep";

const CreatePostModal = ({ onClose }) => {
  const isVideo = (file) => file?.type?.startsWith("video/");
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState({
    media: null,
    aspectRatio: "original",
    caption: "",
    location: "",
    tags: [],
    advanced: {},
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
  });

  const handleCropChange = (crop) => {
    setPostData((prev) => ({ ...prev, crop }));
  };

  const handleZoomChange = (zoom) => {
    setPostData((prev) => ({ ...prev, zoom }));
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setPostData((prev) => ({ ...prev, croppedAreaPixels }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div
        className={`relative bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col transition-all duration-300
        ${step === 3 ? "w-[800px] h-[500px]" : "w-[450px] h-[500px]"}`}
      >
        <div className="flex justify-center items-center bg-gray-300 p-3 border-b">
          <h1 className="text-lg font-semibold">
            {step === 1
              ? "Create Post"
              : step === 2
              ? "Edit Post"
              : "Post Details"}
          </h1>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-500 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1">
          {step === 1 && (
            <UploadStep
              postData={postData}
              setPostData={setPostData}
              onNext={() => {
                if (isVideo(postData.media)) {
                  setStep(3); 
                } else {
                  setStep(2); 
                }
              }}
            />
          )}
          {step === 2 && (
            <EditStep
              postData={postData}
              setPostData={setPostData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              handleCropChange={handleCropChange}
              handleZoomChange={handleZoomChange}
              handleCropComplete={handleCropComplete}
            />
          )}
          {step === 3 && (
            <DetailsStep
              postData={postData}
              setPostData={setPostData}
              onNext={() => {
                onClose();
              }}
              onBack={() => setStep(isVideo(postData.media) ? 1 : 2)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
