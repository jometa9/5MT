"use client";

import { useLayoutEffect, useRef, useState } from "react";
import BrowserFrame, { type Tab } from "./BrowserFrame";

// A real page of the product (the web panel in public/panel/ on mock data from public/panel/mock.js,
// or the Swagger page in public/swagger/) inside a browser window. Everything is laid out at a fixed
// desktop size and scaled to fit.

const W = 1200;
const CHROME_H = 88; // tab strip + toolbar

// The demo is a picture of the page, so nothing inside it scrolls: every scroll container the page
// has (or renders later, like the panel tables or Swagger code blocks) is turned into overflow: hidden.
function disableScrolling(iframe: HTMLIFrameElement) {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) return;
  doc.documentElement.style.setProperty("overflow", "hidden", "important");
  doc.body.style.setProperty("overflow", "hidden", "important");
  const scrolls = /auto|scroll/;
  const sweep = () => {
    for (const el of doc.body.querySelectorAll<HTMLElement>("*")) {
      const s = win.getComputedStyle(el);
      if (scrolls.test(s.overflowX) || scrolls.test(s.overflowY)) el.style.setProperty("overflow", "hidden", "important");
    }
  };
  sweep();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    win.requestAnimationFrame(() => { queued = false; sweep(); });
  }).observe(doc.body, { childList: true, subtree: true });
}

export default function PanelDemo({
  src,
  url,
  tabs,
  active,
  title,
  height = (W * 3) / 5,
}: {
  src: string;
  url: string;
  tabs: Tab[];
  active: number;
  title: string;
  height?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.665);

  useLayoutEffect(() => {
    const frame = frameRef.current!;
    const measure = () => setScale(frame.clientWidth / W);
    measure();
    // The prerendered iframe can finish loading before hydration attaches onLoad.
    if (iframeRef.current?.contentDocument?.readyState === "complete") disableScrolling(iframeRef.current);
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="demo" ref={frameRef} style={{ height: (height + CHROME_H) * scale + 2 }}>
      <div className="demoScaled" style={{ width: W, transform: `scale(${scale})` }}>
        <BrowserFrame tabs={tabs} active={active} url={url}>
          <iframe
            ref={iframeRef}
            src={process.env.BASE_PATH + src}
            title={title}
            width={W}
            height={height}
            scrolling="no"
            onLoad={e => disableScrolling(e.currentTarget)}
          />
        </BrowserFrame>
      </div>
    </figure>
  );
}
