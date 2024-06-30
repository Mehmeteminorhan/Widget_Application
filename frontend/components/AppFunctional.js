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
    const coordinates = [('1,1'),('2,1'),('3,1'),('1,2'),('2,2'),('3,2'),('1,3'),('2,3'),('3,3')]
    return (coordinates[index])
  }

  function getXYMesaj(index) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const coordinate = getXY(index);
    return 'Coordinates ' + coordinate
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
      sol: -1,
      yukarı: -3,
      sag: 1,
      asagi: 3
    }
    const newIndex = index + yon_liste[yon];
    if (newIndex < 0 || newIndex > 8){
      return null
    }
    if ((yon === 'sol' && index % 3 === 0) ||
    (yon === 'sag' && index % 3 === 2)) {
      return null;
    }
    return newIndex;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const yon = evt.target.idx;
    const newIndex = sonrakiIndex(yon);
    if (newIndex === null){
      if (yon === 'sol') setMessage('You can\'t go left');
      if (yon === 'yukarı') setMessage('You can\'t go up');
      if (yon === 'sag') setMessage('You can\'t go right');
      if (yon === 'asagi') setMessage('You can\'t go down'); 
    } else {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    }


  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj(index)}</h3>
        <h3 id="steps">0 kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left">SOL</button>
        <button id="up">YUKARI</button>
        <button id="right">SAĞ</button>
        <button id="down">AŞAĞI</button>
        <button id="reset" onClick={reset} >reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
