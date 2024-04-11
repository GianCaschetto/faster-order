
function Header() {
  return (
    <header>
        <div className="flex justify-between items-center">
          <img
            src="src\assets\narutoChiquito.jpg"
            alt=""
            className="h-24 object-cover"
          />
          <nav>
            <ul className="flex justify-end gap-4">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Empresa
          </h1>
          <ul className="my-6 ml-6 [&>li]:mt-2">
            <li>Abierto todos los días desde las 4:00pm a 11:00pm</li>
            <li>Valencia, Sede Presencial Container</li>
            <li>NUEVA sede CC Concepto la Granja</li>
            <li>Sede Prebo Delivery o pickup 🛻</li>
            <li>El tiempo de espera estimado es de 30/55 min</li>
          </ul>
        </div>
      </header>
  )
}

export default Header