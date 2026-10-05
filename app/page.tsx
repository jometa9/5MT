import PanelDemo from "./PanelDemo";

// Both demos show the same tabs (panel and Swagger), each with its own one active.
const demoTabs = [
  { title: "5MT", icon: process.env.BASE_PATH + "/cube.svg" },
  { title: "5MTrader MT5 API", icon: process.env.BASE_PATH + "/swagger/favicon-32x32.png" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "5MT Copy Server",
      "url": "https://5mtrader.com/",
      "description": "Self-hosted copy trading server for MT5. Copies market and pending orders, SL/TP, partial closes and modifications from one master account to many slave accounts on any broker.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Linux, Docker",
      "image": "https://5mtrader.com/og-image.jpg",
      "offers": {
        "@type": "Offer",
        "price": "2500",
        "priceCurrency": "USD",
        "description": "One-time payment in USDT (TRC20), lifetime access to the private source repository.",
        "availability": "https://schema.org/InStock",
        "url": "https://5mtrader.com/"
      }
    }
  ]
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header>
        <h1>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 28 28" width="36" height="36" fill="none" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" fill="#ffffff" stroke="#000000" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" d="M11.5144 1.12584C11.8164 0.958052 12.1836 0.958052 12.4856 1.12584L21.4845 6.12522C21.4921 6.12942 21.4996 6.13372 21.5071 6.13813C21.8125 6.31781 22 6.64568 22 7V17C22 17.3632 21.8031 17.6978 21.4856 17.8742L12.4856 22.8742C12.1791 23.0445 11.8059 23.0416 11.5022 22.8673L2.51436 17.874C2.19689 17.6977 2 17.3631 2 16.9999V7C2 6.64568 2.18749 6.3177 2.49287 6.13802L2.5073 6.13784L2.51436 6.12584L11.5144 1.12584ZM12.0001 10.856L5.05923 6.99995L12 3.14396L18.9409 7L12.0001 10.856ZM4 8.69951V16.4115L11 20.3004V12.5884L4 8.69951ZM13 12.5884V20.3005L20 16.4116V8.69951L13 12.5884Z" />
          </svg>
          5MT Copy Server
        </h1>
        <p className="subtitle">Self-hosted copy trading server for MT5.</p>
        <p className="subtitle">速度に取り憑かれている。</p>
      </header>

      <nav className="actions" aria-label="Sections">
        <a className="btn ff" href="#copy-trading-server">copy trading server</a>
        <a className="btn sw" href="#api-server">api server</a>
      </nav>

      <section id="copy-trading-server">
        <h2 className="sectionTitle">copy trading server</h2>

        <PanelDemo
          src="/panel/index.html"
          url="5mt-copy-server.up.railway.app"
          tabs={demoTabs}
          active={0}
          title="5MT Copy Server web panel, live demo with simulated accounts"
        />

        <fieldset>
          <legend><h2>what</h2></legend>
          <p><b>Self-hosted copy trading server for MT5.</b></p>
          <p>How it works:</p>
          <ol>
            <li>Connect your MT5 accounts.</li>
            <li>Mark one as <b>master</b> and the rest as <b>slaves</b>.</li>
            <li>Every trade the master opens, modifies or closes is repeated on the slaves,
            about one second behind the broker.</li>
          </ol>
          <p>What you need:</p>
          <ul>
            <li>Any broker, demo or live.</li>
            <li>No MT5 terminal, no EA, no Windows VPS.</li>
            <li>Everything runs on your own server and is managed from a web page.</li>
          </ul>
        </fieldset>

        <fieldset>
          <legend><h2>features</h2></legend>
          <ul>
            <li>Market and pending orders, SL/TP, partial closes, modifications.</li>
            <li>Lot multiplier or fixed lot, clamped to broker limits.</li>
            <li>Reverse trading, symbol prefix/suffix, symbol translations, symbol allow/block filters.</li>
            <li>Exact match mode: the slave mirrors the master and stray orders are closed.</li>
            <li>Reconciles state after restarts and reconnections.</li>
            <li>Live balance, equity, PnL and open orders of every account, plus server CPU and RAM.</li>
            <li>Close all: closes every position and pending order on every account in one click, masters first.</li>
            <li>History of closed orders, per account or all accounts together: today, current month, current year or lifetime (UTC).</li>
            <li>Stats: total PnL, winrate, max win, max loss, average win, average loss, R and trade count. Deposits, withdrawals and credits are left out.</li>
            <li>Password-protected web panel, works on mobile.</li>
            <li>Deploy on Railway in minutes, or with Docker on any server.</li>
          </ul>
        </fieldset>
      </section>

      <section id="api-server">
        <h2 className="sectionTitle">api server</h2>

        <PanelDemo
          src="/swagger/index.html"
          url="5mt-copy-server.up.railway.app/swagger/index.html"
          tabs={demoTabs}
          active={1}
          title="5MTrader MT5 API Swagger page"
          height={800}
        />

        <fieldset>
          <legend><h2>what</h2></legend>
          <p><b>HTTP API for MT5, on the same server.</b></p>
          <p>Trade, read accounts and get prices on any MT5 broker from your own code, with plain JSON
          requests. No MT5 terminal, no EA. Accounts added through the API show up in the web panel and
          vice versa.</p>
          <div className="actions">
            <a className="btn sw" href={process.env.BASE_PATH + "/swagger/index.html"} target="_blank" rel="noopener">Open the Swagger page</a>
          </div>
        </fieldset>

        <fieldset>
          <legend><h2>features</h2></legend>
          <ul>
            <li>Accounts: add, list, remove, balance and equity, copy trading config.</li>
            <li>Orders: open market and pending orders, modify SL/TP or pending price, close, close by, close all.</li>
            <li>Open positions, pending orders and closed order history.</li>
            <li>Market data: current price, 1-minute bars, trading hours of a symbol.</li>
            <li>Broker server search and demo account creation.</li>
            <li>Raw TCP feed with the trades of every master account.</li>
            <li>Same JSON envelope on every response and clear status codes for broker errors.</li>
            <li>Swagger page with every endpoint documented, served by the server itself.</li>
          </ul>
        </fieldset>
      </section>

      <fieldset>
        <legend><h2>get it</h2></legend>
        <p className="price">$2,500 USDT <span className="muted">one-time, lifetime access</span></p>
        <p>You get access to the private GitHub repository with the full source code and
        step-by-step instructions to set everything up.</p>
        <ol style={{ marginTop: 10 }}>
          <li>Send the payment to the TRON (TRC20) wallet below.</li>
          <li>Message me on Telegram with the transaction hash and your GitHub username.</li>
          <li>I add you to the repository.</li>
        </ol>
        <div className="form" style={{ marginTop: 14 }}>
          <span>network</span><span>TRON (TRC20) · USDT only</span>
          <span>wallet</span>
          <span className="row"><code id="wallet">TUHW3zJ4qoFmBkqCP64rc1XMAcvNLxYkCa</code></span>
          <span className="qr">
            <svg width="160" height="160" role="img" aria-label="Wallet QR code" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" shapeRendering="crispEdges">
              <path fill="#ffffff" d="M0 0h29v29H0z" />
              <path stroke="#000000" d="M0 0.5h7m2 0h2m1 0h1m1 0h1m2 0h4m1 0h7M0 1.5h1m5 0h1m1 0h1m1 0h4m3 0h2m3 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h3m3 0h1m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m2 0h1m1 0h3m6 0h1m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m7 0h2m2 0h1m1 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 7.5h2m1 0h1m2 0h1m3 0h1M0 8.5h1m1 0h1m1 0h1m1 0h1m2 0h1m6 0h3m5 0h1m2 0h1M1 9.5h1m1 0h1m1 0h1m3 0h2m1 0h2m1 0h1m1 0h1m3 0h6M0 10.5h1m2 0h1m2 0h1m1 0h1m5 0h3m1 0h1m3 0h1m5 0h1M0 11.5h1m1 0h2m1 0h1m3 0h2m1 0h4m3 0h1m5 0h1m1 0h2M3 12.5h2m1 0h1m3 0h1m3 0h1m2 0h3m2 0h2m2 0h1M0 13.5h3m2 0h1m3 0h1m1 0h2m1 0h1m2 0h2m3 0h2m2 0h1m1 0h1M3 14.5h2m1 0h2m5 0h1m1 0h1m2 0h1m1 0h4m4 0h1M3 15.5h3m4 0h1m1 0h1m2 0h1m2 0h1m4 0h1m1 0h4M0 16.5h1m1 0h1m3 0h2m3 0h2m3 0h4m5 0h1m1 0h2M1 17.5h3m3 0h1m3 0h3m4 0h2m2 0h3m1 0h1m1 0h1M0 18.5h1m1 0h1m2 0h5m1 0h2m1 0h2m1 0h2m4 0h1m1 0h4M1 19.5h2m1 0h1m2 0h1m1 0h1m3 0h6m2 0h1m3 0h1m2 0h1M0 20.5h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h1m2 0h8m3 0h1M8 21.5h2m4 0h1m2 0h1m2 0h1m3 0h1M0 22.5h7m2 0h1m3 0h1m1 0h3m2 0h1m1 0h1m1 0h4M0 23.5h1m5 0h1m2 0h2m1 0h1m2 0h6m3 0h2m1 0h2M0 24.5h1m1 0h3m1 0h1m1 0h1m1 0h3m2 0h4m1 0h7m1 0h1M0 25.5h1m1 0h3m1 0h1m2 0h2m6 0h1m1 0h1m1 0h2m1 0h4M0 26.5h1m1 0h3m1 0h1m1 0h3m1 0h1m3 0h2m10 0h1M0 27.5h1m5 0h1m5 0h1m1 0h4m1 0h3m1 0h1m1 0h1m1 0h2M0 28.5h7m1 0h2m5 0h1m1 0h2m2 0h2m2 0h1m2 0h1" />
            </svg>
          </span>
        </div>
        <div className="actions">
          <a className="btn tg" id="telegram" href="https://t.me/jometayer" target="_blank" rel="noopener">Contact on Telegram</a>
        </div>
      </fieldset>

      <footer style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        <img src="https://avatars.githubusercontent.com/u/83543601?v=4" alt="" width={80} height={80} style={{ display: "block", border: "1px solid #000" }} />
        <span className="subtitle">by <a href="https://github.com/jometa9" target="_blank" rel="noopener">github.com/jometa9</a></span>
      </footer>
    </main>
  );
}
