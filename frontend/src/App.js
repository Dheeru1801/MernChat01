import { Route } from 'react-router-dom/cjs/react-router-dom.min';//error here
// import {Route} from "react-router-dom";
import './App.css';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component ={ChatPage}/>
      
    </div>
  );
}

export default App;
