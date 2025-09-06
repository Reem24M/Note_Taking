const { LoginStart, LoginVerify } = require('./Controllers/auth/Login')
const { Logout } = require('./Controllers/auth/Logout')
const { ForgetPassword, ResetPassword } = require('./Controllers/auth/Password')
const { Register } = require('./Controllers/auth/Register')
const { GetAllCategories, DeleteCategory, CreateCategory } = require('./Controllers/Category/Category')
const { Home } = require('./Controllers/home')
const { GetAllNotes, GetNoteById, AddNote, UpdateNoteWithOneThing, UpdateNote, DeleteNote } = require('./Controllers/Notes/Notes')
const { GetProfile, ChangePassword, ChangeLSName, EnableOtp } = require('./Controllers/Profile/Profile')
const {app}=require('./index')

//home
app.get('/home',(req,res)=>{
    res.render('home')
})
app.get('/',Home)


//Auth render pages
app.get('/auth/register', (req, res) => {
    res.render('auth/register');
});
app.get('/auth/login/start',(req,res)=>{
    res.render('auth/login_start')
})
app.get('/auth/login/verify',(req,res)=>{
    res.render('auth/login_verify')
})
app.get('/auth/logout',(req,res)=>{
    res.render('auth/logout')
})
app.get('/auth/forget-password',(req,res)=>{
    res.render('auth/forgetPassword')
})
app.get('/auth/reset-password',(req,res)=>{
    res.render('auth/resetPassord')
})

//Auth routes
app.post('/auth/register',Register)
app.post('/auth/login/start',LoginStart)
app.post('/auth/login/verify',LoginVerify)
app.post('/auth/forgot-password',ForgetPassword)
app.post('/auth/reset-password',ResetPassword)
app.delete('/auth/logout',Logout)

//categories render pages
app.get('/categories',(req,res)=>{
    res.render('categories/cats')
})

//categories routes
app.get('/api/categories',GetAllCategories)
app.post('/categories',CreateCategory)
app.delete('/categories/:id',DeleteCategory)

//notes render pages
app.get('/notes',(req,res)=>{
    res.render('notes/allnotes')
})
app.get('/notes/:id',(req,res)=>{
    res.render('notes/note')
})
//notes routes
app.get('/api/notes',GetAllNotes)
app.get('/api/notes/:id',GetNoteById)
app.post('/api/notes',AddNote)
app.put('/api/notes/:id',UpdateNote)
app.patch('/api/notes/:id',UpdateNoteWithOneThing)
app.delete('/api/notes/:id',DeleteNote)

//profile render page
app.get('/profile',(req,res)=>{
    res.render('profile/profile')
})
//Profile routes
app.get('/api/profile',GetProfile)
app.post('/profile/change-password',ChangePassword)
app.post('/profile/change-first-last-name',ChangeLSName)
app.post('/profile/enable-otp',EnableOtp)
