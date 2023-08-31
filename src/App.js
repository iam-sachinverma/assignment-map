import "./App.css";
import MapComponent from "./components/MapComponent/MapComponent";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="App">
      <Header />

      <div className="p-4">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div id="map">
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
