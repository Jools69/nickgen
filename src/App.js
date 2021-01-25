import './App.css';
import NickGenerator from './NickGenerator';
import Footer from './Footer';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to  <span style={{color:"#ff00ff"}}>N</span>
                        <span style={{color:"#f167e1"}}>i</span>
                        <span style={{color:"#e091c2"}}>c</span>
                        <span style={{color:"#c9b2a2"}}>k</span>
                        <span style={{color:"#abce80"}}>G</span>
                        <span style={{color:"#7fe757"}}>e</span>
                        <span style={{color:"#00ff00"}}>n</span>
                        </h1>
        <h3>Jools's coloured nickname generator for Minecraft</h3>
        <NickGenerator />
      </header>
      <Footer className="App-footer"/>
    </div>
  );
}

export default App;
