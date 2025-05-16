"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaClock,
  FaHeart,
  FaMapMarkerAlt,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/app/lib/utils";
import { useAdminStore } from "./Footer";
import { toast } from "sonner";
import axios from "axios";

export default function MessageList({
  messages = [],
  newMessage = null,
  onMessageDeleted,
}) {
  const [displayMessages, setDisplayMessages] = useState(messages);
  const { isAdminMode } = useAdminStore();
  const [deletingId, setDeletingId] = useState(null);

  // 当收到新消息时更新列表
  useEffect(() => {
    if (newMessage) {
      setDisplayMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  }, [newMessage]);

  // 初始加载时更新消息
  useEffect(() => {
    if (messages.length > 0) {
      setDisplayMessages(messages);
    }
  }, [messages]);

  // 格式化时间
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 获取位置信息文本
  const getLocationText = (message) => {
    if (!message.country && !message.region && !message.city) {
      return null;
    }

    const locationParts = [];
    if (message.country) locationParts.push(message.country);
    if (message.region) locationParts.push(message.region);
    if (message.city) locationParts.push(message.city);

    return locationParts.join(" · ");
  };

  // 处理删除留言
  const handleDeleteMessage = async (id) => {
    try {
      setDeletingId(id);

      // 添加一个延迟以使加载效果更明显
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 调用API删除留言
      await axios.delete(`/api/messages?id=${id}`);

      // 从列表中移除该留言
      setDisplayMessages((prev) => prev.filter((message) => message.id !== id));

      toast.success("留言已删除");
    } catch (error) {
      console.error("删除留言失败:", error);
      toast.error("删除留言失败，请重试");
    } finally {
      setDeletingId(null);
    }
  };

  if (displayMessages.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-muted-foreground">暂无留言，快来留下第一条吧！</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6 text-center">
        祝福留言墙
        {isAdminMode && (
          <span className="text-sm font-normal text-primary ml-2">
            [管理模式已开启]
          </span>
        )}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayMessages.map((message, index) => (
          <Card
            key={message.id}
            className={cn(
              "overflow-hidden group hover:shadow-md transition-all duration-300 animate-fade-in border-l-4 border-primary/80",
              "dark:bg-gray-800/60 dark:backdrop-blur-sm",
              isAdminMode && "border-red-400/50",
              deletingId === message.id && "opacity-60"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 relative">
              {isAdminMode && (
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  disabled={deletingId === message.id}
                  className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 transition-colors z-10 bg-white/80 dark:bg-gray-800/80 rounded-full"
                  title="删除此留言"
                >
                  {deletingId === message.id ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrash className="w-4 h-4" />
                  )}
                </button>
              )}

              {deletingId === message.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 z-5 backdrop-blur-[1px]">
                  <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                    <FaSpinner className="animate-spin text-primary" />
                    <span className="text-xs font-medium">正在删除...</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <span className="font-medium">{message.name}</span>
                </div>
                <FaHeart className="text-pink-400 dark:text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <p className="text-card-foreground mb-4 break-words">
                {message.content}
              </p>

              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <time dateTime={message.timestamp}>
                    {formatDate(message.timestamp)}
                  </time>
                </div>

                {getLocationText(message) && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <FaMapMarkerAlt className="mr-1 text-primary/60" />
                    <span>{getLocationText(message)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
