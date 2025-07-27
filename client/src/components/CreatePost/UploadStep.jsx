import { ImageIcon } from "lucide-react";

const isVideo = (file) => file?.type?.startsWith("video/");

const UploadStep = ({ postData, setPostData, onNext }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      setPostData({
        ...postData,
        originalMedia: file,          
        media: file,                  
        previewUrl: fileUrl,          
        croppedMedia: null,           
        croppedPreviewUrl: null,     
      });

      if (isVideo(file)) {
        onNext(2); 
      } else {
        onNext(2);
      }
    }
  };

  return (
    <div className="flex h-full flex-col justify-center items-center gap-4 px-6 text-center">
      <h1 className="text-md font-medium text-gray-700">
        Drag photos and videos here
      </h1>
      <ImageIcon size={48} className="text-gray-600" />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
      >
        Select from computer
      </label>
    </div>
  );
};

export default UploadStep;
