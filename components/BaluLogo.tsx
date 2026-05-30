"use client";

import Image from "next/image";
import clsx from "clsx";

type BaluLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BaluLogo({ className, compact = false }: BaluLogoProps) {
  return (
    <div className={clsx("inline-flex items-center", className)} aria-label="BalúBalú">
      <Image
        src="/logo-balu.png"
        alt="BalúBalú"
        width={2437}
        height={822}
        priority
        className={clsx("h-auto w-full", compact ? "max-w-[220px]" : "max-w-[460px]")}
      />
    </div>
  );
}
