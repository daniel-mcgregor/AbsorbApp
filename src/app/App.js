import MainNav from '../components/mainNav';
import FolderNav from '../components/folderNav';
import Footer from '../components/footer';
import './App.css';

function App() {
  return (
    <div className="app">
    <body>
      <div class="content">
        <div class="content-inside">
          <div id="sideNavs">
            <MainNav />
            <FolderNav />
          </div>
        </div>
      </div>
      <Footer />
    </body>
    </div>
  );
}

export default App;
