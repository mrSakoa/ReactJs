import CartWidget from './CartWidget';
import ItemListContainer from './ItemListContainer';

function Body() {
    return (
        <div style={{
            textAlign: "center",
            background: "#f5f5f5",
        }}>
            <CartWidget/>
            <h1>Body is running</h1>
            <ItemListContainer/>

        </div>
    )
}

export default Body