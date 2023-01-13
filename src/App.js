
import { Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './App.css';
import Chatspage from './Pages/Chatspage';
import Homepage from './Pages/Homepage';

function App() {
  const notifysuccess = () => toast.success("Registration Successfull!");
  return (
    <div className="App">
      <Routes>
        <Route path='/*' element={<Homepage />}/>
        <Route path='/chats' element={<Chatspage/>}/>
      </Routes>
    </div>
  );
}

export default App;
