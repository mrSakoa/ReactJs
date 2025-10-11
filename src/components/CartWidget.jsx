import { useEffect, useState } from "react";
import { getItems, getCount, getTotal, removeItem } from "./cartStore";

export default function CartWidget() {

    const [items, setItems] = useState(getItems());

    const [total, setTotal] = useState(getTotal());

    const count = items.length;

    useEffect(() => {

        const onUpdate = () => setItems(getItems(), setTotal(getTotal()));

        window.addEventListener("cart:update", onUpdate);

        return () => window.removeEventListener("cart:update", onUpdate);

    }, []);

    if (!items.length) {
        return (
            <div className="cartWidget">
                <span className="badge">0</span>
                <span className="label">Cart</span>
                <style>{styles}</style>
            </div>
        );
    }

    return (
        <div className="cartWidget">
            <span className="badge">{count}</span>
            <span className="label">Cart</span>

            <div className="panel">
                {items.map((it, idx) => (
                    <div className="row" key={`${it.id}-${idx}`}>

                        <img src={it.image} alt={it.title} />
                        <div className="info">
                            <div className="t">{it.title}</div>
                            <div className="p">{formatPrice(it.price)}</div>
                        </div>
                        <button className="remove" onClick={() => removeItem(idx)}>Remove</button>
                    </div>
                ))}
                {items.length > 0 && (
                    <div className="totalRow">
                        <strong>Total:</strong> {formatPrice(total)}
                    </div>
                )}
            </div>
            <style>{styles}</style>
        </div>
    );
}

function formatPrice(n) {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n); }
    catch { return `$${Number(n).toFixed(2)}`; }
}

const styles = `
.cartWidget{
  position: fixed; right: 16px; top: 16px; z-index: 50;
  display:inline-flex; align-items:center; gap:.5rem;
  background:#0b0b0b; border:1px solid #2a2a2a; color:#9cff9c; border-radius:12px;
  padding:.5rem .75rem; box-shadow:0 2px 10px rgba(0,0,0,.35);
}
.cartWidget .badge{
  min-width:1.5rem; height:1.5rem; display:grid; place-items:center;
  background:#000; color:#00ff00; border-radius:999px; font-weight:700;
  border:1px solid #2a2a2a;
}
.cartWidget .panel{
  position:absolute; right:0; top: calc(100% + 8px);
  background:#111; border:1px solid #2a2a2a; border-radius:12px; padding:.5rem;
  width: 320px; max-height: 50vh; overflow:auto;
}
.cartWidget .row{
  display:grid; grid-template-columns: 48px 1fr auto; gap:.5rem; align-items:center;
  padding:.35rem; border-radius:8px;
}
.cartWidget .row:hover{ background:#0f0f0f; }
.cartWidget img{ width:48px; height:48px; object-fit:contain; background:#000; border-radius:8px; }
.cartWidget .info .t{ font-size:.92rem; line-height:1.2; }
.cartWidget .info .p{ opacity:.85; font-size:.85rem; }
.cartWidget .remove{ background:#000; color:#ff6b6b; border:1px solid #2a2a2a; border-radius:8px; padding:.3rem .5rem; cursor:pointer;
}
`;
