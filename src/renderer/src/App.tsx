import { HashRouter as Router } from 'react-router-dom'
import MainAppRoutes from './routes/MainAppRoutes'

function App(): React.JSX.Element {
  return (
    <>
      <Router>
        <MainAppRoutes />
      </Router>
    </>
  )
}

export default App
