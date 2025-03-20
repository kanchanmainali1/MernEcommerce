const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const authRoutes=require('./routes/auth/auth.route');
const adminProductRoutes=require('./routes/admin/product.route');
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
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});