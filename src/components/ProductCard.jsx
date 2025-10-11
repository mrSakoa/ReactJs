// src/components/InspectCard.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { addItem } from "./cartStore";

export default function InspectCard() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const PUBLIC_IMAGE_BASE = "/images/";

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const ref = doc(db, "productos", id);
        const snap = await getDoc(ref);
        if (!alive) return;

        if (!snap.exists()) throw new Error("Product not found");

        const data = snap.data();
        setProduct({
          id: snap.id,
          name: data.name ?? "Unnamed Product",
          price: Number(data.price ?? 0),
          description: data.description ?? "No description available.",
          image: data.imgId ? `${PUBLIC_IMAGE_BASE}${data.imgId}` : "",
          categoryId: data.categoryId ?? "",
        });
      } catch (err) {
        if (alive) setError(err?.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="inspectWrap">
        <div className="inspectCard skeleton">
          <div className="media" />
          <div className="body">
            <h1 className="title">&nbsp;</h1>
            <div className="price">&nbsp;</div>
            <p className="desc">&nbsp;</p>
            <div className="actions">
              <span className="btn ghost">&nbsp;</span>
              <span className="btn ghost">&nbsp;</span>
            </div>
          </div>
        </div>
        <Style />
      </section>
    );
  }

  if (error) {
    return (
      <section className="inspectWrap">
        <div className="rowError">
          <span>Error loading product: {error}</span>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
        <Style />
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="inspectWrap">
      <div className="inspectCard">
        <div className="media">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={400}
              height={400}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          )}
        </div>

        <div className="body">
          <h1 className="title" title={product.name}>{product.name}</h1>

          <div className="meta">
            {product.categoryId && <span className="chip">{product.categoryId}</span>}
            <span className="price">{formatPrice(product.price)}</span>
          </div>

          <p className="desc">{product.description}</p>
          <div className="actions">
            {/* unable to use < , &lt; forces it to render to < */}
            <Link to="/" className="btn">&lt;--- Back</Link>
            <button
              className="btn outline"
              onClick={() => addItem({
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.image
              })}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <Style />
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

/* test of style in function/method form */

function Style() {
  return (
    <style>{`
      .inspectWrap { width: 100%; padding: 1rem; }
      .rowError { 
        display:flex; gap:.75rem; align-items:center; padding:.75rem;
        background: #ffefef; color: #6c0000; border:1px solid #ffb3b3; border-radius: 10px; margin:.5rem 0;
      }

      .inspectCard {
        display: grid;
        grid-template-columns: minmax(240px, 420px) 1fr;
        gap: 20px;
        background: #111111;
        color: #00ff00;
        border: 1px solid #2a2a2a;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(0,0,0,.25);
        padding: 20px;
        max-width: 1000px;
        margin: 1rem auto;
      }

      .inspectCard .media {
        display:grid; place-items:center; background:#000; border-radius:12px; padding: 10px;
      }
      .inspectCard .media img { width: 100%; height: 420px; object-fit: contain; }

      .inspectCard .body { display:flex; flex-direction:column; gap: 12px; }

      .inspectCard .title { font-size: 1.8rem; line-height: 1.2; margin: 0; color:#9cff9c; }
      .inspectCard .meta { display:flex; align-items:center; justify-content:space-between; gap: .5rem; }
      .inspectCard .chip { background:#0b0b0b; border:1px solid #2a2a2a; border-radius:999px; padding:.25rem .6rem; font-size:.85rem; color:#9cff9c; }
      .inspectCard .price { font-size: 1.3rem; font-weight: 600; }

      .inspectCard .desc { color:#cfd8cf; line-height:1.5; }

      .inspectCard .actions { display:flex; gap:.75rem; margin-top: auto; }

      .btn { 
        display:inline-flex; align-items:center; justify-content:center;
        background: #000000; color: #00ff00; border: none; border-radius: 12px;
        padding: 0.65rem 1rem; cursor: pointer; text-decoration:none;
      }
      .btn:active { transform: translateY(1px); }
      .btn.outline { background: transparent; border:1px solid #2a2a2a; }

      /* simple skeleton state */
      .skeleton { 
        color: transparent !important; 
        background: linear-gradient(90deg, #161616 25%, #1e1e1e 37%, #161616 63%); 
        background-size: 400% 100%; 
        animation: shimmer 1.4s ease infinite; 
        border-radius: 16px;
        min-height: 240px;
      }
      .skeleton .media, .skeleton .title, .skeleton .price, .skeleton .desc, .skeleton .btn { 
        background: transparent; 
      }
      @keyframes shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: 0 0; }
      }
       .btn.outline { background: #000000; border:1px solid #2a2a2a; font-family: consolas;font-size:1rem; }
    `}</style>
  );
}
