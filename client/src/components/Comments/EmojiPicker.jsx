import React from "react";

const EMOJI_LIST = ["😀", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉",
                    "😍", "🥰", "😘", "😋", "😜", "🤪", "😎", "🤩",
                    "🥳", "😏", "😒", "😞", "😔", "😢", "😭", "😤",
                    "😠", "😡", "🤬", "🥺", "😳", "🥵", "🥶", "😱",
                    "😨", "😰", "😴", "🤔", "🤗", "🤭", "🤫", "🙄"
                    ];
const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="absolute bottom-10 left-0 bg-white border rounded shadow p-2 grid grid-cols-6 gap-2 z-10 text-xl">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="hover:scale-110 transition-transform"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
