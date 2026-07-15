import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1b2c",
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 20 C6 15 9 10 14 8 C17 6.5 20 5 23 2 C21 6 18 9 15 12 C11 16 6 19 2 20 Z"
            fill="#d9a441"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
