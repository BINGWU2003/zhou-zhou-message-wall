"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaPaperPlane } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export default function MessageForm({ onMessageAdded }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipInfo, setIpInfo] = useState(null);
  const [isLoadingIp, setIsLoadingIp] = useState(true);

  // 页面加载时获取用户IP位置信息
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        setIsLoadingIp(true);
        const response = await axios.get("/api/ipLookup");
        if (response.status === 200) {
          setIpInfo(response.data);
        }
      } catch (error) {
        console.error("获取IP位置信息失败:", error);
        // 出错时不显示错误信息给用户，静默失败
      } finally {
        setIsLoadingIp(false);
      }
    };

    fetchIpInfo();
  }, []);

  // 格式化位置信息文本
  const formatLocationInfo = () => {
    if (!ipInfo) return "";

    const parts = [];
    if (ipInfo.country && ipInfo.country !== "未知") parts.push(ipInfo.country);
    if (ipInfo.region) parts.push(ipInfo.region);
    if (ipInfo.city) parts.push(ipInfo.city);

    return parts.join(" · ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("请填写姓名和留言内容");
      return;
    }

    setIsSubmitting(true);

    try {
      // 提交留言时附带IP位置信息
      const response = await axios.post("/api/messages", {
        name,
        content,
        ipInfo,
      });

      if (response.status === 201) {
        toast.success("留言成功！");
        onMessageAdded(response.data.message);

        // 清空表单
        setName("");
        setContent("");
      }
    } catch (error) {
      console.error("提交留言失败:", error);
      toast.error("提交留言失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full dark:bg-gray-800/60 dark:backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-center text-primary dark:text-primary/90">
          给周周老师留言
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">您的称呼</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的称呼"
              maxLength={20}
              disabled={isSubmitting}
              className="dark:bg-gray-700/60 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">留言内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下您对周周老师的鼓励和祝福..."
              className="min-h-[120px] dark:bg-gray-700/60 dark:border-gray-600"
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>

          {!isLoadingIp && formatLocationInfo() && (
            <div className="text-xs text-muted-foreground pt-2">
              <p className="opacity-70">您的位置: {formatLocationInfo()}</p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">提交中...</span>
            ) : (
              <span className="flex items-center gap-2">
                发送祝福
                <FaPaperPlane className="h-4 w-4" />
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
