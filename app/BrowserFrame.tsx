"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Lock, MoreVertical, Plus, RotateCw, Star, X } from "lucide-react";

// Chrome-like window around the demo, ported from C2COPY-LANDING components/landing/browser-frame.tsx.

const TAB_CURVE = 10;

const FX_OPEN = 1.16782;
const FX_START = 1.1677;
const FX_MIN = 1.167;
const FX_MAX = 1.1685;
const FX_STEP = 0.00024;
const FX_INTERVAL_MS = 1800;

function fxTabStats(price: number) {
  const change = ((price - FX_OPEN) / FX_OPEN) * 100;
  const up = change >= 0;
  return `${price.toFixed(5)} ${up ? "▲" : "▼"} ${up ? "+" : "−"}${Math.abs(change).toFixed(2)}%`;
}

function TabIcon({ src }: { src: string }) {
  return <img src={src} alt="" width={16} height={16} aria-hidden className="bf-tabIcon" />;
}

function useBackgroundTabs() {
  const [price, setPrice] = useState(FX_START);

  useEffect(() => {
    const id = setInterval(() => {
      setPrice(prev => Math.min(FX_MAX, Math.max(FX_MIN, prev + (Math.random() - 0.5) * FX_STEP)));
    }, FX_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return [
    { icon: "/browser/tv-favicon.ico", title: `EURUSD ${fxTabStats(price)} chart` },
    { icon: "/browser/icon-ff.ico", title: "Calendar | Forex Factory" },
  ];
}

export default function BrowserFrame({
  tabTitle,
  url,
  children,
}: {
  tabTitle: string;
  url: string;
  children: React.ReactNode;
}) {
  const backgroundTabs = useBackgroundTabs();

  return (
    <div className="bf" dir="ltr">
      <div className="bf-strip">
        <span className="bf-lights">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </span>
        <span className="bf-tabSearch">
          <ChevronDown aria-hidden />
        </span>
        <span className="bf-tab bf-tabActive">
          <span
            aria-hidden
            className="bf-curve"
            style={{
              left: -TAB_CURVE, width: TAB_CURVE, height: TAB_CURVE,
              background: `radial-gradient(circle at 0 0, transparent ${TAB_CURVE}px, var(--chrome-toolbar) ${TAB_CURVE}px)`,
            }}
          />
          <span
            aria-hidden
            className="bf-curve"
            style={{
              right: -TAB_CURVE, width: TAB_CURVE, height: TAB_CURVE,
              background: `radial-gradient(circle at 100% 0, transparent ${TAB_CURVE}px, var(--chrome-toolbar) ${TAB_CURVE}px)`,
            }}
          />
          <TabIcon src="/cube.svg" />
          <span className="bf-tabTitle">{tabTitle}</span>
          <X className="bf-tabClose" aria-hidden />
        </span>
        {backgroundTabs.map((tab, index) => (
          <span key={tab.icon} className="bf-tabSlot">
            {index > 0 ? <span aria-hidden className="bf-sep" /> : null}
            <span className="bf-tab">
              <TabIcon src={tab.icon} />
              <span className="bf-tabTitle">{tab.title}</span>
            </span>
          </span>
        ))}
        <span className="bf-tabSlot">
          <span aria-hidden className="bf-sep" />
        </span>
        <Plus className="bf-newTab" aria-hidden />
      </div>
      <div className="bf-toolbar">
        <ArrowLeft className="bf-nav" aria-hidden />
        <ArrowRight className="bf-nav" style={{ opacity: 0.4 }} aria-hidden />
        <RotateCw className="bf-nav" aria-hidden />
        <span className="bf-omnibox">
          <Lock className="bf-lock" aria-hidden />
          <span className="bf-url">{url}</span>
          <Star className="bf-star" aria-hidden />
        </span>
        <img src="/browser/avatar.png" alt="" width={28} height={28} aria-hidden className="bf-avatar" />
        <MoreVertical className="bf-nav" aria-hidden />
      </div>
      <div className="bf-content">{children}</div>
    </div>
  );
}
