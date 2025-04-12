const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const authRoutes=require('./routes/auth/auth.route');
const adminProductRoutes=require('./routes/admin/product.route');
const userProductRoutes=require('./routes/users/product.route');
const userCartRoutes=require('./routes/users/cart.route');
const userAddressRoutes=require('./routes/users/address.route');
const userOrderRoutes=require('./routes/users/order.route');
const usersearchRoutes=require('./routes/users/search.route');
const commonFeatureRoutes=require('./routes/common/feature.route');
const adminOrderRoutes=require('./routes/admin/order.route');
const userReviewRoutes=require('./routes/users/review.route');
const cors=require('cors');
mongoose.connect(
'mongodb+srv://mainalikanchan08:mainalikanchan2060@cluster0.o7whh.mongodb.net/'
).then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));

const app=express();
const PORT=process.env.PORT || 5000;
app.use(
    cors({
        origin:["http://localhost:5173"],
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true
    })
)
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/admin/products',adminProductRoutes) 
app.use("/api/admin/orders", adminOrderRoutes);
app.use('/api/user/products',userProductRoutes)
app.use('/api/user/cart',userCartRoutes)
app.use( '/api/user/address',userAddressRoutes)
app.use("/api/user/order", userOrderRoutes);
app.use("/api/user/search", usersearchRoutes);
app.use("/api/user/review", userReviewRoutes);
app.use("/api/common/feature", commonFeatureRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});