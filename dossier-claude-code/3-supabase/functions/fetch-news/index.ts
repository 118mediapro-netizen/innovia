// Inovia — robot de l'Actu : lit les flux des médias, garde les actus IA, récupère la photo, enregistre les nouvelles.
// Lancé toutes les minutes par pg_cron.
import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", ecirc: "ê", ocirc: "ô", icirc: "î", ucirc: "û", laquo: "«", raquo: "»", ndash: "–", mdash: "—" };
const decode = (s: string) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] === "#") { const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return isFinite(n) ? String.fromCodePoint(n) : m; }
  return ENT[e.toLowerCase()] ?? m;
});
const cdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
const strip = (s: string) => decode(cdata(s).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const tag = (block: string, name: string) => { const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };
const attr = (block: string, name: string, a: string) => { const m = block.match(new RegExp(`<${name}\\b[^>]*\\b${a}=["']([^"']+)["']`, "i")); return m ? decode(m[1]) : ""; };

function parse(xml: string) {
  const items: { title: string; url: string; date: Date; excerpt: string; image: string }[] = [];
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = strip(tag(b, "title"));
    let url = strip(tag(b, "link")); if (!url) url = attr(b, "link", "href");
    const d = strip(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
    const raw = cdata(tag(b, "description") || tag(b, "summary") || tag(b, "content:encoded") || tag(b, "content"));
    let image = attr(b, "media:content", "url") || attr(b, "media:thumbnail", "url") || "";
    if (!image) { const enc = b.match(/<enclosure\b[^>]*>/i); if (enc && /image/i.test(enc[0])) { const m = enc[0].match(/url=["']([^"']+)["']/i); if (m) image = decode(m[1]); } }
    if (!image) { const m = decode(raw).match(/<img[^>]+src=["']([^"']+)["']/i); if (m) image = m[1]; }
    const date = d ? new Date(d) : new Date();
    if (title && url) items.push({ title, url: url.trim(), date: isNaN(+date) ? new Date() : date, excerpt: strip(raw).slice(0, 400), image });
  }
  return items;
}

const AI_CS = /\bIA\b|\bI\.A\.|\bAI\b|\bGPT|\bLLM/;
const AI_CI = /intelligence artificielle|chatgpt|openai|gemini|\bclaude\b|anthropic|mistral|deepfake|copilot|\bgrok\b|\bllama\b|midjourney|\bsora\b|perplexity|machine learning|apprentissage automatique|agents? ia|nvidia|deepmind|ia générative|robot humanoïde|robotique/i;
// on écarte les bons plans, promos et contenus sponsorisés
const JUNK = /promo|bons? plans?|soldes|ventes? flash|black friday|french days|prime day|\[sponso|sponsoris|\d+ ?€|€ ?\d|-\d+ ?%|à moins de|pas cher|meilleure? offre|réduction|remise|code promo|test du|quel pc .* choisir/i;
const isAI = (t: string) => AI_CS.test(t) || AI_CI.test(t);
const isJunk = (t: string) => JUNK.test(t);
const TAGS: [string, RegExp][] = [
  ["Emploi", /emploi|travail|métier|recrut|salari|chômage|licenci|embauche|junior|carrière/i],
  ["Image et vidéo", /vidéo|video|image|photo|deepfake|\bsora\b|\bveo\b|midjourney|caméra/i],
  ["Code", /\bcode\b|codage|développeu|programm|github|logiciel|\bAPI\b|open source|agent de code/i],
  ["Création", /musique|chanson|artiste|\bart\b|créat|cinéma|film|design|écrivain|livre/i],
  ["Business", /entreprise|start-?up|levée|bourse|milliard|million|investi|marché|chiffre d.affaires|rachat|valorisation|nvidia/i],
];
const pickTag = (t: string) => { for (const [k, r] of TAGS) if (r.test(t)) return k; return "Société"; };

async function get(url: string, ms: number) {
  const c = new AbortController(); const id = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "*/*", "Accept-Language": "fr-FR,fr;q=0.9" }, signal: c.signal, redirect: "follow" }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.text(); }
  finally { clearTimeout(id); }
}
async function ogImage(url: string) {
  try { const h = (await get(url, 6000)).slice(0, 300000);
    const m = h.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::src)?["'][^>]*content=["']([^"']+)["']/i) || h.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    return m ? decode(m[1]) : ""; } catch { return ""; }
}

Deno.serve(async () => {
  const t0 = Date.now();
  const { data: sources } = await sb.from("news_sources").select("*").eq("enabled", true);
  const since = Date.now() - 3 * 864e5;
  const found: any[] = [];
  await Promise.all((sources || []).map(async (s: any) => {
    try {
      const items = parse(await get(s.feed_url, 8000)).filter((i) => +i.date > since && (s.ai_only || isAI(i.title + " " + i.excerpt)) && !isJunk(i.title));
      items.forEach((i) => found.push({ ...i, source: s.name }));
      await sb.from("news_sources").update({ last_ok: new Date().toISOString(), last_error: null, last_count: items.length }).eq("id", s.id);
    } catch (e) {
      await sb.from("news_sources").update({ last_error: String(e).slice(0, 200) }).eq("id", s.id);
    }
  }));
  // ne garder que les nouvelles
  const urls = [...new Set(found.map((f) => f.url))];
  const known = new Set<string>();
  for (let i = 0; i < urls.length; i += 100) { const { data } = await sb.from("news").select("url").in("url", urls.slice(i, i + 100)); (data || []).forEach((r: any) => known.add(r.url)); }
  const seen = new Set<string>(); const fresh = found.filter((f) => !known.has(f.url) && !seen.has(f.url) && seen.add(f.url)).sort((a, b) => +b.date - +a.date).slice(0, 40);
  // photo de l'article quand le flux n'en donne pas
  await Promise.all(fresh.filter((f) => !f.image).slice(0, 12).map(async (f) => { f.image = await ogImage(f.url); }));
  if (fresh.length) {
    await sb.from("news").upsert(fresh.map((f) => ({ url: f.url, source: f.source, title: f.title, excerpt: f.excerpt, image: f.image || null, tag: pickTag(f.title + " " + f.excerpt), published_at: (+f.date > Date.now() ? new Date() : f.date).toISOString() })), { onConflict: "url", ignoreDuplicates: true });
  }
  await sb.from("news").delete().lt("published_at", new Date(Date.now() - 30 * 864e5).toISOString());
  return new Response(JSON.stringify({ sources: (sources || []).length, trouvees: found.length, nouvelles: fresh.length, ms: Date.now() - t0 }), { headers: { "Content-Type": "application/json" } });
});
