import { useEffect, useMemo, useRef, useState } from "react";

export default function ProductBar({ title = "Products", category, limit = 8 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const url = useMemo(() => {
    let fakeStoreData = "https://fakestoreapi.com/products";
    if (category) fakeStoreData += `/category/${encodeURIComponent(category)}`;
    const hasQuery = fakeStoreData.includes("?");
    const params = new URLSearchParams();
    if (limit && Number(limit) > 0) params.set("limit", String(limit));
    return params.toString() ? `${fakeStoreData}${hasQuery ? "&" : "?"}${params}` : fakeStoreData;
  }, [category, limit]);

  useEffect(() => {
    setLoading(true);
    setError("");
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        setItems(arr);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Failed to load products");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return (
    <section className="productsRowWrap">
      <div className="rowHeader">
        <h2 className="rowTitle">{title}</h2>
      </div>

      {error && (
        <div className="rowError">
          <span>Error 404 item not found {error}</span>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )}
      <div className="productRow" role="list">
        {(loading ? Array.from({ length: limit }) : items).map((p, i) => (
          <article key={loading ? i : p.id} className={`card ${loading ? "skeleton" : ""}`} role="listitem">
            {/* mantener Skeleton, para que no se desarme al cargar */}
            <div className="media">
              {!loading && (
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={160}
                  height={160}
                />
              )}
            </div>
            <div className="content">
              <h3 className="title" title={!loading ? p.title : undefined}>
                {loading ? "\u00A0" : truncate(p.title, 60)}
              </h3>
              <div className="meta">
                <span className="price">{loading ? "\u00A0" : formatPrice(p.price)}</span>
                {!loading && p.rating && (
                  <Stars value={p.rating.rate} count={p.rating.count} />
                )}
              </div>
              {!loading && (
                <button className="btn">Add to cart</button>
              )}
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .productsRowWrap { width: 100%; margin-bottom: 2rem; }
        .rowHeader { display:flex; align-items:fakeStoreDataline; justify-content:space-between; padding: 1% }
        .rowTitle { font-size: 1.5 rem; }
        .rowLink { font-size: 1.5 rem; opacity:.9; text-decoration:none; }
        
        .rowError { 
        display:flex; 
        gap:.75rem; 
        align-items:center; 
        padding:.75rem; 
        background: #ff0000; 
        color: #6c4a00; 
        border:1px 
        solid #ffe69c; 
        border-radius: 10px; 
        margin:.5rem 0; }

        .productRow { 
          display: flex; 
          gap: 12px; 
          overflow-x: auto; 
          overscroll-behavior-x: contain; 
          padding: 1%; 
          scroll-snap-type: x proximity; 
          -webkit-overflow-scrolling: touch; 
          scrollbar-width: thin;
        }
        .card { 
          flex: 0 0 220px; 
          display: grid; 
          grid-template-rows: 160px auto; 
          background: #111111; 
          color: #00ff00; 
          border: 1px solid #2a2a2a; 
          border-radius: 16px; 
          scroll-snap-align: start; 
          box-shadow: 0 2px 10px rgba(0,0,0,.25);
        }
        .card .media { display:grid; place-items:center; padding: 10px; }
        .card .media img { width: 100%; height: 200px; object-fit: contain; }
        .card .content { display:flex; flex-direction:column; gap: 5px; padding: 20px; }
        .card .title { font-size: 15px; line-height: 1.2; min-height: 2.4em; margin: auto; }
        .card .meta { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; }
        .card .btn { 
          margin-top: auto; 
          background: #000000;
          color: #00ff00;  
          border: none; 
          border-radius: 12px; 
          padding: 0.55rem 0.8rem; 
          cursor: pointer; 
        }
        .card .btn:active { transform: translateY(1px); }

        .skeleton { position: relative; overflow: hidden; }
        .skeleton .media { background: #1a1a1a; border-bottom: 1px solid #222; }
        .skeleton .title, .skeleton .price { background: #1a1a1a; color: transparent; border-radius: 6px; }
        .skeleton::after { 
          content: ""; position: absolute; inset: 0; 
          background: linear-gradient(90deg, #ffffff, #ffffff0f, #ffffff); 
        }

        }
      `}</style>
    </section>
  );
}

function Stars({ value = 0, count = 0 }) {
  const full = Math.round(value);
  return (
    <div className="stars" title={`${value} / 5 (${count})`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>{i < full ? "★" : "☆"}</span>
      ))}
      <style>{`
        .stars { font-size: .9rem; letter-spacing: 1px; }
      `}</style>
    </div>
  );
}

function formatPrice(n) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

function truncate(str, max) {
  return str?.length > max ? str.slice(0, max - 1) + "…" : str;
}
