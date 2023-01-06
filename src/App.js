import { useState } from "react";

const App = () => {
  const [ list, setList ] = useState([])
  const [ item, setItem ] = useState('')

  const handleChange = (e) => {
    setItem(e.target.value)
  }

  const addToList = () => {
    list.push(item)
    setList(list)
    setItem('')
  }

  const deleteToList = (i) => {
    const array = [...list];
    array.splice(i, 1)
    setList(array)
  }

  console.log(list)
  return (
    <>
      <label name='newItem' className="label">Ajouter un élément :</label>
      <br />
      <div className="input_container">
        <input 
          type='text'
          name="newItem"
          value={item}
          onChange={handleChange}
        />
        <button type='button' onClick={addToList} className='button_add'>Ajouter</button>
      </div>

      <p>Ma todo-list :</p>
      {list.length > 0 ? 
        <ul>
          {list.map((item, i) => (
            <li key={i}>
              <div className="item">
                {item}
                <button onClick={() => deleteToList(i)} className='button_delete'>x</button>
              </div>
            </li>
          ))}
        </ul> : <p>Il n'y a aucun item dans la liste</p>}
    </>
  );
}

export default App;