import React, { useEffect, useState } from "react";

import GalleryService from '../services/gallery'
import Gallery from './Gallery'
import 'main.scss'

const App = () => {
  const [items, setItems] = useState([])
  useEffect(() => {
    GalleryService.subscribe({
      next: items => setItems(items)
    })
  }, [])
  return <Gallery items={items} itemTabIndexOffset={10} />
}

export default App
