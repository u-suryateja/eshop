import React, { useEffect, useState } from "react";
import { imgDB, txtDB } from "./txtImgConfig";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import styles from './styles.module.css';

function StoreImageTextFirebase() {
  const [txt, setTxt] = useState('');
  const [img, setImg] = useState('');
  const [data, setData] = useState([]);
  const [entryId, setEntryId] = useState('');
  const [updatedTxt, setUpdatedTxt] = useState('');
  const [updatedImg, setUpdatedImg] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDays, setSelectedDays] = useState(1); // State to store selected number of days
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data

  const handleUpload = (e) => {
    setNewImageFile(e.target.files[0]);
  }

  const handleClick = async () => {
    const uniqueId = v4();
    setEntryId(uniqueId);
    const valRef = collection(txtDB, 'txtData');
    await addDoc(valRef, { id: uniqueId, txtVal: txt, imgUrl: img, category: selectedCategory });
    alert("Data added successfully");
  }

  const getData = async () => {
    const valRef = collection(txtDB, 'txtData');
    const dataDb = await getDocs(valRef);
    const allData = dataDb.docs.map(val => ({ ...val.data(), id: val.id }));
    setData(allData);
    setFilteredData(allData); // Initialize filtered data with all data
  }

  const handleUpdateTextById = async (id) => {
    const entryRef = doc(txtDB, 'txtData', id);
    await updateDoc(entryRef, { txtVal: updatedTxt });
    const updatedData = data.map(entry => {
      if (entry.id === id) {
        return { ...entry, txtVal: updatedTxt };
      }
      return entry;
    });
    setData(updatedData);
    setFilteredData(updatedData);
    setUpdatedTxt('');
  };

  const handleUpdateImageById = async (id) => {
    if (newImageFile) {
      const newImgRef = ref(imgDB, `Imgs/${v4()}`);
      await uploadBytes(newImgRef, newImageFile);
      const newImgUrl = await getDownloadURL(newImgRef);

      const entryRef = doc(txtDB, 'txtData', id);
      await updateDoc(entryRef, { imgUrl: newImgUrl });
      
      const updatedData = data.map(entry => {
        if (entry.id === id) {
          return { ...entry, imgUrl: newImgUrl };
        }
        return entry;
      });
      setData(updatedData);
      setFilteredData(updatedData);
      setNewImageFile(null);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter data based on the selected category
  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredData(data); // No category selected, show all data
    } else {
      const filteredData = data.filter(item => item.category === selectedCategory);
      setFilteredData(filteredData);
    }
  }, [selectedCategory, data]);

  return (
    <div>
      <button
        onClick={() => setSelectedCategory("Vegetables")}
        className={selectedCategory === "Vegetables" ? styles.selected : ''}
      >
        Category: Vegetables
      </button>
      <button
        onClick={() => setSelectedCategory("Flowers")}
        className={selectedCategory === "Flowers" ? styles.selected : ''}
      >
        Category: Flowers
      </button>
      

      <input onChange={(e) => setTxt(e.target.value)} /><br />
      <input type="file" onChange={(e) => handleUpload(e)} /><br /><br />
      <button onClick={handleClick}>Add</button>

      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Flowers">Flowers</option>
      </select>

      
      
      {filteredData.map((value) => (
        <div key={value.id}>
          <h2>ID: {value.id}</h2>
          <h3>Category: {value.category}</h3>
          <h1>{value.txtVal}</h1>
          <img src={value.imgUrl} height="200px" width="200px" />
          <input
            type="text"
            placeholder="Enter updated text"
            value={updatedTxt}
            onChange={(e) => setUpdatedTxt(e.target.value)}
          />
          <button onClick={() => handleUpdateTextById(value.id)}>Update Text</button>
          <input
            type="file"
            onChange={(e) => handleUpload(e)}
          />
          <button onClick={() => handleUpdateImageById(value.id)}>Update Image</button>
        </div>
      ))}
    </div>
  )
}

export default StoreImageTextFirebase;
