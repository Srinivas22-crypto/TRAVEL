import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Language names in their own language
const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ja: '日本語',
  zh: '中文'
};

interface Message {
  id: number;
  type: 'bot' | 'user';
  message: string;
}

export const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      message: t('chatbot.welcome')
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      message: t('chatbot.welcome')
    }]);
  }, [i18n.language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      message: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.message,
          language: i18n.language,
          languageName: LANGUAGE_NAMES[i18n.language as keyof typeof LANGUAGE_NAMES]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot' as const,
        message: data.message
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage: string;
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = t('chatbot.errors.apiKey');
        } else if (error.message.includes('rate limit')) {
          errorMessage = t('chatbot.errors.rateLimit');
        } else if (error.message.includes('Network Error') || !navigator.onLine) {
          errorMessage = t('chatbot.errors.network');
        } else if (error.message.startsWith('HTTP error')) {
          errorMessage = t('chatbot.errors.http');
        } else {
          errorMessage = error.message.startsWith('Failed') 
            ? t('chatbot.errors.generic') 
            : error.message;
        }
      } else {
        errorMessage = t('chatbot.errors.unexpected');
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot' as const,
        message: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-[100] p-4 sm:p-6 md:bottom-6 md:right-6">
      <div
        className={cn(
          "fixed bottom-0 right-0 w-full sm:w-[80%] md:w-[60%] lg:w-[45%] h-[85vh] sm:h-auto sm:max-h-[80vh] bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-lg transform transition-all duration-300 ease-in-out origin-bottom-right sm:bottom-24 sm:right-6 flex flex-col",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none translate-y-full sm:translate-y-0"
        )}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t('chatbot.title')}
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={t('chatbot.minimizeAria')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ScrollArea 
          className="flex-1 overflow-y-auto min-h-0"
          ref={scrollAreaRef}
        >
          <div className="p-3 sm:p-4 space-y-4 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full space-y-2",
                  msg.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 shadow-sm",
                    msg.type === 'user'
                      ? "bg-blue-500 text-white rounded-br-none ml-auto"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none mr-auto"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {msg.type === 'bot' && (
                      <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                    )}
                    <span className="whitespace-pre-wrap break-words">{msg.message}</span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          className="border-t dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-b-lg mt-auto flex-shrink-0 sticky bottom-0 backdrop-blur-sm backdrop-filter"
        >
          <div className="flex items-center space-x-2 relative">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && inputMessage.trim()) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 min-h-[44px] max-h-[120px] resize-none py-2 text-sm sm:text-base pr-12"
              disabled={isLoading}
              aria-label={t('chatbot.placeholder')}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
              className="h-10 w-10 shrink-0 rounded-full absolute right-1"
              aria-label={t('chatbot.send')}
            >
              <Send className={cn(
                "h-4 w-4 transition-transform",
                isLoading ? "opacity-70" : "group-hover:translate-x-0.5"
              )} />
            </Button>
          </div>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-colors hover:shadow-xl active:scale-95"
        aria-label={t('chatbot.openAria')}
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  );
};
