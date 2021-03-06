import { store } from '../src/redux/store'
import { Provider } from 'react-redux'
import Router from './routes'
import ThemeProvider from './theme'
import './globals.css'

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </Provider>

  )
}

// https://github.com/minimal-ui-kit/material-kit-react
