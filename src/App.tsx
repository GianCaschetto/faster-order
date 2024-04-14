import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import MenuPage from "./pages/menu/MenuPage";


function App() {
  return (
    <div className="min-h-screen md:max-w-5xl max-w-sm  text-center p-4 mx-auto">
      <Header />
      <MenuPage />
      <Footer />
    </div>
  );
}

export default App;
