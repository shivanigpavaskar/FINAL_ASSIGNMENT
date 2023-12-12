 import { useRoutes } from 'react-router-dom';
 import routes from './Routes/Router';
import  Welcome  from './Welcome';
 
function App() {
const routing = useRoutes(routes);

  return (
    <>
  <Welcome />
{routing}

    </>
  )
}

export default App
