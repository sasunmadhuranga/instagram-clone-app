import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/getCroppedImg";

const aspectRatios = {
  original: null,
  "1:1": 1 / 1,
  "4:5": 4 / 5,
  "16:9": 16 / 9,
};

const EditStep = ({
  postData,
  setPostData,
  onNext,
  onBack,
  handleCropChange,
  handleZoomChange,
  handleCropComplete,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const isVideo = postData.originalMedia?.type?.startsWith("video/");

  useEffect(() => {
    if (!postData.originalMedia) {
      setImageSrc(null);
      return;
    }

    const url = URL.createObjectURL(postData.originalMedia); 
    setImageSrc(url);

    return () => {
      URL.revokeObjectURL(url);
      setImageSrc(null);
    };
  }, [postData.originalMedia]);

  const aspect = aspectRatios[postData.aspectRatio] ?? undefined;

  if (isVideo) {
    return (
      <div className="flex flex-col h-full px-4 py-2">
        <div className="flex-1 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden p-4">
          <video
            controls
            src={URL.createObjectURL(postData.originalMedia)}
            className="max-h-[320px] w-full object-contain rounded"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onBack}
            className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  const handleCropAndNext = async () => {
    try {
      if (!imageSrc || !postData.croppedAreaPixels) return onNext();

      const { file, previewUrl } = await getCroppedImg(
        imageSrc,
        postData.croppedAreaPixels
      );

      setPostData((prev) => ({
        ...prev,
        croppedMedia: file,
        croppedPreviewUrl: previewUrl,
      }));

      onNext();
    } catch (err) {
      console.error("Cropping failed:", err);
    }
  };

  return (
    <div className="h-full flex flex-col px-4 py-2">
      <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={postData.crop}
            zoom={postData.zoom}
            aspect={aspect}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={handleCropComplete}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No media loaded
          </div>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="zoom"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Zoom
        </label>
        <input
          type="range"
          id="zoom"
          min={1}
          max={3}
          step={0.01}
          value={postData.zoom}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-4 flex gap-2">
        {Object.keys(aspectRatios).map((ratio) => (
          <button
            key={ratio}
            onClick={() =>
              setPostData((prev) => ({ ...prev, aspectRatio: ratio }))
            }
            className={`px-3 py-1 rounded ${
              postData.aspectRatio === ratio
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

      <div className="mt-auto flex justify-between">
        <button
          onClick={onBack}
          className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleCropAndNext}
          className="py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EditStep;
