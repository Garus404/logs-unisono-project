import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="https://ltdfoto.ru/images/2025/10/10/IZOBRAZENIE_2025-10-10_170907615-removebg-preview.png"
      alt="Unisono Logs Logo"
      width={32}
      height={32}
      className={props.className}
      unoptimized // Используется для внешних URL, которые не могут быть оптимизированы Next.js
    />
  );
}