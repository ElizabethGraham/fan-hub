"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  firstName: string;
  lastName: string;
  reference?: string;
  featured?: boolean;
  size?: "sm" | "md"; // sm = 28px (roster rows), md = 40px (featured card)
};

export default function PlayerAvatar({
  firstName,
  lastName,
  reference,
  featured = false,
  size = "md",
}: Props) {
  const [showImage, setShowImage] = useState(Boolean(reference));

  const imgSrc =
    showImage && reference
      ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${reference}.png`
      : null;

  const px = size === "sm" ? 40 : 56;
  const sizeClass = size === "sm" ? "w-[40px] h-[40px] text-[10px]" : "w-[56px] h-[56px] text-xs";

  if (imgSrc) {
    // unoptimized bypasses Next.js image optimization so the browser handles the
    // proxy response directly. Without it,
    // Next.js tries to optimize the response server-side and onError never fires.
    return (
      <div
        className={`${sizeClass} relative rounded-lg shrink-0 overflow-hidden border bg-zinc-900 ${
          featured ? "border-fiesta-teal/40" : "border-zinc-700"
        }`}
      >
        <Image
          src={imgSrc}
          alt={`${firstName} ${lastName}`}
          fill
          sizes={`${px}px`}
          unoptimized
          className="block object-cover object-center"
          onError={() => setShowImage(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center font-black shrink-0 ${
        featured
          ? "bg-fiesta-teal/20 border border-fiesta-teal/40 text-fiesta-teal"
          : "bg-zinc-800 border border-zinc-700 text-ui-muted"
      }`}
    >
      {firstName[0]}
      {lastName[0]}
    </div>
  );
}
