import { ImageResponse } from "next/og";

export const alt = "Куда.Крым — подбор пляжей по погоде и состоянию моря";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(145deg, #073f49 0%, #087b86 48%, #e5c982 100%)",
          color: "white",
          display: "flex",
          fontFamily: "sans-serif",
          height: "100%",
          overflow: "hidden",
          padding: "76px 88px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.13)",
            border: "2px solid rgba(255, 255, 255, 0.28)",
            borderRadius: 42,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: "54px 62px",
            width: 820,
          }}
        >
          <div
            style={{
              color: "#bff6ed",
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Планируйте поездку к морю
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            Куда.Крым
          </div>
          <div
            style={{
              color: "#eefcf9",
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
            }}
          >
            Пляжи, погода, море и время в пути — в одном месте
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#fff6d7",
            borderRadius: 999,
            boxShadow: "0 22px 70px rgba(3, 45, 51, 0.28)",
            color: "#086c78",
            display: "flex",
            fontSize: 108,
            height: 210,
            justifyContent: "center",
            position: "absolute",
            right: 78,
            top: 72,
            width: 210,
          }}
        >
          ☀
        </div>
        <div
          style={{
            background: "rgba(230, 252, 249, 0.28)",
            borderRadius: "50% 50% 0 0",
            bottom: -100,
            height: 250,
            position: "absolute",
            right: -40,
            transform: "rotate(-9deg)",
            width: 480,
          }}
        />
      </div>
    ),
    size,
  );
}
