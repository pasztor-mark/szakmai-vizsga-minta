import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import BookForm from './pages/BookForm'
import BookGrid from './pages/BookGrid'

function App() {

  return (
    <main>
      <Header/>
      <BookGrid/>
      <BookForm/>
      <Footer/>
    </main>
  )
}

export default App
