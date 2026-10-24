import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

const sizes = {
  sm: { img: 38, text: "text-base", gap: "gap-1.5" },
  md: { img: 48, text: "text-lg", gap: "gap-2" },
  lg: { img: 60, text: "text-xl", gap: "gap-2.5" },
};

export function Logo({ size = "md", href = "/", showText = true }: LogoProps) {
  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-center ${s.gap}`}>
      <Image
        src="/logo.png"
        alt="MygrationStation"
        width={s.img}
        height={s.img}
        className="flex-shrink-0 -my-1 drop-shadow-[0_0_10px_rgba(200,169,96,0.25)]"
        priority
      />
      {showText && (
        <span className={`${s.text} font-bold tracking-tight`}>
          <span className="text-gold-400">Mygration</span>
          <span className="text-white">Station</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
