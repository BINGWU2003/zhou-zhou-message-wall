'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'sonner'
import Header from './components/Header'
import Footer from './components/Footer'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState(null)

  useEffect(() => {
    // 获取留言数据
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/messages')
        setMessages(response.data.messages)
        setError(null)
      } catch (err) {
        console.error('获取留言失败:', err)
        setError('获取留言失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleMessageAdded = (message) => {
    setNewMessage(message)
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Toaster 组件，用于显示通知 */}
      <Toaster position="top-center" richColors />

      {/* 背景装饰元素 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <main className="flex-grow py-8 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
            {/* 留言表单部分 - 在移动端在上方，在桌面端在右侧 */}
            <div className="w-full lg:w-1/3 order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-8">
              <MessageForm onMessageAdded={handleMessageAdded} />
            </div>

            {/* 留言列表部分 - 在移动端在下方，在桌面端在左侧 */}
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <FaSpinner className="animate-spin text-primary text-3xl" />
                </div>
              ) : error ? (
                <div className="text-center py-16 text-destructive">{error}</div>
              ) : (
                    <MessageList
                      messages={messages}
                      newMessage={newMessage}
                    />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
