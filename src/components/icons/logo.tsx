import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="https://files.catbox.moe/yjhmz7.png"
      alt="Unisono Logs Logo"
      width={32}
      height={32}
      className={props.className}
      unoptimized // Используется для внешних URL, которые не могут быть оптимизированы Next.js
    />
  );
}