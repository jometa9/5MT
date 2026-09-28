"use client";

import { useLayoutEffect, useRef, useState } from "react";
import BrowserFrame from "./BrowserFrame";

// The real web panel (public/panel/index.html) running on mock data (public/panel/mock.js),
// inside a browser window. Everything is laid out at a fixed desktop size and scaled to fit.

const W = 1200;
const H = (W * 3) / 5;
const CHROME_H = 88; // tab strip + toolbar

export default function PanelDemo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.665);

  useLayoutEffect(() => {
    const frame = frameRef.current!;
    const measure = () => setScale(frame.clientWidth / W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="demo" ref={frameRef} style={{ height: (H + CHROME_H) * scale + 2 }}>
      <div className="demoScaled" style={{ width: W, transform: `scale(${scale})` }}>
        <BrowserFrame tabTitle="5MT" url="5mt-copy-server.up.railway.app">
          <iframe
            src={process.env.BASE_PATH + "/panel/index.html"}
            title="5MT Copy Server web panel, live demo with simulated accounts"
            width={W}
            height={H}
          />
        </BrowserFrame>
      </div>
    </figure>
  );
}
