"use client";

import { useFormStatus } from "react-dom";
// import { cn } from "@/lib/utils";

const Button = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Scraping...." : children}
    </button>
  );
};

export default Button;
