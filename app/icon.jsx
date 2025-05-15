import { PiChalkboardTeacherFill } from "react-icons/pi";

export default function Icon() {
  return (
    <div
      style={{
        display: "flex",
        background:
          "linear-gradient(to right, hsl(335, 78%, 60%), hsl(270, 67%, 53%))",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12%",
        color: "white",
      }}
    >
      <PiChalkboardTeacherFill style={{ width: "70%", height: "70%" }} />
    </div>
  );
}
