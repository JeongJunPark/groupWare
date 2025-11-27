export interface Message {
  sender: string;
  message: string;
  isMe?: boolean;
  isSystem?: boolean;
}