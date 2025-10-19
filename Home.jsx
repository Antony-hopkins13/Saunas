import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import saunasData from '../data/saunas.json'

function Home() {
  const [saunas, setSaunas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 
  useEffect(() => {
    setSaunas(saunasData)
  }, [])

  const fetchSaunas = async () => {
    try {
      const response = await fetch('/api/saunas')
      if (!response.ok) throw new Error('Ошибка загрузки данных')
      const data = await response.json()
      setSaunas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Загрузка саун...</div>
  if (error) return <div className="error">Ошибка: {error}</div>

  return (
    <div className="container">
      <h2>Наши сауны и бани</h2>
      <p>Выберите подходящую сауну для вашего отдыха</p>
      
      <div className="sauna-grid">
        {saunas.map(sauna => (
          <div key={sauna.id} className="sauna-card">
            <div className="sauna-image">
              {sauna.image ? (
                <img src={sauna.image} alt={sauna.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                '🛁 Сауна'
              )}
            </div>
            <div className="sauna-content">
              <h3 className="sauna-title">{sauna.name}</h3>
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
              
              <Link to={`/sauna/${sauna.id}`}>
                <button className="book-btn">Забронировать</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
