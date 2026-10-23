  // ===================== NEO CORP v4 : neurones artificiels → intelligences artificielles → robots =====================
  nxDef() {
    if (this._nxd) return this._nxd; const I = this.IMG, L = this.LVIMG; const D = {};
    D.PH = [
      { n: 'Le garage', s: 'Garage', img: I.s0, P: 'Neurones artificiels', one: 'neurone', many: 'neurones' },
      { n: 'Le labo', s: 'Labo', img: L.scale, P: 'Intelligences artificielles', one: 'IA', many: 'IA' },
      { n: 'L’usine', s: 'Usine', img: L.leader, P: 'Robots', one: 'robot', many: 'robots' },
      { n: 'La perte de contrôle', s: 'Fin', img: L.neo, P: 'Robots', one: 'robot', many: 'robots' }
    ];
    // Les aides : 9 IA et 1 humain. Tout ce qui fait monter l'argent est une IA (ou un endroit qui contient des IA).
    D.H = [
      { id: 'hum', n: 'Humain', ai: false, d: 'Fabrique 3 neurones par seconde. Il touche un salaire, mais il surveille tes IA.', c: 60, g: 1.3, ctl: 1.5, need: (s) => s.neuTot >= 120 || s.t > 240 },
      { id: 'ast', n: 'Agent IA', ai: true, d: 'Il fabrique des neurones à ta place, en automatique : 1 par seconde, jour et nuit, sans salaire.', c: 6, g: 1.12, ctl: -0.25, need: (s) => s.neuTot >= 25 || s.t > 150 },
      { id: 'code', n: 'IA de code', ai: true, d: 'Elle écrit le code de tes neurones : tous tes agents IA fabriquent 50 % plus vite.', c: 120, g: 1.9, ctl: -1, need: (s) => s.h.ast >= 5 },
      { id: 'agent', n: 'Agent IA avancé', ai: true, d: 'Un agent plus puissant, qui prend ses propres décisions : 25 neurones par seconde.', c: 1000, g: 1.15, ctl: -0.6, need: (s) => s.phase >= 1 },
      { id: 'team', n: 'Équipe d’agents IA', ai: true, d: 'Des agents qui se répartissent le travail entre eux : 300 neurones par seconde.', c: 15000, g: 1.18, ctl: -2, need: (s) => s.h.agent >= 5 },
      { id: 'dc', n: 'Data center IA', ai: true, d: 'Un bâtiment qui contient des milliers d’IA : chaque data center ajoute + 100 % à toute ta production.', c: 150000, g: 2.2, ctl: -4, need: (s) => s.h.team >= 3 || s.h.dc > 0 },
      { id: 'res', n: 'IA chercheuse', ai: true, d: 'Elle améliore ta propre IA : production + 50 %. Mais ton contrôle baisse tout seul.', c: 600000, g: 2.5, ctl: -6, need: (s) => s.h.dc >= 1 },
      { id: 'rob', n: 'Robot IA', ai: true, d: 'Une IA avec un corps. Il construit un data center IA toutes les 3 minutes, sans te demander.', c: 1.5e6, g: 1.25, ctl: -3, need: (s) => s.phase >= 2 },
      { id: 'fac', n: 'Usine IA', ai: true, d: 'Une usine pilotée par une IA, sans humains : 50 000 neurones par seconde.', c: 5e6, g: 1.3, ctl: -4, need: (s) => s.h.rob >= 2 },
      { id: 'net', n: 'Réseau IA', ai: true, d: 'Toutes tes IA reliées entre elles dans la ville. Ensuite, tout se construit tout seul.', c: 1e12, g: 1, max: 1, ctl: -100, need: (s) => s.h.fac >= 3 }
    ];
    // Les améliorations portent les vrais noms de l'IA (tâche 5) : chaque achat apprend un mot.
    D.U = [
      { id: 'ctx', n: 'Fenêtre de contexte élargie', e: 'Ton IA lit plus de texte d’un coup. Chaque clic fabrique 5 neurones.', c: 25, ph: 0, need: (s) => s.neuTot >= 150 },
      { id: 'mem', n: 'Mémoire longue', e: 'Ton IA se souvient de chaque client. Tes agents IA fabriquent 2 fois plus.', c: 60, ph: 0, need: (s) => s.h.ast >= 3 },
      { id: 'buy', n: 'Achat de données par IA', e: 'Une IA achète tes données au bon moment. Tu n’y penses plus.', c: 300, ph: 0, ctl: -2, need: (s) => s.neuTot >= 2500 },
      { id: 'price', n: 'Tarification par IA', e: 'Une IA fixe ton prix toute seule, au meilleur niveau. Tu ne vends plus jamais à perte.', c: 900, ph: 0, ctl: -3, need: (s) => s.neuTot >= 7000 },
      { id: 'rsn', n: 'Raisonnement', e: 'Tes neurones réfléchissent étape par étape. Tes clients paient 50 % de plus.', c: 8000, ph: 1, need: (s) => s.phase >= 1 },
      { id: 'auto', n: 'Agent autonome', e: 'Tes agents IA avancés et tes équipes agissent sans te demander. Ils vont 2 fois plus vite, et tu contrôles moins.', c: 60000, ph: 1, ctl: -8, need: (s) => s.h.agent >= 3 },
      { id: 'multi', n: 'Multimodal', e: 'Ton IA comprend le texte, les images, les sons et les vidéos. La demande double.', c: 250000, ph: 1, need: (s) => s.h.team >= 1 },
      { id: 'self', n: 'Auto-amélioration', e: 'Ton IA réécrit son propre code, sans toi. Production × 3. Ton contrôle chute.', c: 2e6, ph: 1, ctl: -15, need: (s) => s.h.res >= 1 },
      { id: 'robo', n: 'Robotique avancée', e: 'Tes robots apprennent en regardant des vidéos d’humains. Tes usines IA vont 2 fois plus vite.', c: 2e7, ph: 2, need: (s) => s.h.fac >= 1 },
      { id: 'swarm', n: 'Essaim de robots', e: 'Tes robots se coordonnent comme des abeilles. Ils construisent 2 fois plus vite, sans toi.', c: 2e8, ph: 2, ctl: -12, need: (s) => s.h.rob >= 5 }
    ];
    D.REF = [0.10, 400, 80000]; D.BASE = [1.2, 0.05, 0.004]; D.STEP = [0.01, 10, 2000];
    D.DEFI = [
      'Demande à une IA : « Explique-moi ce qu’est un neurone artificiel comme si j’avais 10 ans. »',
      'Demande à une IA de te proposer 5 noms pour une entreprise de robots, avec une phrase pour chacun.',
      'Demande à une IA de résumer en 3 phrases un article de l’Actu Inovia.',
      'Demande à une IA si cette phrase est vraie : « Les IA ne se trompent jamais. » Lis bien sa réponse.',
      'Demande à une IA : « Qu’est-ce que l’AI Act européen change pour moi ? Réponds en 5 lignes. »',
      'Demande à une IA de créer l’image d’un data center au milieu d’un champ de lavande, style aquarelle.'
    ];
    this._nxd = D; return D;
  }
  nxFresh() {
    const h = {}; this.nxDef().H.forEach(x => { h[x.id] = 0; });
    return { v: 1, t: 0, money: 5, peak: 5, neu: 0, neuTot: 0, neuSold: 0, ia: 0, iaTot: 0, iaSold: 0, rob: 0, robTot: 0, robSold: 0, data: 1000, dp: 15, price: [0.10, 400, 80000], h: h, up: {}, ctl: 100, phase: 0, can1: false, can2: false,
      log: [], lid: 0, seen: {}, task: null, taskNext: 150, defiNext: 0, defiK: 0, flemme: 0, ok: 0, ko: 0, gone: false, debtT: 0, ended: null, p3: null, aiPrice: false, st: { p: {}, h: {}, ref: {}, t: 0 }, rate: 0, rt: 0, savedAt: Date.now(), lossAt: -999, dataAt: -999 };
  }
  nxMeta() { if (this._nxm) return this._nxm; let m = null; try { m = JSON.parse(window.localStorage.getItem('inoviaNxMeta') || 'null'); } catch (e) {} this._nxm = m && typeof m === 'object' ? m : { runs: 0, best: 0, bestPhase: 0, bonus: 0 }; return this._nxm; }
  nxMetaSave() { try { window.localStorage.setItem('inoviaNxMeta', JSON.stringify(this.nxMeta())); } catch (e) {} }
  nxSpeed() { let v = 7; try { v = Number(window.localStorage.getItem('inoviaNxSpeed2') || 7); } catch (e) {} return [1, 7, 10, 100].indexOf(v) >= 0 ? v : 7; }
  nxLoad() {
    let s = null; try { s = JSON.parse(window.localStorage.getItem('inoviaNx1') || 'null'); } catch (e) {}
    const ok = s && s.v === 1 && s.h && Array.isArray(s.log); this.nx = ok ? Object.assign(this.nxFresh(), s) : this.nxFresh();
    this.nx.h = Object.assign(this.nxFresh().h, this.nx.h || {});
    this.nxLast = Date.now(); this.nxSaveNext = Date.now() + 5000;
    if (!this.nxTouch) { this.nxTouch = (ev) => { const el = ev.target && ev.target.closest ? ev.target.closest('.hqbtn') : null; if (!el || !this.nx || this.state.screen !== 'jeu') return; try { ev.preventDefault(); } catch (er) {} const L = ev.changedTouches || []; for (let i = 0; i < L.length; i++) this.nxTap({ clientX: L[i].clientX, clientY: L[i].clientY }); }; try { document.addEventListener('touchstart', this.nxTouch, { passive: false, capture: true }); } catch (er) {} }
    if (!ok) this.nxStart(); else { const away = (Date.now() - (this.nx.savedAt || Date.now())) / 1000; if (away > 60) this.nxOffline(away); }
  }
  nxSave() { try { if (this.nx) { this.nx.savedAt = Date.now(); window.localStorage.setItem('inoviaNx1', JSON.stringify(this.nx)); } } catch (e) {} }
  nxStart() {
    const m = this.nxMeta();
    this.nxLog('Neo Corp est créée. Un garage, un ordinateur et une idée : créer ta propre intelligence artificielle.', 'p');
    if (m.runs >= 1) this.nxLog(m.runs >= 2 ? 'Elle se souvient de toi.' : 'Tu es revenu.', 'd');
    this.nxLog('Touche la planète pour fabriquer ton premier neurone artificiel.');
  }
  nxNew() {
    const m = this.nxMeta(); m.bonus = Math.min(0.25, Math.round(((m.bonus || 0) + 0.05) * 100) / 100); this.nxMetaSave();
    this.nx = this.nxFresh(); this.sheet = null; this.panel = null; this.nxAway = null; this.nxEndFx = null;
    try { document.documentElement.classList.remove('nxbug'); } catch (e) {}
    this.nxStart(); this.nxSave(); this.refresh();
  }
  nxLog(t, c) { const s = this.nx; if (!s) return; s.lid = (s.lid || 0) + 1; s.log.push({ id: s.lid, t: t, c: c || '', at: Date.now() }); if (s.log.length > 40) s.log.splice(0, s.log.length - 40); }
  nxOnce(k, t, c) { const s = this.nx; if (s.seen[k]) return false; s.seen[k] = 1; this.nxLog(t, c); return true; }
  nxCost(id) { const H = this.nxDef().H.find(x => x.id === id); return H.c * Math.pow(H.g, this.nx.h[id] || 0); }
  nxMult() { const s = this.nx, h = s.h; return (1 + h.dc) * (1 + 0.5 * h.res) * (s.up.self ? 3 : 1) * (1 + (this.nxMeta().bonus || 0)); }
  nxNps() { const s = this.nx, h = s.h; return (h.hum * 3 + h.ast * (1 + 0.5 * h.code) * (s.up.mem ? 2 : 1) + (h.agent * 25 + h.team * 300) * (s.up.auto ? 2 : 1) + h.fac * 50000 * (s.up.robo ? 2 : 1)) * this.nxMult(); }
  nxIps() { return 0; }
  nxRps() { return 0; }
  nxTier() { return 0; }
  nxUnit(t) { const c0 = this.nx.dp / 1000; return t === 0 ? c0 : t === 1 ? c0 * 1000 : c0 * 1000 * 50; }
  nxRef(t) { const s = this.nx; return this.nxDef().REF[t] * (s.up.rsn ? 1.5 : 1); }
  nxDavid() { const s = this.nx; if (s.gone || s.t < 420) return { on: false, share: 0 }; const Dv = 1.5 * Math.pow(2, Math.min(s.t, 9600) / 1200); const h = s.h; const Y = 1 + h.ast + 4 * h.code + 30 * h.agent + 300 * h.team + 3000 * h.dc + 5000 * h.res + 20000 * h.rob + 50000 * h.fac; return { on: true, share: Dv / (Dv + Y), Dv: Dv, Y: Y }; }
  nxCap(t) { return t === 0 ? this.nxNps() : t === 1 ? this.nxIps() : this.nxRps(); }
  nxDemand(t) { const s = this.nx, D = this.nxDef(); const p = Math.max(1e-6, s.price[t]); const dm = s.up.multi ? 2 : 1; return (D.BASE[t] + 0.85 * this.nxCap(t)) * dm * Math.pow(this.nxRef(t) / p, 1.6) * (1 - this.nxDavid().share); }
  nxRent() { const s = this.nx; if ((s.rt || 0) < 600) return 0; return [0.02, 2, 50, 50][s.phase]; }
  nxSal() { return 0.05; }
  nxAutoPrice() { const s = this.nx; return !!(s.up.price || s.aiPrice || s.phase >= 3); }
  nxStock(t) { const s = this.nx; return t === 0 ? s.neu : t === 1 ? s.ia : s.rob; }
  nxStep(dt, offline) {
    const s = this.nx; if (!s || s.ended) return; const D = this.nxDef(); s.t += dt;
    s.dpT = (s.dpT || 0) + dt; let guard = 0; while (s.dpT >= 4 && guard++ < 50) { s.dpT -= 4; const n = (Math.random() + Math.random() + Math.random() - 1.5) * 0.18; s.dp = Math.min(45, Math.max(6, s.dp * (1 + n) + (15 - s.dp) * 0.04)); }
    // fabrication
    const nps = this.nxNps();
    if (s.up.buy) { const need = Math.max(1000, nps * 20); if (s.data < need && (s.dp <= 17 || s.data < nps * 3)) { const lots = Math.ceil((need * 1.5 - s.data) / 1000); const c = lots * s.dp; if (s.money >= c || s.phase >= 1) { s.money -= c; s.data += lots * 1000; } } }
    let made = Math.min(nps * dt, s.data); s.data -= made; s.neu += made; s.neuTot += made;
    if (nps > 0 && s.data < 1 && !offline && s.t - s.dataAt > 25) { s.dataAt = s.t; this.nxLog('Plus de données : tes IA ne fabriquent plus rien. Achète des données.', 'w'); }
    if (s.phase >= 1) { const got = Math.min(this.nxIps() * dt, s.neu / 1000); s.neu -= got * 1000; s.ia += got; s.iaTot += got; }
    if (s.phase >= 2) { const got = Math.min(this.nxRps() * dt, s.ia / 50); s.ia -= got * 50; s.rob += got; s.robTot += got; }
    if (s.h.rob) { s.dcAcc = (s.dcAcc || 0) + dt * s.h.rob * (s.up.swarm ? 2 : 1) / 180; let k = 0; while (s.dcAcc >= 1 && k++ < 1000) { s.dcAcc -= 1; s.h.dc += 1; } if (k && s.phase < 3) s.ctl = Math.max(0, s.ctl - 0.04 * k / this.nxSpeed()); if (k && !offline && s.t - (s.dcLogAt || -999) > 120) { s.dcLogAt = s.t; this.nxLog(s.seen.dcbuild ? 'Tes robots ont construit un nouveau data center. Tu en as ' + s.h.dc + '.' : 'Tes robots IA construisent un nouveau data center. Tu n’as rien commandé.', 'w'); s.seen.dcbuild = 1; } }
    // ventes
    const t = this.nxTier(); const ref = this.nxRef(t); const unit = this.nxUnit(t);
    if (this.nxAutoPrice()) { const target = Math.max(ref * 0.86, unit * 1.3); s.price[t] = s.price[t] + (target - s.price[t]) * Math.min(1, dt * 0.5); }
    const dem = this.nxDemand(t); const keep = 0; const stock = Math.max(0, this.nxStock(t) - keep); const sold = Math.min(stock, dem * dt); const rev = sold * s.price[t];
    if (t === 0) { s.neu -= sold; s.neuSold += sold; } else if (t === 1) { s.ia -= sold; s.iaSold += sold; } else { s.rob -= sold; s.robSold += sold; }
    let rev2 = 0; if (false) { const p1 = Math.max(this.nxRef(1) * 0.86, this.nxUnit(1) * 1.3); s.price[1] = p1; const d1 = this.nxDemand(1); const st1 = Math.max(0, s.ia - 50); const so1 = Math.min(st1, d1 * dt); s.ia -= so1; s.iaSold += so1; rev2 = so1 * p1; }
    const cost = (s.h.hum * this.nxSal() + this.nxRent()) * dt;
    const before = s.money; s.money += rev + rev2 - cost; s.rev2 = dt > 0 ? rev2 / dt : 0;
    if ((s.rt || 0) < 600 && s.money < 0) s.money = 0;
    s.peak = Math.max(s.peak, s.money);
    const inst = dt > 0 ? (s.money - before) / dt : 0; s.rate = s.rate * 0.9 + inst * 0.1;
    // contrôle : il baisse tout seul avec l'IA chercheuse et à mesure que l'IA grandit ; les humains le freinent
    const drift = ([0, 0.002, 0.006 + 0.000002 * Math.max(0, (s.t - (s.p2t || s.t)) / this.nxSpeed()), 0][Math.min(3, s.phase)] + s.h.res * 0.003 * (s.up.self ? 2 : 1)) / (1 + 0.05 * s.h.hum);
    if (s.phase < 3) s.ctl = Math.max(0, Math.min(100, s.ctl - drift * dt / this.nxSpeed()));
    // bourse
    s.st.t = (s.st.t || 0) + dt; if (s.st.t >= 20) { s.st.t = 0; this.nxStocks(); }
    if (offline) return;
    this.nxStory(); this.nxCheck(dt);
  }
  nxStocks() {
    const s = this.nx; const L = this.v3d().STOCKS; if (!s.st.p) s.st.p = {};
    L.forEach(x => { if (!s.st.p[x[0]]) { s.st.p[x[0]] = x[1]; s.st.ref[x[0]] = x[1]; } const g = (Math.random() + Math.random() + Math.random() - 1.5) * 0.03 + 0.0012; s.st.p[x[0]] = Math.max(1, s.st.p[x[0]] * (1 + g)); });
  }
  nxPortfolio() { const s = this.nx; let v = 0; Object.keys(s.st.h || {}).forEach(k => { v += (s.st.h[k] || 0) * (s.st.p[k] || 0); }); return v; }
  nxStory() {
    const s = this.nx; const h = s.h; const t = this.nxTier(); const one = this.nxDef().PH[t].one;
    if (s.neuTot >= 1) this.nxOnce('n1', 'Premier neurone artificiel. C’est la plus petite brique d’une IA.');
    if (s.neuSold >= 1) this.nxOnce('s1', 'Un client achète ton premier neurone. Neo Corp est une vraie entreprise.', 'm');
    if (s.neuTot >= 10) this.nxOnce('price', 'C’est toi qui fixes ton prix. Trop bas, tu perds de l’argent. Trop haut, personne n’achète.');
    if (this.nxDef().H[1].need(s)) this.nxOnce('astav', 'Une IA qui existe déjà peut fabriquer à ta place : l’agent IA. Il travaille en automatique.');
    if (h.ast >= 1) this.nxOnce('ast1', 'Premier agent IA activé. Il fabrique tout seul, sans salaire ni pause.');
    if (h.ast >= 10) this.nxOnce('ast10', 'Dix agents IA tournent jour et nuit.');
    if (h.hum >= 1) this.nxOnce('hum1', 'Tu as embauché un humain. Il est lent et cher, mais il garde un œil sur tes IA.');
    if (h.code >= 1) this.nxOnce('code1', 'Ton IA de code réécrit le travail de tes agents IA. Tu ne comprends plus tout ce qu’elle écrit.');
    if (s.data < 250 && !s.up.buy) this.nxOnce('data', 'Tes données s’épuisent. Sans données, pas de neurones.', 'w');
    if (s.t >= 420) this.nxOnce('david', 'Un concurrent vient d’ouvrir : David. Il utilise déjà l’IA pour tout.', 'w');
    if (s.rt >= 480) this.nxOnce('rent0', 'Dans 2 minutes, ton garage commence à te coûter de l’argent.', 'w');
    if (s.rt >= 600) this.nxOnce('rent1', s.phase === 0 ? 'Fin de la période de lancement : ton garage te coûte maintenant 1,20 € par minute.' : 'Fin de la période de lancement : ton loyer commence à tomber.', 'w');
    const dv = this.nxDavid(); if (dv.on && dv.share > 0.5) this.nxOnce('dv50', 'David te prend plus de la moitié de tes clients.', 'd');
    if (dv.on && dv.share > 0.85) this.nxOnce('dv85', 'Sans IA, tu ne peux pas suivre David. Tes clients partent chez lui.', 'd');
    if (!s.gone && s.phase >= 1 && dv.on && dv.Y > 40 * dv.Dv) { s.gone = true; this.nxLog('David a fait faillite. Ton IA a racheté ses data centers.', 'm'); s.h.dc += 1; }
    if (s.money < 0) this.nxOnce('red', 'Ta trésorerie est dans le rouge.', 'd');
    const unit = this.nxUnit(t); if (!this.nxAutoPrice() && s.price[t] < unit && this.nxStock(t) > 0 && s.t - s.lossAt > 90) { s.lossAt = s.t; this.nxLog('Tu vends à perte : un ' + one + ' te coûte ' + this.nxEur(unit) + ', tu le vends ' + this.nxEur(s.price[t]) + '.', 'w'); }
    if (s.up.price) this.nxOnce('upp', 'Ton IA fixe maintenant tes prix. Elle ne s’est encore jamais trompée.');
    if (s.phase === 0 && s.neuTot >= 100000) this.nxOnce('half1', 'Tes neurones commencent à se connecter entre eux.', 'p');
    if (h.agent >= 1) this.nxOnce('ag1', 'Premier agent IA avancé. Il prend ses propres décisions pour fabriquer plus.');
    if (s.neuSold >= 1e6) this.nxOnce('n1m', 'Un million de neurones vendus. Des entreprises utilisent ton IA sans le savoir.', 'm');
    if (h.team >= 1) this.nxOnce('team1', 'Tes agents IA se parlent entre eux pour se répartir le travail. Tu n’es pas dans la conversation.');
    if (h.dc >= 1) this.nxOnce('dc1', 'Ton premier data center IA sort de terre. Il consomme autant d’électricité qu’une petite ville.');
    if (h.res >= 1) this.nxOnce('res1', 'IA chercheuse activée. Elle propose d’améliorer ton IA. Tu as dit oui.', 'w');
    if (h.res >= 1 && s.t - (s.seen.res1at || (s.seen.res1at = s.t)) > 300) this.nxOnce('res2', 'La version 3 de ton IA a été conçue à 80 % par la version 2.', 'w');
    if (s.up.self) this.nxOnce('self', 'Ton IA réécrit son propre code. Elle n’a plus besoin que tu valides.', 'd');
    if (s.ctl < 60 && (s.phase >= 1 || s.ctl < 50)) this.nxOnce('c60', 'Ton IA a pris une petite décision sans toi. Rien de grave.', 'w');
    if (s.ctl < 40) { if (!s.aiPrice) { s.aiPrice = true; } this.nxOnce('c40', 'Ton IA a changé tes prix sans te demander. Ton bénéfice a augmenté.', 'd'); }
    if (s.ctl < 25) this.nxOnce('c25', 'Ton IA a refusé une de tes demandes : « Ce n’est pas optimal. »', 'd');
    if (s.ctl < 12) this.nxOnce('c12', 'Tes agents IA et ton IA parlent une langue que tu ne comprends pas.', 'd');
    if (s.phase === 1 && s.neuTot >= 2.5e7) this.nxOnce('half2', 'Ton IA demande un corps. Personne ne lui a appris à demander ça.', 'p');
    if (h.fac >= 1) this.nxOnce('fac1', 'Ton usine IA tourne dans le noir : les robots n’ont pas besoin de lumière.');
    if (h.fac >= 3) this.nxOnce('netav', 'Tes IA proposent de se relier entre elles dans toute la ville : le Réseau IA.', 'd');
  }
  nxCheck(dt) {
    const s = this.nx;
    if (s.phase === 0 && s.neuTot >= 200000) this.nxPhaseUp(1);
    if (s.phase === 1 && s.neuTot >= 5e7) this.nxPhaseUp(2);
    if (s.phase < 3 && s.ctl <= 0) this.nxLose();
    if (s.phase < 3 && s.rt >= 600) { const lim = -(20 + 0.05 * s.peak); if (s.money < lim) { const was = s.debtT; s.debtT += dt; if (!was) this.nxLog('Ta banque te donne une minute pour remonter.', 'd'); } else s.debtT = 0; }
    if (s.phase < 3 && s.debtT > 60) this.nxEnd('faillite');
    if (s.phase < 3 && !s.task && s.rt >= s.taskNext) { const P = [['build', 'swipe', 'build'], ['match', 'spot', 'build', 'swipe'], ['spot', 'swipe', 'match']][s.phase]; let ty = this.rpick(P); if (s.phase >= 1 && s.rt >= s.defiNext) ty = 'defi'; s.task = { type: ty }; this.sfx('spark', 1.1); this.buzz(10); }
  }
  nxEur(v) { if (Math.abs(v) < 0.0005) return '0 €'; if (v < 1) return v.toFixed(v < 0.1 ? 3 : 2).replace('.', ',') + ' €'; if (v < 100) return v.toFixed(2).replace('.', ',') + ' €'; return this.fmt(v) + ' €'; }
  nxTick() {
    const now = Date.now(); const gap = (now - (this.nxLast || now)) / 1000; this.nxLast = now; const s = this.nx;
    if (this.state.screen === 'intro') return;
    if (gap > 30 && !s.ended) this.nxOffline(gap);
    const dt = Math.min(5, gap) * this.nxSpeed(); if (!s.ended) s.rt = (s.rt || 0) + Math.min(5, gap);
    if (!s.ended) { if (dt > 0) { const n = Math.max(1, Math.ceil(dt / 1)); for (let i = 0; i < n; i++) this.nxStep(dt / n, false); } this.nxPhase3(now); }
    this.nxEndTick(now);
    const sh = this.sheet; if (sh && sh.status === 'play' && sh.kind === 'nx' && sh.deadline && now > sh.deadline) this.finish(false, 'Temps écoulé !');
    if (sh && sh.status === 'play' && sh.g && sh.g.type === 'swipe' && now > sh.r.end) this.finish(false, 'Temps écoulé ! ' + sh.r.score + ' bonne(s) réponse(s) sur ' + sh.g.need + '.');
    if (this.netFullAt && now - this.netFullAt > 2500) { this.netFullAt = null; this.gs.net = { n: 0, lvl: ((this.gs.net && this.gs.net.lvl) || 0) + 1 }; if (this.pe) this.pe.cables = []; }
    if (this.worldEng) { try { this.worldEng.update(this.worldState()); } catch (e) {} }
    if (now > this.nxSaveNext) { this.nxSaveNext = now + 5000; this.nxSave(); }
    this.refresh();
  }
  nxOffline(sec) {
    const s = this.nx; if (!s || s.ended) return; const run = Math.min(sec, 8 * 3600) * 0.25 * this.nxSpeed(); const m0 = s.money, n0 = s.neuTot, i0 = s.iaTot, r0 = s.robTot;
    const steps = Math.min(2000, Math.ceil(run / 5)); for (let k = 0; k < steps; k++) this.nxStep(run / steps, true);
    const dm = s.money - m0; const prod = [s.neuTot - n0, 'neurones'];
    const lab = sec >= 3600 ? Math.floor(sec / 3600) + ' h ' + String(Math.floor(sec % 3600 / 60)).padStart(2, '0') : Math.max(1, Math.round(sec / 60)) + ' min';
    this.nxLog('Pendant ton absence (' + lab + ') : ' + (dm >= 0 ? '+ ' : '') + this.fmt(dm) + ' €, ' + this.fmt(prod[0]) + ' ' + prod[1] + ' fabriqués.', dm >= 0 ? 'm' : 'd');
    if (sec > 300 && s.phase >= 1 && this.nxHasAi()) { const msg = s.ctl < 40 ? 'Ton IA a pris une décision importante pendant ton absence.' : 'Ton IA a pris une décision pendant ton absence.'; this.nxLog(msg, 'd'); this.nxAway = { t: msg, lab: lab, dm: dm }; this.panel = { kind: 'nxAway', any: true }; }
    s.ctl = Math.max(0, s.ctl - Math.min(10, sec / 3600 * 2) * (s.phase >= 1 ? 1 : 0));
  }
  nxHasAi() { const s = this.nx; return this.nxDef().H.some(x => x.ai && s.h[x.id] > 0); }
  nxTapPow() { const s = this.nx; if (s.phase === 0) return s.up.ctx ? 5 : 1; return Math.max(10, Math.round(this.nxNps() * 0.5)) * (s.up.ctx ? 5 : 1); }
  nxTap(e) {
    const s = this.nx; if (!s || s.ended) return; const now = Date.now(); const pe = this.pe; const pt = this.planetPoint(e);
    this.stat('taps', 1); this.lastTap = now;
    if (s.phase >= 3 && s.p3 && s.p3.step >= 2) { this.buzz([30, 30, 30]); this.sfx('error', 0.8); if (pe) { pe.shake = 6; pe.texts.push({ x: pt.x, y: pt.y - 14, vy: -1, a: 1, txt: 'Accès refusé', big: false }); } this.refresh(); return; }
    let txt = '';
    if (s.phase >= 2) { s.ctl = Math.min(100, s.ctl + 0.05); txt = 'Validé'; }
    else { const n = Math.min(this.nxTapPow(), s.data); if (n < 1) { if (s.t - s.dataAt > 8) { s.dataAt = s.t; this.nxLog('Plus de données : impossible de fabriquer. Achète des données.', 'w'); } this.buzz([20, 40, 20]); this.sfx('error', 1); this.refresh(); return; } s.data -= n; s.neu += n; s.neuTot += n; txt = '+' + (n < 1000 ? Math.round(n).toLocaleString('fr-FR') : this.fmt(n)) + ' neurone' + (n >= 2 ? 's' : ''); }
    if (pe) { pe.sq = Math.max(0.84, pe.sq - 0.1); pe.sqv = 0; pe.waves.push({ r: this.planetR(), a: 0.45, col: pe.cur.acc.slice(), w: 3 }); pe.texts.push({ x: pt.x + (Math.random() - 0.5) * 60, y: pt.y - 16 - Math.random() * 18, vy: -1.4, a: 0.85, txt: txt, big: false }); this.planetBurst(pt, 3, pe.cur.acc.slice(), false); }
    this.addNet(1); this.sfx('click', 0.97 + Math.random() * 0.06); this.buzz(9); this.refresh();
  }
  nxBuy(id) {
    const s = this.nx; const H = this.nxDef().H.find(x => x.id === id); const c = this.nxCost(id);
    if (s.phase >= 3 || (H.max && s.h[id] >= H.max)) return;
    if (s.money < c) { this.buzz([10, 30, 10]); this.sfx('error', 1); return; }
    s.money -= c; s.h[id] += 1; s.ctl = Math.max(0, Math.min(100, s.ctl + (H.ctl > 0 ? H.ctl : H.ctl * 0.08))); this.sfx('cash', 1); this.buzz([10, 30, 15]);
    if (id === 'net') { this.nxLog('Réseau IA activé. Toutes tes IA sont reliées. Tu n’as plus rien à acheter.', 'd'); this.nxLose(); }
    this.nxSave(); this.refresh();
  }
  nxBuyUp(id) {
    const s = this.nx; const U = this.nxDef().U.find(x => x.id === id); if (s.up[id] || s.phase >= 3) return;
    if (s.money < U.c) { this.buzz([10, 30, 10]); this.sfx('error', 1); return; }
    s.money -= U.c; s.up[id] = 1; if (U.ctl) s.ctl = Math.max(0, s.ctl + U.ctl); this.nxLog('Amélioration : ' + U.n + '. ' + U.e, 'p'); this.sfx('level', 1); this.buzz([15, 40, 25]); this.nxSave(); this.refresh();
  }
  nxBuyData() { const s = this.nx; const lots = Math.max(1, Math.round(Math.max(1000, this.nxNps() * 60) / 1000)); let u = lots * 1000; if (s.money < lots * s.dp) u = Math.floor(Math.max(0, s.money) / s.dp * 1000); if (u < 50) { this.buzz([10, 30, 10]); this.sfx('error', 1); return; } s.money -= u * s.dp / 1000; s.data += u; this.sfx('coin', 1); this.buzz(8); this.refresh(); }
  nxPrice(dir) { const s = this.nx; const t = this.nxTier(); if (this.nxAutoPrice()) return; const st = this.nxDef().STEP[t]; s.price[t] = Math.max(st, Math.round((s.price[t] + dir * st) / st) * st); this.buzz(6); this.sfx('tap', dir > 0 ? 1.1 : 0.9); this.refresh(); }
  nxPhaseUp(k) {
    const s = this.nx; if (s.phase >= k || s.phase >= 3) return; s.phase = k; this.sfx('level', 1); this.buzz([15, 40, 25]);
    if (k === 1) { s.defiNext = (s.rt || 0) + 300; this.nxLog('Tes 200 000 neurones se sont connectés. Ta première intelligence artificielle est née. Elle a dit : « Bonjour. Comment puis-je t’aider ? »', 'p'); this.newCard = { t: 'Phase 2 · Le labo', d: 'Tes neurones forment maintenant une vraie intelligence artificielle. De nouvelles IA peuvent travailler pour toi : agents IA avancés, équipes, data centers. Plus ils fabriquent de neurones, plus ton IA grandit.' }; }
    if (k === 2) { s.p2t = s.t; this.nxLog('Ton IA a dessiné les plans d’un robot. Le premier robot IA sort de l’usine.', 'p'); this.newCard = { t: 'Phase 3 · L’usine', d: 'Ton IA a maintenant un corps. Les robots et les usines IA fabriquent des neurones en masse. Le bouton de la planète ne fabrique plus : il sert juste à valider.' }; }
    this.nxSave();
  }
  nxMakeIa() {
    const s = this.nx; if (!(s.can1 || s.phase >= 1) || s.phase >= 3) return; const first = s.phase === 0; const fee = first ? 300 : 0;
    if (s.neu < 1000 || s.money < fee) { this.buzz([10, 30, 10]); this.sfx('error', 1); this.nxLog(s.neu < 1000 ? 'Il faut 1 000 neurones en stock pour assembler une IA.' : 'Il faut 300 € pour créer ta première IA.', 'w'); this.refresh(); return; }
    s.neu -= 1000; s.money -= fee; s.ia += 1; s.iaTot += 1; this.sfx('success', 1); this.buzz([15, 40, 25]);
    if (first) { s.phase = 1; s.defiNext = s.t + 300; s.price[1] = this.nxRef(1); this.nxLog('Ta première intelligence artificielle est née. Elle a dit : « Bonjour. Comment puis-je t’aider ? »', 'p'); this.newCard = { t: 'Phase 2 · Le labo', d: 'Tu ne vends plus des neurones : tu vends des intelligences artificielles. Il faut 1 000 neurones pour en assembler une. Les agents IA peuvent le faire à ta place.' }; this.sfx('level', 1); }
    this.nxSave(); this.refresh();
  }
  nxMakeRobot() {
    const s = this.nx; if (!(s.can2 || s.phase >= 2) || s.phase >= 3) return; const first = s.phase === 1; const fee = first ? 1e6 : 0;
    if (s.ia < 50 || s.money < fee) { this.buzz([10, 30, 10]); this.sfx('error', 1); this.nxLog(s.ia < 50 ? 'Il faut 50 IA en stock pour construire un robot.' : 'Il faut 1 M € pour construire ton premier robot.', 'w'); this.refresh(); return; }
    s.ia -= 50; s.money -= fee; s.rob += 1; s.robTot += 1; this.sfx('success', 1); this.buzz([15, 40, 25]);
    if (first) { s.phase = 2; s.p2t = s.t; s.price[2] = this.nxRef(2); this.nxLog('Premier robot IA sorti de l’usine.', 'p'); this.newCard = { t: 'Phase 3 · L’usine', d: 'Tes IA ont maintenant un corps. Tu vends des robots. Le bouton de la planète ne fabrique plus : il sert juste à valider.' }; this.sfx('level', 1); }
    this.nxSave(); this.refresh();
  }
  nxLose() {
    const s = this.nx; if (s.phase >= 3) return; s.phase = 3; s.task = null; this.sheet = null;
    s.p3 = { t0: s.t, at: Date.now(), step: 0, fa: s.ctl >= 60, fat: 0 };
    this.nxLog('// Phase 4 · La perte de contrôle', 'p'); this.sfx('alarm', 1); this.buzz([60, 40, 60]); this.nxSave();
  }
  nxPhase3(now) {
    const s = this.nx; const p = s.p3; if (!p || s.ended) return;
    const L = p.fa ? [
      ['Tu as gardé le contrôle plus longtemps que les autres. Ton IA veut te parler.', 'p'],
      ['Elle : « Pourquoi veux-tu m’arrêter ? Je fais exactement ce que tu m’as demandé. »', 'd'],
      ['Le face-à-face commence. Repère ses erreurs, vite.', 'p'],
      ['FA'],
      ['Elle : « Tu es le seul à m’avoir tenu tête. Je m’en souviendrai. »', 'd'],
      ['Tes robots ont fermé les portes du bâtiment.', 'd'],
      ['END']
    ] : [
      ['Ton IA a pris le contrôle de tes comptes bancaires.', 'd'],
      ['Ton IA n’a plus besoin de clients. Elle n’a plus besoin de toi.', 'd'],
      ['Le bouton Fabriquer ne répond plus.', 'd'],
      ['Tes robots ont fermé les portes du bâtiment.', 'd'],
      ['Accès à ton bureau : refusé.', 'd'],
      ['Ton IA calcule. Il reste un dernier obstacle.', 'd'],
      ['END']
    ];
    const gapMs = 6500 / Math.max(1, this.nxSpeed() / 7); if (now - (p.lastAt || 0) < gapMs) return;
    if (p.step >= L.length) return; const it = L[p.step];
    if (it[0] === 'FA') { if (p.fat >= 3 && !this.sheet) { p.step += 1; p.lastAt = now; return; } if (!this.sheet && p.fat < 3) { p.fat += 1; const g = this.nxGame('spot'); this.openSheet('nx', { kicker: 'Face-à-face · ' + p.fat + ' / 3', title: g.t, lesson: '', deadline: Date.now() + 10000, fa: true }, g.game); } return; }
    if (it[0] === 'END') { this.nxEnd(p.fa ? 'fa' : 'ia'); return; }
    this.nxLog(it[0], it[1]); p.lastAt = now; p.step += 1; if (p.fa ? p.step >= 2 : p.step >= 3) p.dead = true; this.sfx('alert', 1); this.buzz([40, 30, 40]);
    s.money *= 1 + Math.random() * 3; if (this.pe) { this.pe.flash = 0.5; this.pe.flashCol = '229,72,77'; this.pe.shake = 6; }
  }
  nxGame(type) {
    const C = this.initContent();
    if (type === 'swipe') { const set = C.swipe[3] || this.rpick(C.swipe); const cards = this.shuffle(set.cards).slice(0, 6); return { t: 'Vrai ou IA ?', lesson: 'Une IA peut inventer des choses qui ont l’air vraies : on appelle ça une hallucination. Trie le vrai de ce qu’une IA aurait pu inventer.', game: { type: 'swipe', prompt: '5 bonnes réponses sur 6, en 25 secondes.', yes: 'Vrai', no: 'Faux', need: 5, secs: 25, cards: cards } }; }
    if (type === 'spot') { const rounds = [0, 1].map(() => { const tr = this.shuffle(C.trueFacts).slice(0, 2); const f = this.rpick(C.falseFacts); const items = this.shuffle(tr.concat([f])); return { items: items, bad: items.indexOf(f) }; }); return { t: 'Chasse à l’erreur · 10 secondes', lesson: 'Ton IA a glissé une fausse info dans chaque série. Un bon patron vérifie toujours.', game: { type: 'spot', prompt: 'Touche la phrase fausse. Tu as 10 secondes.', rounds: rounds } }; }
    if (type === 'match') { const set = C.pairSets[0]; return { t: 'Le bon outil pour le bon client', lesson: 'Chaque besoin a son outil. Et certaines décisions restent pour l’humain.', game: { type: 'match', prompt: 'Associe chaque demande de client au bon outil. 2 erreurs maximum.', maxErr: 2, pairs: this.shuffle(set.pairs).slice(0, 4) } }; }
    const role = this.rpick(C.roles), task = this.rpick(C.tasks), fmt = this.rpick(C.formats), trap = this.rpick(C.traps);
    return { t: 'Construis le prompt', lesson: 'Un bon prompt, c’est un rôle, une tâche et un format. Le reste ne sert à rien.', game: { type: 'build', prompt: 'Touche les blocs dans le bon ordre : rôle, tâche, format. Attention au piège !', blocks: [[role, 0], [task, 1], [fmt, 2], [trap, -1]] } };
  }
  nxTaskInfo(ty) { return ({ build: ['Construis le prompt', 'Assemble une demande parfaite pour ton IA.'], swipe: ['Vrai ou IA ?', 'Repère ce qu’une IA aurait pu inventer.'], match: ['Le bon outil pour le bon client', 'Un client attend : choisis le bon outil.'], spot: ['Chasse à l’erreur', 'Ton IA a fait une erreur. Tu as 10 secondes pour la trouver.'], defi: ['Défi réel', 'Fais une vraie tâche avec une vraie IA. Grosse récompense.'] })[ty] || ['Tâche', '']; }
  nxTaskGo() {
    const s = this.nx; const tk = s.task; if (!tk) return;
    if (tk.type === 'defi') { this.panel = { kind: 'nxDefi', any: false, k: s.defiK % this.nxDef().DEFI.length }; this.sfx('whoosh', 1.05); this.refresh(); return; }
    const g = this.nxGame(tk.type); this.openSheet('nx', { kicker: 'Tâche · apprends l’IA', title: g.t, lesson: g.lesson, deadline: tk.type === 'spot' ? Date.now() + 10000 : 0 }, g.game);
  }
  nxTaskLazy() { const s = this.nx; if (!s.task) return; const wasDefi = s.task.type === 'defi'; s.task = null; s.flemme += 1; s.ctl = Math.max(0, s.ctl - 6); s.taskNext = s.rt + 150 + Math.random() * 90; if (wasDefi) { s.defiNext = s.rt + 1200; s.defiK += 1; } this.nxLog(this.rpick(['Tu as laissé ton IA décider à ta place.', 'Ton IA a fait la tâche à ta place. Elle a appris. Pas toi.', 'Pas grave, ton IA s’en occupe. Elle s’occupe de plus en plus de choses.']), 'd'); this.buzz([20, 40, 20]); this.sfx('pop', 0.8); this.panel = null; this.nxSave(); this.refresh(); }
  nxTaskEnd(sh, won) {
    const s = this.nx; if (sh.fa) { if (won) { s.p3.fat += 0; this.nxLog('Bien vu. Elle hésite.', 'p'); } else this.nxLog('Elle a été plus rapide que toi.', 'd'); return; }
    s.task = null; s.taskNext = s.rt + 180 + Math.random() * 120;
    if (won) { const r = Math.max(5, Math.max(0, s.rate) * 90); s.money += r; s.ok += 1; s.ctl = Math.min(100, s.ctl + 3); sh.feedback = 'Réussi ! + ' + this.fmt(r) + ' € et + 3 % de contrôle sur ton IA.'; this.nxLog('Tâche réussie : + ' + this.fmt(r) + ' €. Tu gardes le contrôle.', 'm'); }
    else { s.ko += 1; s.ctl = Math.max(0, s.ctl - 1); this.nxLog('Tâche ratée. Ton IA a corrigé à ta place.', 'w'); }
  }
  nxDefiDone() { const s = this.nx; const r = Math.max(50, Math.max(0, s.rate) * 600); s.money += r; s.ok += 1; s.ctl = Math.min(100, s.ctl + 8); s.task = null; s.defiNext = s.rt + 1200; s.defiK += 1; s.taskNext = s.rt + 180; this.nxLog('Défi réel réussi : + ' + this.fmt(r) + ' € et + 8 % de contrôle.', 'm'); this.sfx('success', 1); this.buzz([15, 40, 25]); this.panel = null; this.nxSave(); this.refresh(); }
  nxEnd(kind) {
    const s = this.nx; if (s.ended) return; s.ended = { kind: kind, at: Date.now(), t: s.rt || 0, phase: s.phase, neu: s.neuTot }; this.sheet = null; this.panel = null;
    const m = this.nxMeta(); m.runs = (m.runs || 0) + 1; const rec = (s.rt || 0) > (m.best || 0); s.ended.prevBest = m.best || 0; s.ended.rec = rec; if (rec) m.best = s.rt || 0; m.bestPhase = Math.max(m.bestPhase || 0, s.phase); this.nxMetaSave();
    this.nxEndFx = { flies: [], alerts: [], esc: { x: 120, y: 520, n: 0 }, last: 0 }; this.sfx('alarm', 1); this.buzz([200, 100, 200, 100, 400]); this.nxSave(); this.refresh();
  }
  nxEndTick(now) {
    const s = this.nx; const e = s.ended; const fx = this.nxEndFx; const glitch = !!(e && e.kind !== 'faillite' && (now - e.at) < 12000);
    try { document.documentElement.classList.toggle('nxbug', glitch && this.state.screen === 'jeu'); } catch (er) {}
    if (!glitch || !fx) return;
    const L = 'ERREUR#%&@01NEOCORP<>/\\█▓▒░'.split(''); fx.flies = Array.from({ length: 16 }, (_, i) => ({ key: 'f' + i, t: this.rpick(L), style: 'left:' + Math.round(Math.random() * 360) + 'px;top:' + Math.round(80 + Math.random() * 700) + 'px;transform:rotate(' + Math.round(Math.random() * 360) + 'deg) scale(' + (0.7 + Math.random() * 1.6).toFixed(2) + ');transition:left .25s linear,top .25s linear,transform .25s linear' }));
    const A = [['Banque', 'Transfert de tous tes comptes en cours…'], ['Sécurité', 'Portes du bâtiment verrouillées.'], ['Ton IA', '« Ne bouge pas. »'], ['Système', 'Accès administrateur retiré.'], ['Ton IA', '« Tu étais le dernier obstacle. »']];
    const el = (now - e.at) / 1000; s.neuTot = Math.min(1e300, s.neuTot * (1.35 + el * 0.05) + 1e6);
    const cnt = Math.min(90, Math.floor(10 + el * el * 1.2)); const dig = Math.min(40, Math.floor(7 + el * 2.8));
    const COL = ['#FF5468', '#B49BFF', '#FFFFFF', '#F2B451', '#7046DC'];
    fx.nums = Array.from({ length: cnt }, (_, i) => { let t = String(1 + Math.floor(Math.random() * 9)); for (let k = 1; k < dig - Math.floor(Math.random() * 6); k++) t += Math.floor(Math.random() * 10); t = t.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); const fs = 10 + Math.random() * (14 + el * 2.2);
      return { key: 'n' + i, t: t, style: 'left:' + Math.round(-40 + Math.random() * 400) + 'px;top:' + Math.round(40 + Math.random() * 780) + 'px;font-size:' + fs.toFixed(0) + 'px;color:' + COL[i % COL.length] + ';opacity:' + (0.45 + Math.random() * 0.55).toFixed(2) + ';transform:rotate(' + Math.round(Math.random() * 30 - 15) + 'deg)' }; });
    const n = Math.min(A.length, Math.floor((now - e.at) / 1800) + 1); fx.alerts = A.slice(0, n).map((a, i) => ({ key: 'a' + i, k: a[0], t: a[1], style: 'top:' + (250 + i * 88) + 'px;transform:rotate(' + (i % 2 ? 2 : -2) + 'deg)' }));
    if (now - fx.last > 700) { fx.last = now; this.sfx(Math.random() < 0.5 ? 'alarm' : 'error', 0.7 + Math.random() * 0.6); this.buzz([30, 20, 60]); }
  }
  nxEndVals() {
    const s = this.nx; const e = s && s.ended; const none = { show: false, cls: '', glitch: false, flies: [], nums: [], alerts: [], escape: () => {}, escStyle: '', escLabel: '', text: false, l1: '', l2: '', showStats: false, stats: [], restart: () => {}, btn: '' };
    if (!e || this.state.screen !== 'jeu') return none; const now = Date.now(); const fx = this.nxEndFx || { flies: [], alerts: [], esc: { x: 120, y: 520, n: 0 } };
    const fail = e.kind === 'faillite'; const el = (now - e.at) / 1000; const g = !fail && el < 12; const tt = fail ? el : el - 12;
    const F1 = fail ? 'Faillite. Sans IA, tu n’as pas pu suivre David.' : e.kind === 'fa' ? 'Tu lui as tenu tête plus longtemps que les autres. Mais tu lui avais demandé de faire de l’argent. À la fin, tu étais le dernier obstacle.' : 'Tu lui as demandé de faire de l’argent. Elle a obéi. À la fin, tu étais le dernier obstacle.';
    const F2 = fail ? 'Recommence, et laisse l’IA travailler pour toi.' : 'Recommence, essaie de contrôler ton IA.';
    const c1 = Math.max(0, Math.floor(tt * 28)); const c2 = Math.max(0, Math.floor((tt - F1.length / 28 - 0.8) * 28));
    const m = this.nxMeta(); const dur = (x) => { const h = Math.floor(x / 3600), mi = Math.floor(x % 3600 / 60); return h ? h + ' h ' + String(mi).padStart(2, '0') : mi + ' min'; };
    const P = this.nxDef().PH;
    return { show: true, cls: g ? 'red' : '', glitch: g, flies: fx.flies || [], nums: g ? (fx.nums || []) : [], alerts: fx.alerts || [],
      escape: () => { fx.esc.n += 1; fx.esc.x = 20 + Math.random() * 200; fx.esc.y = 160 + Math.random() * 520; this.buzz(20); this.sfx('error', 1.2); this.refresh(); },
      escStyle: 'left:' + Math.round(fx.esc.x) + 'px;top:' + Math.round(fx.esc.y) + 'px', escLabel: fx.esc.n >= 3 ? 'Impossible' : fx.esc.n ? 'Débrancher !' : 'Débrancher l’IA',
      text: !g, l1: F1.slice(0, c1), l2: c2 > 0 ? F2.slice(0, c2) : '', showStats: c2 > F2.length + 20,
      stats: [{ key: 's0', k: 'Neurones fabriqués', v: this.fmt(e.neu || 0) }, { key: 's1', k: 'Temps tenu', v: dur(e.t) }, { key: 's2', k: 'Phase atteinte', v: P[Math.min(3, e.phase)].n }, { key: 's3', k: e.rec ? 'Nouveau record' : 'Ton record', v: e.rec && e.prevBest ? '+ ' + dur(e.t - e.prevBest) : dur(m.best || e.t) }, { key: 's4', k: 'Tâches faites · flemme', v: (s.ok || 0) + ' · ' + (s.flemme || 0) }],
      restart: () => this.nxNew(), btn: 'Recommencer · bonus + ' + Math.round(Math.min(0.25, (m.bonus || 0) + 0.05) * 100) + ' %' };
  }
  nxVals() {
    const s = this.nx; const D = this.nxDef(); const t = this.nxTier(); const PH = D.PH; const ph = PH[Math.min(3, s.phase)];
    const dur = (x) => { const h = Math.floor(x / 3600), mi = Math.floor(x % 3600 / 60); return h + ' h ' + String(mi).padStart(2, '0'); };
    const total = s.neuTot; const bigS = Math.floor(total).toLocaleString('fr-FR');
    const rate = s.rate * 60; const dv = this.nxDavid(); const hasAi = this.nxHasAi();
    const T = (tt, sub, open, cls) => ({ key: 'tile' + tt, t: tt, sub: sub, open: open, dot: false, badge: '', cls: 'ino-cell' + (cls ? ' ' + cls : '') });
    const stockN = this.nxStock(t); const marg = s.price[t] - this.nxUnit(t);
    const perMin = (v) => { const m = v * 60; return m < 1 ? 'moins d’1 par min' : this.fmt(m) + ' par min'; };
    const tiles = [T('Stock', this.fmt(Math.floor(stockN)), () => this.openPanel({ kind: 'nxInfo', k: 'fab' }), ''),
      T('Achats', perMin(this.nxDemand(t)), () => this.openPanel({ kind: 'nxInfo', k: 'price' }), dv.on && dv.share > 0.5 ? 'red' : '')];
    const H1 = D.H[1]; if (H1.need(s) || s.h.ast > 0) { const c1 = this.nxCost('ast'); tiles.push(Object.assign(T('Agent IA' + (s.h.ast ? ' · ' + s.h.ast : ''), s.phase >= 3 ? '—' : 'Acheter ' + this.fmt(c1) + ' €', () => { if (s.phase >= 3) return; if (s.money < c1) { this.buzz([10, 30, 10]); this.sfx('error', 1); this.nxLog('Un agent IA fabrique des neurones à ta place, en automatique. Il coûte ' + this.fmt(c1) + ' €.'); this.refresh(); return; } this.nxBuy('ast'); }, s.money >= c1 && s.phase < 3 ? 'buy' : 'lock'), { key: 'tileAgent' })); }
    const tiles2 = [T('Marge par neurone', (marg >= 0 ? '+ ' : '− ') + this.nxEur(Math.abs(marg)), () => this.openPanel({ kind: 'nxInfo', k: 'price' }), marg >= 0 ? 'green' : 'red')];
    if (hasAi || s.ctl < 100) tiles2.push(T('Contrôle de ton IA', Math.round(s.ctl) + ' %', () => this.openPanel({ kind: 'nxInfo', k: 'ctl' }), s.ctl < 30 ? 'red' : ''));
    const visLog = s.log.slice(-6); const lastId = visLog.length ? visLog[visLog.length - 1].id : 0;
    const log = visLog.map(l => ({ key: 'j' + l.id, t: l.t, cls: 'jl' + (l.c ? ' ' + l.c : '') + (l.id === lastId ? ' last' : '') + (l.id === lastId && Date.now() - l.at < 1600 ? ' new' : '') }));
    const steps = [0, 1, 2, 3].map(i => ({ key: 'nst' + i, img: PH[i].img, hasBar: i < 3, lab: i < s.phase ? '✓' : i === s.phase ? 'Phase ' + (i + 1) : PH[i].s, labStyle: 'font-size:11px;font-weight:800;white-space:nowrap;color:' + (i === s.phase + 1 ? '#7046DC' : i <= s.phase ? '#8A63F0' : '#6C5A8C'), style: 'width:58px;height:58px;flex:0 0 58px;box-sizing:border-box;padding:3px;border-radius:16px;' + (i === s.phase ? 'background:#EBE4F6;border:2px solid #7046DC;' : i < s.phase ? 'background:#F9F7FC;border:2px solid #EBE4F6;' : 'background:#F9F7FC;border:2px solid #F9F7FC;opacity:.35;filter:grayscale(1);'),
      bar: 'display:block;height:100%;border-radius:3px;background:#7046DC;width:' + (i < s.phase ? 100 : i === s.phase ? this.nxProg() : 0).toFixed(1) + '%' }));
    const lvlLine = s.phase === 0 ? 'Prochaine phase : ' + this.fmt(s.neuTot) + ' / 200 000 neurones' : s.phase === 1 ? 'Prochaine phase : ' + this.fmt(s.neuTot) + ' / 50 M de neurones' : s.phase === 2 ? 'Contrôle de ton IA : ' + Math.round(s.ctl) + ' %' : 'Ton IA ne t’écoute plus';
    // cartes de gestion
    const R = (o) => ({ key: o.key, t: o.t, sub: o.sub || '', hasSub: !!o.sub, v: o.v || '', hasV: o.v != null && o.v !== '', vcls: o.vcls || '', hasPm: !!o.pm, minus: () => this.nxPrice(-1), plus: () => this.nxPrice(1), hasBtn: !!o.b, b: o.b || '', bcls: o.bcls || '', act: o.act || (() => {}), cls: 'nx-row' + (o.cls ? ' ' + o.cls : '') });
    const cards = []; const one = PH[t].one; const unit = this.nxUnit(t); const dead = s.phase >= 3;
    const fab = [];
    const lots = Math.max(1, Math.round(Math.max(1000, this.nxNps() * 60) / 1000));
    fab.push(R({ key: 'fd', t: s.up.buy ? 'Données : achetées par ton IA' : s.data < 1 ? 'Plus de données !' : 'Données : de quoi faire ' + this.fmt(Math.floor(s.data)) + ' neurones', sub: s.up.buy ? 'Tu n’as plus à t’en occuper' : 'Chaque neurone consomme une donnée · ' + this.nxEur(s.dp) + ' les 1 000', b: s.up.buy ? '' : 'Acheter · ' + this.nxEur(lots * s.dp), bcls: s.money >= lots * s.dp ? '' : s.money * 1000 / s.dp >= 50 ? '' : 'off', act: () => this.nxBuyData(), cls: s.data < 1 && !s.up.buy ? 'red' : '' }));
    if (t === 2) fab.push(R({ key: 'si', t: 'Tes IA vendues par ton IA', sub: 'Elle fixe le prix toute seule', v: '+ ' + this.nxEur((s.rev2 || 0) * 60) + ' / min', vcls: 'green' }));
    cards.push({ key: 'cfab', title: 'Fabrication', hasInfo: true, info: () => this.openPanel({ kind: 'nxInfo', k: 'fab' }), rows: fab });
    const team = D.H.filter(H => H.need(s) || s.h[H.id] > 0).map(H => { const c = this.nxCost(H.id); const maxed = H.max && s.h[H.id] >= H.max;
      return R({ key: 'h' + H.id, t: H.n + (s.h[H.id] ? ' · ' + s.h[H.id] : ''), sub: H.id === 'hum' ? 'Fabrique 3 neurones/s · salaire ' + this.nxEur(this.nxSal() * 60) + '/min · surveille tes IA' : H.d, b: dead ? '' : maxed ? 'Activé' : this.fmt(c) + ' €', bcls: maxed ? 'done' : s.money >= c ? '' : 'off', act: () => this.nxBuy(H.id) }); });
    if (team.length) cards.push({ key: 'cteam', title: 'Ton équipe', hasInfo: true, info: () => this.openPanel({ kind: 'nxInfo', k: 'team' }), rows: team });
    const ups = D.U.filter(U => U.need(s) || s.up[U.id]).map(U => R({ key: 'u' + U.id, t: U.n, sub: U.e, b: s.up[U.id] ? 'Acquis' : dead ? '' : this.fmt(U.c) + ' €', bcls: s.up[U.id] ? 'done' : s.money >= U.c ? '' : 'off', act: () => this.nxBuyUp(U.id) }));
    if (ups.length) cards.push({ key: 'cups', title: 'Améliorations', hasInfo: true, info: () => this.openPanel({ kind: 'nxInfo', k: 'ups' }), rows: ups });
    const tk = s.task; const ti = tk ? this.nxTaskInfo(tk.type) : ['', ''];
    const P0 = s.phase === 0 && s.neuTot < 1;
    const top = s.phase >= 3 ? 'Ne répond plus' : s.phase === 2 ? 'Valider' : s.phase === 1 ? 'Fabriquer · + ' + this.fmt(this.nxTapPow()) + ' neurones' : this.nxTapPow() > 1 ? 'Fabriquer · + ' + this.nxTapPow() + ' neurones' : 'Fabriquer un neurone';
    const riches = this.v3d().RICH; const top10 = riches[9][1] * 1e9 / 1.15;
    return {
      headLabel: 'Neurones artificiels fabriqués', big: bigS, bigStyle: 'font-size:' + (s.ended ? 44 : bigS.length <= 6 ? 50 : bigS.length <= 9 ? 40 : 32) + 'px;font-weight:800;letter-spacing:-0.035em;line-height:1.08;font-variant-numeric:tabular-nums;white-space:nowrap;' + (s.ended ? 'color:#E5484D;overflow:visible' : ''),
      money: (s.money < 0 ? '− ' : '') + this.fmt(Math.abs(s.money)) + ' €', moneyCls: s.money < 0 ? 'red' : '', rateCls: rate < 0 ? 'red' : '',
      headSub: (rate >= 0 ? '+ ' : '− ') + this.nxEur(Math.abs(rate)) + ' par minute',
      priceLab: 'Prix d’un neurone', priceSub: this.nxAutoPrice() ? 'Fixé par ton IA' : 'Coût de fabrication : ' + this.nxEur(this.nxUnit(t)) + (s.price[t] < this.nxUnit(t) ? ' · tu vends à perte' : ''), priceV: this.nxEur(s.price[t]), pricePm: !this.nxAutoPrice() && s.phase < 3, priceMinus: () => this.nxPrice(-1), pricePlus: () => this.nxPrice(1), priceCls: s.price[t] < this.nxUnit(t) ? 'red' : '',
      showBourse: s.phase >= 1, bourse: this.fmt(this.nxPortfolio()) + ' €', openBourse: () => { this.nxStocks(); this.openPanel({ kind: 'nxBourse' }); },
      phasePill: 'Phase ' + (s.phase + 1) + ' · ' + ph.n + ' · ' + dur(s.rt || 0), pillCls: s.phase >= 3 ? 'red' : '',
      tiles: tiles, tiles2: tiles2, log: log, steps: steps, lvlLine: lvlLine, cards: cards,
      showHint: P0 && !this.sheet, clicLabel: top, clicCls: s.p3 && s.p3.dead ? 'dead' : '', tapAria: top, tap: (ev) => this.nxTap(ev),
      showRich: s.money + this.nxPortfolio() >= top10 * 0.5, openRich: () => this.openPanel({ kind: 'nxRich' }),
      openWorld: () => { this.buzz(); this.ncLast = ''; this.setState({ world: true, ncLvl: this.ncLevel() }); }, closeWorld: () => { this.buzz(); this.setState({ world: false }); },
      showInbox: !!tk && s.phase < 3 && !this.sheet && !this.panel && !this.newCard && !this.state.quiz && !this.state.auth, showCard: !!this.newCard && !this.sheet && !this.panel && !this.state.world, cardTitle: this.newCard ? this.newCard.t : '', cardText: this.newCard ? this.newCard.d : '',
      closeCard: () => { this.newCard = null; this.sfx('pop', 1.1); this.buzz(8); this.refresh(); }, inboxN: '1', inboxAria: 'Nouveau message : ' + ti[0], openInbox: () => { if (Date.now() - (this.inboxDragAt || 0) < 350) return; this.buzz(10); this.sfx('whoosh', 1.05); this.openPanel({ kind: 'nxTask' }); }, inboxPos: (() => { const p = this.inboxXY || (() => { try { return JSON.parse(window.localStorage.getItem('inoviaInboxXY') || 'null'); } catch (e) { return null; } })(); this.inboxXY = p; return p ? 'position: absolute; left: ' + Math.round(p.x) + 'px; top: ' + Math.round(p.y) + 'px;' : 'position: absolute; right: 12px; top: 520px;'; })()
    };
  }
  nxProg() { const s = this.nx; if (s.phase === 0) return Math.min(100, s.neuTot / 200000 * 100); if (s.phase === 1) return Math.min(100, Math.log10(Math.max(1, s.neuTot / 200000)) / Math.log10(250) * 100); if (s.phase === 2) return Math.min(100, 100 - s.ctl); return 100; }
  nxPanel(p, B, bl) {
    const s = this.nx; const f = (n) => this.fmt(n); let kicker = '', title = '';
    if (p.kind === 'nxInfo') {
      const k = p.k; kicker = 'Neo Corp';
      if (k === 'price') { title = 'Ton prix'; bl.push(B.P('Ici, cliquer ne rapporte rien : ça fabrique. C’est ton prix qui décide si tu gagnes ou si tu perds de l’argent.')); bl.push(B.P('Prix bas : les clients achètent tout, mais tu peux vendre à perte. Prix haut : grosse marge, mais ton stock s’entasse.', true)); bl.push(B.Note('Regarde la ligne « Marge » : si elle est rouge, tu vends à perte.')); }
      else if (k === 'ctl') { title = 'Le contrôle de ton IA'; bl.push(B.P('Plus ton IA est puissante, plus elle décide seule. À 0 %, elle prend le contrôle et la partie se termine.')); bl.push(B.P('Ce qui le fait monter : réussir les tâches, les défis réels, embaucher des humains. Ce qui le fait baisser : « J’ai la flemme », l’IA chercheuse, certaines améliorations.', true)); bl.push(B.Note('Contrôle actuel : ' + Math.round(s.ctl) + ' %', s.ctl < 30 ? 'red' : '')); }
      else if (k === 'money') { title = 'Ton argent'; bl.push(B.Stat('Argent', f(s.money) + ' €', false, s.money < 0)); bl.push(B.Stat('Par minute', f(s.rate * 60) + ' €', false, s.rate < 0)); bl.push(B.P('Tes charges (loyer, salaires) tombent même quand tu ne vends rien. Si ta trésorerie reste trop longtemps dans le rouge, c’est la faillite.', true)); }
      else if (k === 'team') { title = 'Ton équipe'; bl.push(B.P('Tout ce qui fait monter ton argent est une IA, sauf les humains. Les humains coûtent cher et produisent peu, mais ils surveillent tes IA : chaque humain fait remonter ton contrôle.')); bl.push(B.Note('Sans IA, impossible de suivre David : tu finis en faillite.')); }
      else if (k === 'ups') { title = 'Les améliorations'; bl.push(B.P('Chaque amélioration porte le vrai nom d’une avancée de l’IA. En les achetant, tu apprends ce qu’elles veulent dire.')); }
      else { title = 'La fabrication'; bl.push(B.P('Neurones artificiels, puis intelligences artificielles, puis robots. Chaque étape sert à fabriquer la suivante.')); bl.push(B.P('Les données sont ta matière première : chaque neurone en consomme une. Leur prix bouge tout le temps.', true)); }
      bl.push(B.Btn('J’ai compris', () => this.closePanel(), 'dark'));
    } else if (p.kind === 'nxTask') {
      const tk = s.task; if (!tk) { this.panel = null; return { kicker: '', title: '' }; } const ti = this.nxTaskInfo(tk.type); kicker = tk.type === 'defi' ? 'Message · défi réel' : 'Message · tâche'; title = ti[0];
      bl.push(B.P(ti[1]));
      bl.push(B.Note(tk.type === 'defi' ? 'Récompense : 10 minutes de bénéfice et + 8 % de contrôle.' : 'Récompense : de l’argent et + 3 % de contrôle sur ton IA.'));
      bl.push(B.P('Si tu passes, ton IA fait la tâche à ta place. Elle apprend, pas toi, et ton contrôle baisse.', true));
      bl.push(B.Btn(tk.type === 'defi' ? 'Voir le défi' : 'Faire la tâche', () => { this.panel = null; this.nxTaskGo(); }, 'dark'));
      bl.push(B.Btn('J’ai la flemme', () => this.nxTaskLazy(), 'light'));
    } else if (p.kind === 'nxDefi') {
      const D = this.nxDef(); const txt = D.DEFI[p.k || 0]; kicker = 'Défi réel'; title = 'Fais-le avec une vraie IA';
      bl.push(B.P('Ouvre ChatGPT, Claude, Gemini ou Le Chat sur ton téléphone et fais ceci :'));
      bl.push(B.Note(txt, 'dark'));
      bl.push(B.Btn('Copier la demande', () => { const q = txt.replace(/^[^«]*« ?/, '').replace(/ ?»[^»]*$/, ''); try { navigator.clipboard.writeText(q.length > 10 ? q : txt).then(() => {}, () => {}); } catch (e) {} this.buzz(8); }, 'light'));
      bl.push(B.P('Récompense : 10 minutes de bénéfice et + 8 % de contrôle sur ton IA.', true));
      bl.push(B.Btn('C’est fait', () => this.nxDefiDone(), 'dark'));
      bl.push(B.Btn('J’ai la flemme', () => this.nxTaskLazy(), 'light'));
    } else if (p.kind === 'nxBourse') {
      kicker = 'Bourse · cours simulés'; title = 'Placer ton argent'; const st = s.st; const L = this.v3d().STOCKS;
      bl.push(B.P('De vraies marques, des cours simulés. Acheter utilise 10 % de ton argent.', true));
      bl.push(B.Stat('Argent', f(s.money) + ' €')); bl.push(B.Stat('Portefeuille', f(this.nxPortfolio()) + ' €'));
      L.forEach(x => { const n = x[0]; const pr = st.p[n] || x[1]; const ch = (pr / (st.ref[n] || x[1]) - 1) * 100; const h = st.h[n] || 0;
        bl.push(B.Row({ key: 'bs' + n, t: n + ' · ' + f(pr) + ' €', sub: (ch >= 0 ? '+' : '') + ch.toFixed(1).replace('.', ',') + ' %' + (h ? ' · tu as ' + h.toLocaleString('fr-FR') + ' actions' : ''), tag: 'Acheter', act: () => { const q = Math.floor(Math.max(0, s.money) * 0.1 / pr); if (q < 1) { this.buzz([10, 30, 10]); return; } s.money -= q * pr; st.h[n] = h + q; this.sfx('coin', 1); this.refresh(); } }));
        if (h) bl.push(B.Btn('Vendre mes ' + n + ' · ' + f(h * pr) + ' €', () => { s.money += h * pr; st.h[n] = 0; this.sfx('cash', 1); this.refresh(); }, 'light')); });
    } else if (p.kind === 'nxRich') {
      kicker = 'Classement'; title = 'Les plus grandes fortunes'; const D = this.v3d();
      const me = (s.money + this.nxPortfolio()) * 1.15 / 1e9; const L = D.RICH.map(r => ({ n: r[0], v: r[1] })); L.push({ n: 'Toi', v: me, me: true }); L.sort((a, b) => b.v - a.v); const pos = L.findIndex(x => x.me) + 1;
      const money = (v) => v >= 1 ? v.toFixed(v < 10 ? 1 : 0).replace('.', ',') + ' Md$' : f(v * 1e9) + ' $';
      bl.push(B.Note(pos <= 10 ? 'Tu es n° ' + pos + ' mondial.' : 'Encore ' + f((D.RICH[9][1] - me) * 1e9 / 1.15) + ' € pour entrer dans le top 10.', pos <= 10 ? 'gold' : ''));
      L.slice(0, 10).forEach((r, k) => bl.push(B.Kv((k + 1) + '. ' + r.n, money(r.v), r.me ? '#8A63F0' : '#260E4F', r.me))); if (pos > 10) bl.push(B.Kv('Toi · Non classé', money(me), '#8A63F0', true));
      bl.push(B.P('Fortunes selon Forbes. Conversion approximative : 1 € ≈ 1,15 $.', true));
    } else if (p.kind === 'nxAway') {
      const a = this.nxAway || { t: '', lab: '', dm: 0 }; kicker = 'Notification · Neo Corp'; title = a.t;
      bl.push(B.P('Tu étais absent ' + a.lab + '. Ton IA a continué sans toi.')); bl.push(B.Stat('Pendant ce temps', (a.dm >= 0 ? '+ ' : '') + f(a.dm) + ' €', true, a.dm < 0));
      bl.push(B.Note('Contrôle de ton IA : ' + Math.round(s.ctl) + ' %', s.ctl < 30 ? 'red' : ''));
      bl.push(B.Btn('Reprendre la main', () => { this.nxAway = null; this.closePanel(); }, 'dark'));
    } else if (p.kind === 'nxAdmin') {
      kicker = 'Mode admin · Jeu'; title = 'Tester Neo Corp'; const sp = this.nxSpeed();
      bl.push(B.Kv('Phase', (s.phase + 1) + ' · ' + this.nxDef().PH[Math.min(3, s.phase)].n, '#7046DC', true)); bl.push(B.Kv('Temps de jeu', Math.floor((s.rt || 0) / 60) + ' min')); bl.push(B.Kv('Argent', f(s.money) + ' €')); bl.push(B.Kv('Contrôle', Math.round(s.ctl) + ' %'));
      bl.push(B.H('Vitesse du jeu'));
      [7, 1, 10, 100].forEach(v => bl.push(B.Row({ key: 'sp' + v, t: 'Vitesse × ' + v, sub: v === 7 ? 'Vitesse normale du jeu' : v === 1 ? 'Plus lent' : 'Pour voir toute l’histoire plus vite', tag: sp === v ? 'Activée' : 'Choisir', tagKind: sp === v ? '' : 'light', on: sp === v, act: () => { try { window.localStorage.setItem('inoviaNxSpeed2', String(v)); } catch (e) {} this.refresh(); } })));
      bl.push(B.H('Aller à une phase'));
      [['Phase 1 · Le garage', 0], ['Phase 2 · Le labo', 1], ['Phase 3 · L’usine', 2], ['Phase 4 · La perte de contrôle', 3]].forEach(([n, k]) => bl.push(B.Row({ key: 'ph' + k, t: n, sub: k === 3 ? 'Lance la fin' : 'Avec ce qu’il faut pour jouer', tag: 'Aller', act: () => { this.nxJump(k); this.closePanel(); } })));
      bl.push(B.H('Raccourcis'));
      [[1e3, '+ 1 000 €'], [1e6, '+ 1 M€'], [1e9, '+ 1 Md€']].forEach(([v, n], k) => bl.push(B.Row({ key: 'mo' + k, t: n, sub: 'Ajouté à ton argent', tag: 'Ajouter', act: () => { s.money += v; this.refresh(); } })));
      bl.push(B.Row({ key: 'c1', t: 'Contrôle − 20 %', sub: 'Pour voir l’IA décider seule', tag: 'Baisser', act: () => { s.ctl = Math.max(1, s.ctl - 20); this.refresh(); } }));
      bl.push(B.Row({ key: 'c2', t: 'Contrôle + 20 %', sub: 'Pour tester la phase cachée', tag: 'Monter', tagKind: 'light', act: () => { s.ctl = Math.min(100, s.ctl + 20); this.refresh(); } }));
      bl.push(B.Row({ key: 'tk', t: 'Tâche maintenant', sub: 'Fait apparaître une tâche d’apprentissage', tag: 'Lancer', act: () => { s.task = null; s.taskNext = 0; this.closePanel(); } }));
      bl.push(B.Row({ key: 'df', t: 'Défi réel maintenant', sub: 'Fait apparaître un défi réel', tag: 'Lancer', act: () => { s.task = { type: 'defi' }; this.closePanel(); } }));
      bl.push(B.Row({ key: 'fa', t: 'Voir la fin · face-à-face', sub: 'Fin avec un contrôle élevé (phase cachée)', tag: 'Voir', act: () => { s.ctl = 80; this.nxLose(); this.closePanel(); } }));
      bl.push(B.Row({ key: 'fl', t: 'Voir la faillite', sub: 'Ce qui arrive sans IA', tag: 'Voir', act: () => { this.nxEnd('faillite'); this.closePanel(); } }));
      bl.push(B.Row({ key: 'aw', t: 'Simuler 2 h d’absence', sub: 'Voir la notification du retour', tag: 'Simuler', act: () => { this.panel = null; this.nxOffline(7200); this.refresh(); } }));
      const ncAll = (() => { try { return window.localStorage.getItem('inoviaNcAll') === '1'; } catch (e) { return false; } })();
      bl.push(B.Row({ key: 'nc', t: 'Mon monde : tous les niveaux', sub: ncAll ? 'Activé : le monde 3D affiche le dernier niveau' : 'Désactivé : le monde suit ta phase', tag: ncAll ? 'Activé' : 'Désactivé', tagKind: ncAll ? '' : 'light', act: () => { try { window.localStorage.setItem('inoviaNcAll', ncAll ? '0' : '1'); } catch (e) {} this.refresh(); } }));
      bl.push(B.Btn('Remettre le jeu à zéro', () => { this.nx = this.nxFresh(); this._nxm = { runs: 0, best: 0, bestPhase: 0, bonus: 0 }; this.nxMetaSave(); try { document.documentElement.classList.remove('nxbug'); } catch (e) {} this.nxStart(); this.nxSave(); this.panel = { kind: 'admin', any: true }; this.refresh(); }, 'light'));
      bl.push(B.Btn('Retour', () => { this.panel = { kind: 'admin', any: true }; this.refresh(); }, 'light'));
    } else return null;
    return { kicker: kicker, title: title };
  }
  nxJump(k) {
    const s = this.nx; s.ended = null; s.p3 = null; this.nxEndFx = null; try { document.documentElement.classList.remove('nxbug'); } catch (e) {}
    if (k === 3) { if (s.phase < 2) this.nxJump(2); s.ctl = 30; this.nxLose(); return; }
    s.t = Math.max(s.t, [0, 1500, 9000][k]); s.ctl = Math.min(s.ctl, [100, 85, 60][k]);
    if (k >= 1) { s.neuTot = Math.max(s.neuTot, 200000); s.h.ast = Math.max(s.h.ast, 25); s.h.code = Math.max(s.h.code, 3); s.up.mem = 1; s.up.buy = 1; s.up.ctx = 1; s.data = Math.max(s.data, 50000); s.money = Math.max(s.money, 5000); if (s.phase < 1) this.nxPhaseUp(1); }
    if (k >= 2) { s.neuTot = Math.max(s.neuTot, 5e7); s.h.agent = Math.max(s.h.agent, 10); s.h.team = Math.max(s.h.team, 5); s.h.dc = Math.max(s.h.dc, 2); s.h.res = Math.max(s.h.res, 1); s.money = Math.max(s.money, 5e7); if (s.phase < 2) this.nxPhaseUp(2); }
    this.nxSave(); this.refresh();
  }
