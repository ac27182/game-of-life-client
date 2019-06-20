import React from 'react'
import MasterGrid from './components/MasterGrid'
import './App.css'

const setEnv = () => {
	if (process.env.NODE_ENV === 'development') {
		process.env.SERVER_URL = `localhost:3001`
	} else {
		process.env.SERVER_URL = `game-of-life-server.herokuapp.com/`
	}
}

const App = () => {
	setEnv()
	return <MasterGrid />
}

export default App
