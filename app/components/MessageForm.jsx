"use client";

import { useState } from "react";
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

  // 点击提交时获取IP信息并发送留言
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("请填写姓名和留言内容");
      return;
    }

    setIsSubmitting(true);

    try {
      // 显示获取位置信息的提示
      toast.loading("正在获取位置信息...");

      // 1. 使用腾讯IP查询接口获取位置信息
      const ipResponse = await axios.get("https://iplark.com/ipstack");
      let ipInfo = null;

      // 处理腾讯API返回的数据
      ipInfo = {
        ip: ipResponse.data.ip,
        country: ipResponse.data.country_name,
        region: ipResponse.data.region_name,
        city: ipResponse.data.city,
      };

      // 2. 提交留言（包含IP信息）
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

      // 显示友好的错误信息
      if (
        error.message?.includes("ip2city") ||
        error.message?.includes("network")
      ) {
        toast.error("获取位置信息失败，但仍会提交留言");

        // 如果获取IP失败，仍尝试提交留言
        try {
          const response = await axios.post("/api/messages", {
            name,
            content,
            ipInfo: null,
          });

          if (response.status === 201) {
            toast.success("留言成功！");
            onMessageAdded(response.data.message);

            // 清空表单
            setName("");
            setContent("");
          }
        } catch (submitError) {
          console.error("再次提交留言失败:", submitError);
          toast.error("提交留言失败，请稍后重试");
        }
      } else {
        toast.error("提交留言失败，请稍后重试");
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss(); // 关闭所有loading提示
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

          <div className="text-xs text-muted-foreground">
            <p className="opacity-70">点击发送时将自动获取您的位置信息</p>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                {isSubmitting && "提交中..."}
              </span>
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
