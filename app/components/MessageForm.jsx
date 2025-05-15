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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("请填写姓名和留言内容");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/messages", { name, content });

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-primary">
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">留言内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下您对周周老师的鼓励和祝福..."
              className="min-h-[120px]"
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>
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
