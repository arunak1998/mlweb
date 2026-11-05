import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_SUBTITLE } from "@/config/site";

// A route named og.png, so the static export writes a real .png file.
// Instagram and WhatsApp previews need the image served with an image content type.
export const dynamic = "force-static";

function loadInter(weight: number) {
  return readFile(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
}

export async function GET() {
  const [regular, extraBold] = await Promise.all([loadInter(400), loadInter(800)]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        background: "radial-gradient(ellipse 80% 90% at 50% 0%, #1d1a3f, #07080f)",
        color: "#e6e8f2",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.1 }}>ML Interview</div>
      <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.1, color: "#8b7cff" }}>
        Revision Notes
      </div>
      <div style={{ display: "flex", marginTop: 36, fontSize: 42, color: "#b8bdd4" }}>{SITE_SUBTITLE}</div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regular, weight: 400 },
        { name: "Inter", data: extraBold, weight: 800 },
      ],
    },
  );
}
