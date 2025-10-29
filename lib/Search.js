// Importing route constants for different admin panel sections
// These constants likely contain URL paths used for navigation or linking
import { 
    ADMIN_CATEGORY_ADD, 
    ADMIN_CATEGORY_SHOW, 
    ADMIN_COUPON_ADD, 
    ADMIN_COUPON_SHOW, 
    ADMIN_CUSTOMERS_SHOW, 
    ADMIN_DASHBOARD, 
    ADMIN_MEDIA_SHOW, 
    ADMIN_PRODUCT_ADD, 
    ADMIN_PRODUCT_SHOW, 
    ADMIN_PRODUCT_VARIANT_SHOW, 
    ADMIN_REVIEWS_SHOW 
} from "@/routes/AdminPanelRoute";

// ====================================================================
// searchData: A list of searchable items for the admin panel.
// Each object represents a page or module with metadata used
// for quick search, navigation, or command palette functionality.
// ====================================================================
const searchData = [
   {
       label: "Dashboard",                    // Display name in search results
       description: "View website analytics and reports", // Short summary of functionality
       url: ADMIN_DASHBOARD,                 // Route link to the dashboard page
       keywords: ["dashboard", "overview", "analytics", "insights"] // Search terms for filtering
   },
   {
       label: "Category",
       description: "Manage product categories",
       url: ADMIN_CATEGORY_SHOW,
       keywords: ["category", "product category"]
   },
   {
       label: "Add Category",
       description: "Add new product categories",
       url: ADMIN_CATEGORY_ADD,
       keywords: ["add category", "new category"]
   },
   {
       label: "Product",
       description: "Manage all product listings",
       url: ADMIN_PRODUCT_SHOW,
       keywords: ["products", "product list"]
   },
   {
       label: "Add Product",
       description: "Add a new product to the catalog",
       url: ADMIN_PRODUCT_ADD,
       keywords: ["new product", "add product"]
   },
   {
       label: "Product Variant",
       description: "Manage all product variants",
       url: ADMIN_PRODUCT_VARIANT_SHOW,
       keywords: ["products variants", "variants"]
   },
   {
       label: "Coupon",
       description: "Manage active discount coupons",
       url: ADMIN_COUPON_SHOW,
       keywords: ["discount", "promo", "coupon"]
   },
   {
       label: "Add Coupon",
       description: "Create a new discount coupon",
       url: ADMIN_COUPON_ADD,
       keywords: ["add coupon", "new coupon", "promotion", "offers"]
   },
   // The "Orders" section is commented out, possibly reserved for future use.
   // {
   //     label: "Orders",
   //     description: "Manage customer orders",
   //     url: ADMIN_ORDER_SHOW,
   //     keywords: ["orders"]
   // },
   {
       label: "Customers",
       description: "View and manage customer information",
       url: ADMIN_CUSTOMERS_SHOW,
       keywords: ["customers", "users"]
   },
   {
       label: "Review",
       description: "Manage customer reviews and feedback",
       url: ADMIN_REVIEWS_SHOW,
       keywords: ["ratings", "feedback"]
   },
   {
       label: "Media",
       description: "Manage website media files",
       url: ADMIN_MEDIA_SHOW,
       keywords: ["images", "videos"]
   },
];

// Exporting the searchData array for use in other parts of the application,
// such as a search bar, admin navigation, or quick-access command menu.
export default searchData;