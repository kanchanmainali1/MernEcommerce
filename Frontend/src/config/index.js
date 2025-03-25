
export const registerFormControl=[
    {
        name:'userName',
        label:'User Name',
        placeholder:'Enter User Name',
        type:'text',
        componentType:'input',
    }
    ,
    {
        name:'email',
        label:'Email',
        placeholder:'Enter Email',
        type:'email',
        componentType:'input',
    }
    ,
    {
        name:'password',
        label:'Password',
        placeholder:'Enter Password',
        type:'password',
        componentType:'input',
    }
];
export const loginFormControl=[
   
    {
        name:'email',
        label:'Email',
        placeholder:'Enter Email',
        type:'email',
        componentType:'input',
    }
    ,
    {
        name:'password',
        label:'Password',
        placeholder:'Enter Password',
        type:'password',
        componentType:'input',
    }
]
export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];
export const userViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/user/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/user/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/user/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/user/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/user/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/user/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/user/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/user/search",
  },
];
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];
