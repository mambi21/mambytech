import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ibrahima Mamby Bah — MambyTech: Cloud infrastructure. Linux systems. Reliable delivery.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Official logo (trimmed by scripts/brand-assets.mjs).
  const file = await readFile(path.join(process.cwd(), "public/brand/mambytech-logo-trimmed.png"));
  const logo = `data:image/png;base64,${file.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f7f4ee",
          color: "#1c211f",
          fontFamily: "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og, not the browser */}
        <img src={logo} alt="" width={357} height={80} />
        <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #1c211f", paddingTop: 36 }}>
          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05 }}>Ibrahima Mamby Bah</div>
          <div style={{ fontSize: 38, marginTop: 20, color: "#0e3b31", fontFamily: "sans-serif" }}>
            Cloud infrastructure. Linux systems. Reliable delivery.
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#4a524d", fontFamily: "sans-serif" }}>
          Cloud Infrastructure · Linux · DevOps · Software Engineering
        </div>
      </div>
    ),
    size,
  );
}
