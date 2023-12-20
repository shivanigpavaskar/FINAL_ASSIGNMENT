import { useRoutes } from 'react-router-dom'
import routes from './Routes/Router'
import { UserProvider } from './Routes/UserContext';
  
 
function App () {
const routing = useRoutes(routes);

  return (
    <UserProvider designation="Trainer"> {/* or "Trainer" based on the user */}


<>
    <div>{routing}</div>
</>
</UserProvider>


  )
}


  
   

export default App;

    