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
  const [locationInfo, setLocationInfo] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // 组件加载时获取位置信息
  useEffect(() => {
    const getLocationInfo = async () => {
      setIsLoadingLocation(true);
      try {
        // 使用浏览器的地理位置API获取经纬度
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("您的浏览器不支持地理位置功能"));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            { timeout: 10000, enableHighAccuracy: true }
          );
        });

        const { longitude, latitude } = position.coords;

        // 使用经纬度调用后端API进行地理编码
        const ipResponse = await axios.get(
          `/api/ipLookup?longitude=${longitude}&latitude=${latitude}`
        );

        if (ipResponse.status === 200) {
          setLocationInfo(ipResponse.data);
        }
      } catch (locationError) {
        console.error("获取位置信息失败:", locationError);

        // 位置获取失败，尝试不带经纬度参数获取IP信息
        try {
          const ipResponse = await axios.get("/api/ipLookup");
          if (ipResponse.status === 200) {
            setLocationInfo(ipResponse.data);
          }
        } catch (ipError) {
          console.error("获取IP信息也失败:", ipError);
        }
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocationInfo();
  }, []);

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("请填写姓名和留言内容");
      return;
    }

    setIsSubmitting(true);

    try {
      // 提交留言（包含位置信息，如果有的话）
      const response = await axios.post("/api/messages", {
        name,
        content,
        ipInfo: locationInfo,
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

          <div className="text-xs text-muted-foreground">
            {isLoadingLocation ? (
              <p className="opacity-70">正在获取位置信息...</p>
            ) : locationInfo ? (
              <p className="opacity-70">
                位置信息:{" "}
                {locationInfo.city ||
                  locationInfo.region ||
                  locationInfo.country ||
                  "未知"}
              </p>
            ) : (
              <p className="opacity-70">无法获取位置信息</p>
            )}
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
