import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { productListReducer, productDetailsReducers, productCreateReducer, productUpdateReducers, productDeleteReducers } from './reducers/productReducers';
import { userSignupReducers, userLoginReducers, userListReducers, userDeleteReducer, userUpdateReducer, userDetailsReducer, userUpdateProfileReducer } from './reducers/userReducers';
import { cartReducers } from './reducers/cartReducers';
// import { saveShippingAddress } from './actions/cartActions';
import { orderCreateReducers, orderDeliverReducer, orderDetailsReducer, orderListMyReducer,  orderListReducers } from './reducers/orderReducers';



const reducer = combineReducers({
  productsList: productListReducer,
  productDetails: productDetailsReducers,
  userSignup: userSignupReducers,
  userLogin: userLoginReducers,
  cart:cartReducers,
  orderCreate:orderCreateReducers,
  orderDetails:orderDetailsReducer,
  orderDeliver:orderDeliverReducer,

  // admin
  productCreate:productCreateReducer,
  productUpdate:productUpdateReducers,
  productDelete:productDeleteReducers,
  orderList:orderListReducers,
  userList:userListReducers,
  userDelete:userDeleteReducer,
  userUpdate:userUpdateReducer,
  userDetails:userDetailsReducer,
  userUpdateProfile:userUpdateProfileReducer,
  orderMyList:orderListMyReducer,
});


const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

  console.log("USER INFO FROM STORAGE:", userInfoFromStorage);

  const cartItemsFromStorage = localStorage.getItem('cartItems')?
  JSON.parse(localStorage.getItem('cartItems')):[]

  const shippingAddressFromStorage=localStorage.getItem('shippingAddress')?
  JSON.parse(localStorage.getItem('shippingAddress')):{}

  const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? localStorage.getItem('paymentMethod')
  : '';


const initialState = {
  cart:{cartItems:cartItemsFromStorage || [],shippingAddress:shippingAddressFromStorage || {}, paymentMethod: paymentMethodFromStorage,
  },
  userLogin: {userInfo: userInfoFromStorage || null,
  },
};


const middleware = [thunk];


const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;