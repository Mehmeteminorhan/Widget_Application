import axios from 'axios'
import { response } from 'msw'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {

  const [message,setMessage] = useState('');
  const [email,setEmail] = useState('');
  const [steps,setSteps] = useState(0);
  const [index,setIndex] = useState(4);
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY(index) {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const coordinates = ['1,1','2,1','3,1','1,2','2,2','3,2','1,3','2,3','3,3']
    return coordinates[index]
  }

  function getXYMesaj(index) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const coordinate = getXY(index);
    return `Coordinates (${coordinate})`
  }

  function reset() {
    setMessage('');
    setEmail('');
    setSteps(0);
    setIndex(4)}

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const yon_liste = {
      left: -1,
      up: -3,
      right: 1,
      down: 3
    }
    const newIndex = index + yon_liste[yon];
    if (newIndex < 0 || newIndex > 8){
      return null
    }
    if ((yon === 'left' && index % 3 === 0) ||
    (yon === 'right' && index % 3 === 2)) {
      return null;
    }
    return newIndex;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const yon = evt.target.id;
    const newIndex = sonrakiIndex(yon);
    if (newIndex === null){
      if (yon === 'left') setMessage('Sola gidemezsiniz');
      if (yon === 'up') setMessage('Yukarıya gidemezsiniz');
      if (yon === 'right') setMessage('Sağa gidemezsiniz');
      if (yon === 'down') setMessage('Aşağıya gidemezsiniz'); 
    } else {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz

    setEmail(evt.target.value)
  }

function onSubmit(evt) {
    evt.preventDefault();
    const [x, y] = getXY(index).split(',').map(Number);
    const payload = {
      x: x,
      y : y,
      steps: steps,
      email: email
    };
    axios.post('http://localhost:9000/api/result',payload)
    .then((response) => {
      setMessage(response.data.message);
      setEmail('')
    }).catch((error) => {
      setMessage(error.response.data.message)

    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj(index)}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset} >reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
