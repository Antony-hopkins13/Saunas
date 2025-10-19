/*
Express backend (simple):
- API: GET /api/saunas  -> returns saunas.json
- POST /api/bookings -> accepts {name, phone, date, time, comment, saunaId} and saves to JSON
- Bookings file located at ./bookings.json (created automatically)
Run: node src/backend/server.js
*/
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(express.json())

const BOOKINGS_PATH = path.join(__dirname, 'bookings.json')
const SAUNAS_PATH = path.join(__dirname, '..', 'data', 'saunas.json')

// init bookings file if not exists
if (!fs.existsSync(BOOKINGS_PATH)) {
  fs.writeFileSync(BOOKINGS_PATH, '[]')
}

app.get('/api/saunas', (req, res) => {
  fs.readFile(SAUNAS_PATH, 'utf8', (err, data) => {
    if(err) return res.status(500).json({error: 'Не удалось прочитать saunas.json'})
    res.type('json').send(data)
  })
})

app.post('/api/bookings', (req, res) => {
  try{
    const {saunaId, name, phone, date, time, comment} = req.body
    if(!name || !phone || !date || !time) return res.status(400).json({error:'Не все поля'})
    
    // Read existing bookings
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_PATH, 'utf8'))
    
    // Add new booking
    const newBooking = {
      id: bookings.length + 1,
      saunaId: saunaId || null,
      name,
      phone,
      date,
      time,
      comment: comment || '',
      created_at: new Date().toISOString()
    }
    
    bookings.push(newBooking)
    
    // Save back to file
    fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookings, null, 2))
    
    res.json({ok:true, id: newBooking.id})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Ошибка сервера'})
  }
})

// simple endpoint to list bookings (for admin use)
app.get('/api/bookings', (req, res) => {
  try{
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_PATH, 'utf8'))
    // Sort by created_at desc and limit to 200
    const sortedBookings = bookings
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 200)
    res.json(sortedBookings)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Ошибка чтения файла'})
  }
})

// serve static saunas images and other public files when needed
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
  console.log('Server started on port', PORT)
  console.log('API: GET /api/saunas  POST /api/bookings  GET /api/bookings')
})
