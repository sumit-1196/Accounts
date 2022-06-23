import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import App from './App'
import 'simplebar/src/simplebar.css'
import * as serviceWorker from './serviceWorker'
import reportWebVitals from './reportWebVitals'
import 'react-toastify/dist/ReactToastify.css'

axios.defaults.baseURL = process.env.REACT_APP_API_URL

// axios.interceptors.request.use(
//   config => {
//     if (!config.headers.Authorization) {
//       const token = JSON.parse(localStorage.getItem("keyCloak")).token

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }

//     return config
//   },
//   error => Promise.reject(error)
// )

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ToastContainer />
      <App />
    </BrowserRouter>
  </HelmetProvider>
)

serviceWorker.unregister()

reportWebVitals()
