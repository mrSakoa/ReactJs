import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit as limitFn } from "firebase/firestore";
import { addItem } from "./cartStore";
import "../style/app.css";

export default function ProductBar({ title = "Products", category, limit = 8 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef({ aborted: false });

  // for private folder
  // const LOCAL_IMAGE_BASE = "/src/images/";
  
  // SETS THE FOLDER WHERE THE IMAGES ARE LOCATED IN THE PUBLIC FOLDER 
  const PUBLIC_IMAGE_BASE = (import.meta.env.BASE_URL || "/") + "images/";

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

        const docs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.name ?? "",
            price: Number(data.price ?? 0),
            image: `${PUBLIC_IMAGE_BASE}${data.imgId}`,
            raw: data,
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
        {(loading ? Array.from({ length: limit }) : items).map((p, i) => (
          <article
            key={loading ? i : p.id}
            className={`card ${loading ? "skeleton" : ""}`}
            role="listitem"
          >
            <div className="media">
              {!loading && (
                <img
                  src={p.image}
                  alt={p.title || "Product image"}
                  loading="lazy"
                  width={160}
                  height={160}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
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
                <div className="btnRow">
                  <Link to={`/product/${p.id}`} className="btn">
                    Inspect
                  </Link>
                  <button
                    className="btn outline"
                    onClick={() =>
                      addItem({ id: p.id, title: p.title, price: p.price, image: p.image })
                    }
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatPrice(n) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

function truncate(str, max) {
  return str?.length > max ? str.slice(0, max - 1) + "…" : str;
}
