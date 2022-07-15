import { Routes ,Route, BrowserRouter} from 'react-router-dom';
import './App.css';

import Login from './components/login'
import Facilities from './components/Facilities'
function App() {
  return (
    <div>
      <BrowserRouter basename='/'>
          <Routes>
            <Route exact path="/"  element={<Login />}/>
            <Route path="/w/" element={<Facilities />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
