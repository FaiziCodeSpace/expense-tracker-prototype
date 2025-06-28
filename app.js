import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
const PORT = 8000;
const app = express();

// LOCATION 
const __fileName = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// SETUP EJS 
app.set('view engine', 'ejs');
app.set('views', 'views');

// MiddleWare body 
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// EXPENSE 
const dataPath = path.join(__dirname, 'data', 'db.json')

// Basically it will used to load data from the JSON file
function loadData(){
    if(fs.existsSync(dataPath)){
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Saving Data
function saveData(expense){
    fs.writeFileSync(dataPath, JSON.stringify(expense, null, 2));
}

// REQUESTS
app.get('/expenses', (req, res)=>{
    const expense = loadData();
    res.render('Expense', {expense});
})

app.post('/add', (req, res)=>{
    const { title, amount, category, date } = req.body;
    const expense = loadData();
    expense.push({ id: Date.now(), title, amount, category, date });
    saveData(expense);
    res.redirect('/expenses');
})

app.post('/delete/:id', (req, res)=>{
    const expense = loadData();
    const update = expense.filter(e => e.id != req.params.id);
    saveData(update);
    res.redirect('/expenses');
})



app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}/expenses`);
})
