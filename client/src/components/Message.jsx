import { CheckCircle, AlertCircle, Info } from "lucide-react";
import "./Message.css";

export default function Message({ type = "info", text }) {
  if (!text) return null;

  const icons = {
    success: <CheckCircle className="message-icon" />,
    error: <AlertCircle className="message-icon" />,
    info: <Info className="message-icon" />
  };

  return (
    <div className={`message ${type}-message`}>
      {icons[type]}
      <p>{text}</p>
    </div>
  );
}
