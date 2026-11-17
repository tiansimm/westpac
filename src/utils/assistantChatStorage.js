export const CURRENT_CHAT_KEY = 'cashflowiq.chat.current'
export const HISTORY_KEY = 'cashflowiq.chat.history'

export function deleteAssistantChatHistory() {
  localStorage.removeItem(CURRENT_CHAT_KEY)
  localStorage.removeItem(HISTORY_KEY)
}
