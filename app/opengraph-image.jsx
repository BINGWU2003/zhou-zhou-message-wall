import { ImageResponse } from "next/og";
import { PiChalkboardTeacherFill } from "react-icons/pi";

// 路由段配置
export const runtime = "edge";
export const alt = "周周老师的加油站";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 128,
          background:
            "linear-gradient(to right, hsl(335, 78%, 60%), hsl(270, 67%, 53%))",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 40 }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 200,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 32,
            }}
          >
            <svg width="140" height="140" viewBox="0 0 512 512" fill="white">
              <path d="M393.2 256c0 75.7-61.5 137.2-137.2 137.2S118.8 331.7 118.8 256 180.3 118.8 256 118.8 393.2 180.3 393.2 256zM256 80c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176S353.2 80 256 80zm89.6 176c0 29.9-24.2 54.1-54.1 54.1h-72.3V237c-10.6 0-19.2-8.6-19.2-19.2s8.6-19.2 19.2-19.2h72.3c29.9 0 54.1 24.2 54.1 54.1z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 72, fontWeight: "bold" }}>周周老师的加油站</h1>
        </div>
        <p style={{ fontSize: 36, opacity: 0.9 }}>留下您的祝福与鼓励</p>
      </div>
    ),
    {
      ...size,
    }
  );
}
