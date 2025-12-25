import React, { useState } from 'react'
import arrow_left from '../../assets/Main/arrow_left.svg'
import RegistrSelector from '../../components/lists/RegistrSelector'
import FileUpload from '../Registration/common/FileUpload'
import '../Main/Main.css'
import '../Customer/Customer.css'
import '../Executor/Executor.css'
import '../Registration/Registration.css'

export default function CreateOrderForm({ onClose, onCreate, existingOrders }) {
  const [step, setStep] = useState(1)

  // шаг 1
  const [category, setCategory] = useState('')
  const [task, setTask] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // шаг 2
  const [budget, setBudget] = useState('')
  const [requirements, setRequirements] = useState([])
  const [materials, setMaterials] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])

  const categories = [...new Set(existingOrders.map(o => o.category))]
  const tasks = existingOrders.filter(o => o.category === category).map(o => o.title)

  const isStepOneValid =
    category && task && location.trim() && startDate && endDate

  const toggleRequirement = (value) => {
    setRequirements(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    )
  }

  const handleCreate = () => {
    onCreate({
      id: Date.now(),
      title: task,
      category,
      location,
      budget: budget ? `${budget} ₽` : 'По договорённости',
      deadline: `${startDate} — ${endDate}`,
      requirements,
      materials,
      description,
      images,
      views: 0,
      responses: 0,
      publishedAt: new Date().toLocaleDateString('ru-RU'),
      lockStatus: 'open'
    })
    onClose()
  }


  return (
    <div className="create-order-form">
      <button onClick={onClose} className="back-btn">
        <img src={arrow_left} alt='' />
      </button>

      <h2>Найти специалиста для ремонта</h2>
      

      {step === 1 && (
        <>
            <div className='passport-field'>
                <h3>Категория</h3>
                <div className='registr-selector' >
                    <RegistrSelector
                        placeholder="Выберите категорию"
                        subject={categories}
                        onSelect={setCategory}
                    />
                </div>
            </div>

            <div className='passport-field'>
                <h3>Что нужно сделать</h3>
                <div className='registr-selector' >
                    <RegistrSelector
                        placeholder="Выберите подкатегорию"
                        subject={tasks}
                        onSelect={setTask}
                        disabled={!category}
                    />
                </div>
            </div>

            <div className='passport-field'>
                <h3>Местоположение</h3>
                <input
                    placeholder="Укажите свое местоположение"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />
            </div>

            

            <div className="passport-field">
                <h3>Сроки</h3>
                <div style={{display: 'flex', gap: '20px'}}>
                    <input placeholder="Начать" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input placeholder="Закончить" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>

            <button
                className={`continue-button ${!isStepOneValid ? 'disabled' : ''}`}
                disabled={!isStepOneValid}
                onClick={() => setStep(2)}
                style={{margin: '20px 0 0 0'}}
            >
                Продолжить
            </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Бюджет от"
            value={budget}
            onChange={e => setBudget(e.target.value.replace(/\D/g, ''))}
          />

          <h3>Требования</h3>
          {['Работа по договору', 'Наличие лицензии', 'Гарантия на работу', 'Юридическое лицо']
            .map(r => (
              <div className="checkbox-wrapper" onClick={() => toggleRequirement(r)} key={r}>
                <div className={`custom-checkbox ${requirements.includes(r) ? 'checked' : ''}`} />
                <span>{r}</span>
              </div>
            ))}

          <h3>Материалы</h3>
          {['Уже куплены', 'Закуплю сам', 'От исполнителя'].map(m => (
            <label key={m} className="radio-option">
              <input type="radio" checked={materials === m} onChange={() => setMaterials(m)} />
              {m}
            </label>
          ))}

          <textarea
            placeholder="Описание проекта"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <h3>Желаемый результат</h3>
          <FileUpload maxFiles={10} onFilesUpload={setImages} />

          <button className="continue-button" onClick={handleCreate}>
            Разместить заказ
          </button>
        </>
      )}
    </div>
  )
}
