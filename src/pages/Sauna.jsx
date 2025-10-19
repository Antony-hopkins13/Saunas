import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function Sauna() {
  const { id } = useParams()
  const [sauna, setSauna] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="loading">Загрузка информации о сауне...</div>
  if (error) return <div className="error">Ошибка: {error}</div>
  if (!sauna) return <div className="error">Сауна не найдена</div>

  return (
    <div className="container">
      <Link to="/" className="back-btn">← Назад к списку</Link>
      
      <div className="sauna-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="sauna-image">
          {sauna.image ? (
            <img src={sauna.image} alt={sauna.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            '🛁 Сауна'
          )}
        </div>
        <div className="sauna-content">
          <h1 className="sauna-title">{sauna.name}</h1>
          <p className="sauna-description">{sauna.description}</p>
          
          <div className="sauna-info">
            <span className="sauna-price">{sauna.price} ₽/час</span>
            <span className="sauna-capacity">👥 {sauna.capacity} чел.</span>
          </div>
          
          <div className="amenities">
            <h4>Удобства:</h4>
            <div className="amenities-list">
              {sauna.amenities.map((amenity, index) => (
                <span key={index} className="amenity">{amenity}</span>
              ))}
            </div>
          </div>
          
          <div style={{marginTop: '2rem'}}>
            <p><strong>Время работы:</strong> {sauna.workingHours}</p>
          </div>
          
          <Link to={`/booking/${sauna.id}`}>
            <button className="book-btn" style={{marginTop: '2rem'}}>
              Забронировать эту сауну
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sauna
