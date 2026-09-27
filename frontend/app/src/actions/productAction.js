import axios from 'axios';
import {
    PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_REQUEST,
    PRODUCT_CREATE_FAIL, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_RESET, PRODUCT_CREATE_SUCCESS,
    PRODUCT_DELETE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS,
    PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_RESET, PRODUCT_UPDATE_SUCCESS
} from '../constants/productConstants';


export const listProducts = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        // const {
        //     userLogin: { userInfo },
        // } = getState();

        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${userInfo?.access}`,
        //     },
        // };

        const { data } = await axios.get(
            `http://127.0.0.1:8000/api/products/`
        );


        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
        console.log("API DATA:", data)
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        })
    }
}

export const productListReducer = (
    state = { products: [] },
    action
) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };

        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };

        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const listProductDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState();

        console.log("USERINFO:", userInfo)


        // const token = userInfo?.access;

        // console.log("TOKEN:", token);


        // if (!token) {
        //     throw new Error("User not logged in");
        // }

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.access}`,
            },
        }

        const { data } = await axios.get(
            `http://127.0.0.1:8000/api/products/${id}/`
        )

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        console.log(error.response)
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response?.data?.detail || error.message,
        })
    }
}

export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`,
            },
        };

        const { data } = await axios.post(
            `/api/products/create/`, {}, config
        )
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`,
            },
        };

        const { data } = await axios.put(
            `/api/products/update/${product._id}/`, product, config
        )
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};


export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`,
            },
        };

        const { data } = await axios.delete(
            `/api/products/delete/${id}/`, config
        )
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};


