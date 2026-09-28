// Mock backend for the landing page demo. The panel in this folder is an unmodified copy of
// 5MTrader-MT5-API/wwwroot/index.html; this script replaces fetch and EventSource so it runs
// on simulated accounts: a master trades on its own and the slaves copy it about 1s later.
(() => {
  const MASTER_PATH = '/mt5/FTMO-Demo/1514761741';
  const r2 = (n) => Math.round(n * 100) / 100;

  // One symbol is active at a time; its full cycle (open -> modify -> partial -> close) finishes
  // before the next symbol starts, so an account never holds more than 4 orders at once.
  const SYMBOLS = ['BTCUSD', 'EURUSD', 'XAUUSD'];
  const DECIMALS = { BTCUSD: 2, EURUSD: 5, XAUUSD: 2 };
  const CONTRACT = { BTCUSD: 1, EURUSD: 100000, XAUUSD: 100 };
  const ANCHOR = { BTCUSD: 84436.5, EURUSD: 1.085, XAUUSD: 2650.0 };
  const VOL = { BTCUSD: 14, EURUSD: 0.0006, XAUUSD: 1.2 };

  const prices = { ...ANCHOR };
  const rr = (n, symbol) => { const f = 10 ** DECIMALS[symbol]; return Math.round(n * f) / f; };
  const off = (symbol, ratio) => rr(prices[symbol] * ratio, symbol);

  function config(role, lotMultiplier) {
    const c = { role, copyEnabled: true };
    if (role !== 'slave') return c;
    return {
      ...c, masterTcpUrl: location.hostname + MASTER_PATH,
      lotType: 'multiplier', lotMultiplier, fixedLot: 0.01,
      reverseTrading: false, copyPendingOrders: true, copySlTp: true, exactMatch: false, noTradeTag: false,
      prefix: { enabled: false, value: '', action: 'add' }, suffix: { enabled: false, value: '', action: 'add' },
      symbolTranslations: [], symbolFilterMode: 'off', symbolFilterList: [],
    };
  }

  function account(id, server, role, lotMultiplier, balance, nextTicket) {
    return { id, server, balance, nextTicket, orders: [], config: config(role, lotMultiplier) };
  }

  const accounts = [
    account('1514761741', 'FTMO-Demo', 'master', 1, 99968.8, 551068819),
    account('35041861', 'FundedNext-Server 3', 'slave', 0.5, 6000, 7120448),
    account('61581943', 'Pepperstone-Demo', 'slave', 1, 64477.97, 389945256),
    account('52201937', 'ICMarketsSC-Demo02', 'slave', 2, 25310.42, 1893310527),
  ];
  const master = accounts[0];

  function isCopying(a) {
    const c = a.config;
    return c.role === 'slave' && c.copyEnabled && !!c.masterTcpUrl && c.masterTcpUrl.endsWith(MASTER_PATH);
  }

  function lots(a, volume) {
    const c = a.config;
    if (a === master) return volume;
    if (c.lotType === 'fixed') return c.fixedLot || 0.01;
    return Math.max(0.01, r2(volume * (c.lotMultiplier || 1)));
  }

  function profit(o) {
    if (o.type !== 'market') return 0;
    const diff = o.side === 'buy' ? prices[o.symbol] - o.price : o.price - prices[o.symbol];
    return diff * o.volume * CONTRACT[o.symbol];
  }

  // ---- trading operations, applied first to the master and then to each slave ----

  function apply(a, op) {
    const mine = (o) => o.mt === op.mt;
    const c = a.config;
    if (op.k === 'open') {
      if (a !== master && op.type !== 'market' && !c.copyPendingOrders) return;
      const flip = a !== master && c.reverseTrading;
      const side = flip ? (op.side === 'buy' ? 'sell' : 'buy') : op.side;
      const withSlTp = a === master || c.copySlTp;
      a.orders.push({
        ticket: a === master ? op.mt : a.nextTicket, mt: op.mt, symbol: op.symbol, type: op.type, side,
        volume: lots(a, op.volume), price: op.type === 'market' ? prices[op.symbol] : op.price,
        sl: withSlTp && !flip ? op.sl : null, tp: withSlTp && !flip ? op.tp : null, openedAt: Date.now(),
      });
      a.nextTicket++;
    } else if (op.k === 'modify') {
      if (a !== master && !c.copySlTp) return;
      for (const o of a.orders) if (mine(o)) { o.sl = op.sl; o.tp = op.tp; }
    } else if (op.k === 'partial') {
      for (const o of a.orders) {
        if (!mine(o)) continue;
        const volume = lots(a, op.volume);
        if (volume >= o.volume) continue;
        a.balance += profit(o) * (1 - volume / o.volume);
        o.volume = volume;
      }
    } else if (op.k === 'close') {
      for (const o of a.orders) if (mine(o)) a.balance += profit(o);
      a.orders = a.orders.filter((o) => !mine(o));
    }
  }

  // One round of master activity on a single symbol; at most 4 orders are open at once
  // (market buy, pending limit, pending stop, market sell) before the round closes them all.
  function round(symbol) {
    let mkt = 0, lim = 0, stp = 0, mkt2 = 0;
    return [
      () => ({ k: 'open', mt: (mkt = master.nextTicket), symbol, type: 'market', side: 'buy', volume: 0.1, sl: null, tp: null }),
      () => ({ k: 'open', mt: (lim = master.nextTicket), symbol, type: 'limit', side: 'buy', volume: 0.07,
               price: rr(prices[symbol] - off(symbol, 0.00071), symbol), sl: rr(prices[symbol] - off(symbol, 0.0013), symbol), tp: rr(prices[symbol] + off(symbol, 0.00142), symbol) }),
      () => ({ k: 'modify', mt: mkt, sl: rr(prices[symbol] - off(symbol, 0.00095), symbol), tp: rr(prices[symbol] + off(symbol, 0.00178), symbol) }),
      () => ({ k: 'open', mt: (stp = master.nextTicket), symbol, type: 'stop', side: 'sell', volume: 0.05,
               price: rr(prices[symbol] - off(symbol, 0.00107), symbol), sl: rr(prices[symbol] - off(symbol, 0.00047), symbol), tp: rr(prices[symbol] - off(symbol, 0.00237), symbol) }),
      () => ({ k: 'open', mt: (mkt2 = master.nextTicket), symbol, type: 'market', side: 'sell', volume: 0.07, sl: null, tp: null }),
      () => ({ k: 'partial', mt: mkt, volume: 0.05 }),
      () => ({ k: 'close', mt: lim }),
      () => ({ k: 'close', mt: mkt }),
      () => ({ k: 'close', mt: stp }),
      () => ({ k: 'close', mt: mkt2 }),
    ];
  }

  let symbolIdx = 0;
  let currentSymbol = SYMBOLS[symbolIdx];
  let steps = round(currentSymbol);
  let stepIndex = 0;

  // Prime the demo so it never renders empty: apply the first two "open" steps of the first
  // symbol immediately (master + copying slaves), then let the timer-driven cycle take over
  // from the modify step onward.
  for (let i = 0; i < 2; i++) {
    const op = steps[stepIndex++]();
    apply(master, op);
    for (const a of accounts) if (isCopying(a)) apply(a, op);
  }

  function step() {
    if (stepIndex === steps.length) {
      symbolIdx = (symbolIdx + 1) % SYMBOLS.length;
      currentSymbol = SYMBOLS[symbolIdx];
      steps = round(currentSymbol);
      stepIndex = 0;
    }
    const op = steps[stepIndex++]();
    apply(master, op);
    pushAccounts();
    for (const a of accounts) {
      if (!isCopying(a)) continue;
      setTimeout(() => { if (accounts.includes(a)) { apply(a, op); pushAccounts(); } }, 700 + Math.random() * 400);
    }
    setTimeout(step, 3000);
  }

  // ---- API snapshots, same shape as AccountSnapshotDto ----

  function snapshot(a) {
    const positions = a.orders.filter((o) => o.type === 'market');
    const pendings = a.orders.filter((o) => o.type !== 'market');
    const pnl = positions.reduce((sum, o) => sum + profit(o), 0);
    const now = Date.now();
    return {
      account_id: a.id, server: a.server, server_name: a.server, is_live: false,
      role: a.config.role, status: 'online', reconnect_type: null,
      tcp_path: a.config.role === 'master' ? MASTER_PATH : null,
      balance: r2(a.balance), equity: r2(a.balance + pnl), pnl: r2(pnl),
      open_orders: positions.length, pending_orders: pendings.length,
      open_positions: positions.map((o) => ({
        ticket: o.ticket, symbol: o.symbol, type: 'market', side: o.side, volume: o.volume, open_price: o.price,
        sl: o.sl, tp: o.tp, open_time: Math.floor(o.openedAt / 1000), age_seconds: Math.floor((now - o.openedAt) / 1000),
        profit: r2(profit(o)), swap: 0, commission: 0, magic: o.mt,
      })),
      pending_order_list: pendings.map((o) => ({
        ticket: o.ticket, symbol: o.symbol, type: o.type, side: o.side, volume: o.volume, price: o.price,
        sl: o.sl, tp: o.tp, expire: null, magic: o.mt, reduce_only: null,
      })),
      copyTradingConfig: a.config,
    };
  }

  const list = () => accounts.map(snapshot);

  // ---- EventSource replacement for /api/events ----

  const sources = [];
  function emit(type, data) {
    const ev = { data: JSON.stringify(data) };
    for (const s of sources) for (const fn of s.listeners[type] || []) fn(ev);
  }
  function pushAccounts() { emit('accounts', list()); }

  window.EventSource = class {
    constructor() {
      this.listeners = {};
      sources.push(this);
      setTimeout(() => { if (this.onopen) this.onopen(); pushAccounts(); expandAll(); }, 150);
    }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    close() {}
  };

  // The panel starts with every account collapsed; open them all once, like a user would.
  function expandAll() {
    for (let i = 0; i < accounts.length; i++) {
      const btn = [...document.querySelectorAll('#accounts td.rowActions button')].find((b) => b.textContent === 'Orders');
      if (!btn) break;
      btn.click();
    }
  }

  // ---- fetch replacement for /api/* ----

  function reply(data, status = 200) {
    const body = status === 200 ? { success: true, data } : { success: false, errors: [data] };
    return new Promise((resolve) => setTimeout(() => resolve(new Response(JSON.stringify(body), {
      status, headers: { 'content-type': 'application/json' },
    })), 120));
  }

  window.fetch = async (path, opts = {}) => {
    const method = (opts.method || 'GET').toUpperCase();
    const body = opts.body ? JSON.parse(opts.body) : null;
    const parts = String(path).split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);

    if (parts[1] === 'session') return reply({ authRequired: false });
    if (parts[1] === 'logout') return reply(null);
    if (parts[1] === 'servers') {
      const q = parts[2] || '';
      const name = q.charAt(0).toUpperCase() + q.slice(1);
      return reply([{ company_label: name, results: [{ name: name + '-Demo' }, { name: name + '-Server' }] }]);
    }
    if (parts[1] !== 'accounts') return reply('not found', 404);
    if (parts.length === 2) return reply(list());

    const [server, id] = [parts[2], parts[3]];
    let a = accounts.find((x) => x.server === server && x.id === id);
    if (method === 'DELETE') {
      if (!a) return reply('account not found', 404);
      accounts.splice(accounts.indexOf(a), 1);
    } else if (method === 'PUT') {
      const next = (body && body.copyTradingConfig) || {};
      if (!a) {
        a = account(id, server, next.role || 'pending', 1, 10000, 100000000 + Math.floor(Math.random() * 1e6));
        accounts.push(a);
      }
      a.config = { ...config(next.role || a.config.role, 1), ...a.config, ...next };
    }
    setTimeout(pushAccounts, 0);
    return reply(a ? snapshot(a) : null);
  };

  // ---- market ticks and server stats ----

  setInterval(() => {
    for (const s of SYMBOLS) prices[s] = rr(prices[s] + (Math.random() - 0.5) * VOL[s] + (ANCHOR[s] - prices[s]) * 0.02, s);
    pushAccounts();
  }, 1000);

  setInterval(() => {
    const total = 4 * 1024 ** 3;
    const ramPercent = 18 + Math.random() * 0.4;
    emit('stats', { cpuPercent: 2 + Math.random() * 3, ramPercent, ramUsedBytes: total * ramPercent / 100, ramTotalBytes: total });
  }, 2000);

  setTimeout(step, 3000);
})();
