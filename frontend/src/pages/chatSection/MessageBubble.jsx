import { useRef, useState } from "react";

const MessageBubble = ({
  message,
  theme,
  currentUser,
  onReact,
  deleteMessage,
}) => {
  console.log("this is my message ", message);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const messageRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef(null);

  const emojiPickerRef = useRef(null);
  const reactionsMenuRef = useRef(null);
  const isUserMessage = message.sender._id === currentUser?._id;

  const bubbleClass = isUserMessage ? "flex justify-end" : "flex justify-start";

  const bubbleContentClass = `
    max-w-[60%] break-words rounded-lg p-3
    ${
      isUserMessage
        ? theme === "dark"
          ? "bg-green-700 text-white"
          : "bg-green-200 text-black"
        : theme === "dark"
        ? "bg-gray-700 text-white"
        : "bg-gray-200 text-black"
    }
  `;

  const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  const handleReact = (emoji) => {
    onReact(message._id, emoji);
    setShowEmojiPicker(false);
    setShowReactions(false);
  };

  if (message === 0) return;
  return (
    <div className={`${bubbleClass} mb-2`}>
      <div className={`${bubbleContentClass} relative group`} ref={messageRef}>
        <div className="flex justify-center gap-2">
          {message.contentType === "text" && (
            <p className="mr-2">{message.content}</p>
          )}
          {message.contentType === "image" && (
            <div>
              <img
                src={message.imageOrVideoUrl}
                alt="image-video"
                className="rounded-lg max-w-xs"
              />
              <p className="mt-1">{message.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
