// components/Card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  image?: string;
  title?: string;
  content?: ReactNode | string;
  meta?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
};

export default function Card({
  image,
  title,
  content,
  meta,
  style,
  href,
  onClick,
}: CardProps) {
  const cardContent = (
    <div className="card" style={style} onClick={onClick}>
      {image && (
        <div className="card-image-wrapper">
          <Image
            src={image}
            alt={title || "Card image"}
            fill
            className="card-image"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}
      <div className="card-content">
        {title && <h3>{title}</h3>}
        {content && (typeof content === "string" ? <p>{content}</p> : content)}
        {meta && <small>{meta}</small>}
      </div>
    </div>
  );

  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
}
