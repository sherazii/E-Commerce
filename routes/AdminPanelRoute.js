export const ADMIN_DASHBOARD = "/admin/dashboard";
export const ADMIN_TRASH = "/admin/trash";
//Admin media routes

export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit/${id}` : "");


//Category routes

export const ADMIN_CATEGORY_ADD = "/admin/category/add";
export const ADMIN_CATEGORY_SHOW = "/admin/category";
export const ADMIN_CATEGORY_EDIT = (id) => (id ? `/admin/category/edit/${id}` : "");

//Products routes

export const ADMIN_PRODUCT_ADD = "/admin/product/add";
export const ADMIN_PRODUCT_SHOW = "/admin/product";
export const ADMIN_PRODUCT_EDIT = (id) => (id ? `/admin/product/edit/${id}` : "");


//Products variant routes

export const ADMIN_PRODUCT_VARIANT_ADD = "/admin/product-variant/add";
export const ADMIN_PRODUCT_VARIANT_SHOW = "/admin/product-variant";
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => (id ? `/admin/product-variant/edit/${id}` : "");

//Products variant routes

export const ADMIN_COUPON_ADD = "/admin/coupon/add";
export const ADMIN_COUPON_SHOW = "/admin/coupon";
export const ADMIN_COUPON_EDIT = (id) => (id ? `/admin/coupon/edit/${id}` : "");

