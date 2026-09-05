"use client";

import { useEffect, useState } from "react";
import { BookOpen, Droplet, Fish, Store, Users } from "lucide-react";

export type BottomNavTab = "conditions" | "fishing-hub" | "learning" | "community" | "shop";

const tabs: { id: BottomNavTab; href: string; icon: typeof Droplet; en: string; ar: string }[] = [
  { id: "conditions", href: "/", icon: Droplet, en: "Conditions", ar: "حالة البحر" },
  { id: "fishing-hub", href: "/fishing-hub", icon: Fish, en: "Fishing Hub", ar: "مركز الصيد" },
  { id: "learning", href: "/learning", icon: BookOpen, en: "Learning", ar: "تعلم" },
  { id: "community", href: "/community", icon: Users, en: "Community", ar: "المجتمع" },
  { id: "shop", href: "/shop", icon: Store, en: "Shop", ar: "المتجر" },
];

export default function BottomNav({ active }: { active: BottomNavTab }) {
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    setRtl(window.localStorage.getItem("alexfisher-language") === "ar");
  }, []);

  return (
    <nav className="bottom-nav" dir={rtl ? "rtl" : "ltr"} aria-label={rtl ? "التنقل الرئيسي" : "Primary navigation"}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <a key={tab.id} href={tab.href} className={isActive ? "active" : ""} aria-current={isActive ? "page" : undefined}>
            <Icon size={20} />
            <span>{rtl ? tab.ar : tab.en}</span>
          </a>
        );
      })}
    </nav>
  );
}
