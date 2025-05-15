"use client";

import { useState, useEffect } from "react";
import { FaUser, FaClock, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/app/lib/utils";

export default function MessageList({ messages = [], newMessage = null }) {
  const [displayMessages, setDisplayMessages] = useState(messages);

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

  // 获取位置信息展示文本
  const getLocationText = (message) => {
    if (!message.location) return "未知位置";

    const { country, province, city } = message.location;

    if (country === "未知" && province === "未知" && city === "未知") {
      return "未知位置";
    }

    let locationText = "";

    if (country && country !== "未知") {
      locationText += country;
    }

    if (province && province !== "未知" && province !== country) {
      locationText += locationText ? ` · ${province}` : province;
    }

    if (city && city !== "未知" && city !== province) {
      locationText += locationText ? ` · ${city}` : city;
    }

    return locationText || "未知位置";
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
      <h2 className="text-xl font-bold mb-6 text-center">祝福留言墙</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayMessages.map((message, index) => (
          <Card
            key={message.id}
            className={cn(
              "overflow-hidden group hover:shadow-md transition-all duration-300 animate-fade-in border-l-4 border-primary/80",
              "dark:bg-gray-800/60 dark:backdrop-blur-sm"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
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
                  <FaClock className="mr-1 flex-shrink-0" />
                  <time dateTime={message.timestamp}>
                    {formatDate(message.timestamp)}
                  </time>
                </div>

                {message.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1 flex-shrink-0 text-primary/60" />
                    <span
                      className="truncate"
                      title={`${getLocationText(message)}${
                        message.ip ? ` (${message.ip})` : ""
                      }`}
                    >
                      {getLocationText(message)}
                    </span>
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
