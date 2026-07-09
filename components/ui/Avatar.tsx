"use client";

export default function Avatar({ name = "User" }: { name?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
      {initials || "U"}
    </div>
  );
}

