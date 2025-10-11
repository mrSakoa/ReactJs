// src/components/ProductBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit as limitFn } from "firebase/firestore";
import { addItem } from "./cartStore";

export default function ProductBar({ title = "Products", category, limit = 8 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef({ aborted: false });

  // for private folder
  // const LOCAL_IMAGE_BASE = "/src/images/";
  // SETS THE FOLDER WHERE THE IMAGES ARE LOCATED IN THE PUBLIC FOLDER
  const PUBLIC_IMAGE_BASE = "/images/";

  const qRef = useMemo(() => {
    const base = collection(db, "productos");
    const parts = [];
    if (category) parts.push(where("categoryId", "==", String(category)));
    if (limit && Number(limit) > 0) parts.push(limitFn(Number(limit)));
    return parts.length ? query(base, ...parts) : query(base, limitFn(Number(limit) || 8));
  }, [category, limit]);

  useEffect(() => {
    setLoading(true);
    setError("");
    abortRef.current.aborted = false;

    (async () => {
      try {
        const snap = await getDocs(qRef);
        if (abortRef.current.aborted) return;

        const docs = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            title: data.name ?? "",
            price: Number(data.price ?? 0),
            image: `${PUBLIC_IMAGE_BASE}${data.imgId}`,
            raw: data
          };
        });

        if (!abortRef.current.aborted) setItems(docs);
      } catch (err) {
        if (!abortRef.current.aborted) setError(err?.message || "Failed to load products");
      } finally {
        if (!abortRef.current.aborted) setLoading(false);
      }
    })();

    return () => {
      abortRef.current.aborted = true;
    };
  }, [qRef]);

  return (
    <section className="productsRowWrap">
      <div className="rowHeader">
        <h2 className="rowTitle">{title}</h2>
      </div>

      {error && (
        <div className="rowError">
          <span>Error loading products: {error}</span>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )}

      <div className="productRow" role="list">
        {/* skeleton mantains the format of the page when its not loaded */}
        {(loading ? Array.from({ length: limit }) : items).map((p, i) => (
          <article key={loading ? i : p.id} className={`card ${loading ? "skeleton" : ""}`} role="listitem">
            <div className="media">
              {!loading && (
                <img
                  src={p.image}
                  alt={p.title || "Product image"}
                  loading="lazy"
                  width={160}
                  height={160}
                  onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                />
              )}
            </div>
            <div className="content">
              <h3 className="title" title={!loading ? p.title : undefined}>
                {loading ? "\u00A0" : truncate(p.title, 60)}
              </h3>
              <div className="meta">
                <span className="price">{loading ? "\u00A0" : formatPrice(p.price)}</span>
              </div>
              {!loading && (
                <Link to={`/product/${p.id}`} className="btn">Inspect</Link>
              )}
              {!loading && (
                <div className="btnRow">
                  <Link to={`/product/${p.id}`} className="btn">Inspect</Link>
                  <button
                    className="btn outline"
                    onClick={() => addItem({ id: p.id, title: p.title, price: p.price, image: p.image })}
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .productsRowWrap { width: 100%; margin-bottom: 2rem; }
        .rowHeader { display:flex; align-items:center; justify-content:space-between; padding: 1% }
        .rowTitle { font-size: 1.5rem; }
        .rowLink { font-size: 1.5rem; opacity:.9; text-decoration:none; }

        .rowError { 
          display:flex; gap:.75rem; align-items:center; padding:.75rem;
          background: #ffefef; color: #6c0000; border:1px solid #ffb3b3; border-radius: 10px; margin:.5rem 0;
        }

        .productRow { 
          display: flex; gap: 12px; overflow-x: auto; overscroll-behavior-x: contain;
          padding: 1%; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; scrollbar-width: thin;
        }
        .card { 
          flex: 0 0 220px; display: grid; grid-template-rows: 160px auto;
          background: #111111; color: #00ff00; border: 1px solid #2a2a2a; border-radius: 16px;
          scroll-snap-align: start; box-shadow: 0 2px 10px rgba(0,0,0,.25);
        }
        .card .media { display:grid; place-items:center; padding: 10px; }
        .card .media img { width: 100%; height: 200px; object-fit: contain; }
        .card .content { display:flex; flex-direction:column; gap: 5px; padding: 20px; }
        .card .title { font-size: 15px; line-height: 1.2; min-height: 2.4em; margin: auto; }
        .card .meta { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; }
        .card .btn { 
          margin-top: auto; background: #000000; color: #00ff00; border: none; border-radius: 12px;
          padding: 1rem 0.8rem; cursor: pointer;
        }
        .card .btn:active { transform: translateY(1px); }
        .btnRow { display:flex;  gap:.5rem; }
       .btn.outline { background: #000000; border:1px solid #2a2a2a; font-family: consolas;font-size:.85rem; }
      `}</style>
    </section>
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
