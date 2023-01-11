import fetchProduct from "./fetchProduct";


async function fetchProductsByHandle(handles) {
    const products = await Promise.all(handles.map(handle => fetchProduct(handle, false)));

    return products.filter(p => !!p);
}


export default fetchProductsByHandle
