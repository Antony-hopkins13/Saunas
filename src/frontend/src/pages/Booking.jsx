import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function Booking() {
  const { id } = useParams()
  const [sauna, setSauna] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    comment: ''
  })

  useEffect(() => {
    fetchSauna()
  }, [id])

  const fetchSauna = async () => {
    try {
      const response = await fetch('/api/saunas')
      if (!response.ok) throw new Error('Ошибка загрузки данных')
      const saunas = await response.json()
      const foundSauna = saunas.find(s => s.id === parseInt(id))
      if (!foundSauna) throw new Error('Сауна не найдена')
      setSauna(foundSauna)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          saunaId: parseInt(id)
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка бронирования')
      }
      
      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        comment: ''
      })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="loading">Загрузка информации о сауне...</div>
  if (error && !success) return <div className="error">Ошибка: {error}</div>
  if (!sauna) return <div className="error">Сауна не найдена</div>

  if (success) {
    return (
      <div className="container">
        <div className="success">
          <h2>✅ Бронирование успешно создано!</h2>
          <p>Мы свяжемся с вами в ближайшее время для подтверждения.</p>
          <Link to="/" className="back-btn">Вернуться к списку саун</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to={`/sauna/${id}`} className="back-btn">← Назад к сауне</Link>
      
      <div className="booking-form">
        <h2>Бронирование: {sauna.name}</h2>
        <p>Цена: {sauna.price} ₽/час</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ваше имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Дата *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Время *</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Выберите время</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="comment">Комментарий</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              placeholder="Дополнительные пожелания..."
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Забронировать
          </button>
        </form>
      </div>
    </div>
  )
}

export default Booking
