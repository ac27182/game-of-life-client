import React, { Component } from 'react'
import './MasterGrid.css'
let connection
const sessionColour = Math.floor(Math.random() * 16777215).toString(16)

export class MasterGrid extends Component {
	state = {
		canvasHeight: '2048',
		canvasWidth: '2048',
		offset: [0, 0],
		isDown: false,
		absX: 0,
		absY: 0,
	}

	gridGen = () => {
		const ctx = this.refs.grid.getContext('2d')
		for (let x = 8; x < this.state.canvasHeight; x += 16) {
			for (let y = 8; y < this.state.canvasWidth; y += 16) {
				ctx.lineWidth = 0.25
				ctx.beginPath()
				ctx.arc(x, y, 7, 0, 2 * Math.PI)
				ctx.stroke()
			}
		}
	}

	socketTest = () => {
		connection = new WebSocket(`ws://localhost:3001/ws`)
		connection.onopen = () => {
			console.log('websocket operational.')
		}
		connection.onerror = () => {
			console.log('websocket not operational.')
		}
		connection.onmessage = event => {
			const { code, payload } = JSON.parse(event.data)
			console.log(payload.length / 12)
			console.log(payload)
			switch (code) {
				case 'r002':
					this.updateGrid(payload)
					break
				case 'r001':
					this.updateGrid(payload)
					break
				default:
					break
			}
		}
	}

	/// updateGrid updates the life nodes on the grid
	updateGrid = nodes => {
		console.log('updating grid')
		const ctx = this.refs.grid.getContext('2d')
		const t = c => (Number(c) + 0.5) * 16
		ctx.clearRect(0, 0, 2048, 2048)
		this.gridGen()

		const g = {}

		for (let i = 0; i < nodes.length; i += 12) {
			const x = t(Number(nodes.substring(i, i + 3)))
			const y = t(Number(nodes.substring(i + 3, i + 6)))
			const hex = `#${nodes.substring(i + 6, i + 12)}`

			g[`${x}${y}`] = hex

			ctx.fillStyle = hex
			ctx.lineWidth = 0.25
			ctx.beginPath()
			ctx.arc(x, y, 7, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		}
		console.log(g)
	}

	drawNode = lifeNode => {
		// const ctx = this.refs.grid.getContext('2d')
		// const { absX, absY } = this.state
		// if (Number(payload)) {
		// 	ctx.fillStyle = '#00ffff'
		// 	ctx.lineWidth = 0.25
		// 	ctx.beginPath()
		// 	ctx.arc(absX, absY, 7, 0, 2 * Math.PI)
		// 	ctx.fill()
		// 	ctx.stroke()
		// }
	}

	drawGrid = grid => {
		const t = c => {
			return (Number(c) + 0.5) * 16
		}
		const ctx = this.refs.grid.getContext('2d')
		ctx.clearRect(0, 0, 2048, 2048)
		for (let k in grid) {
			let coordinates = k.split(':')
			// console.log(k, grid[k])
			// console.log(coordinates)
			// return
			console.log(t(coordinates[0]), t(coordinates[1]))

			ctx.fillStyle = `#${grid[k].V}`
			ctx.lineWidth = 0.25

			ctx.beginPath()
			ctx.arc(t(coordinates[0]), t(coordinates[1]), 7, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		}
	}

	// handle click handles any click on the grid and sends a request to the server
	handleClick = e => {
		const grid = this.refs.grid
		const gridContainer = this.refs.gridContainer
		const coordinateSetter = c => {
			return c - (c % 16) + 8
		}
		const padAndReduce = c => {
			return String(c / 16 - 0.5).padStart(3, '0')
		}

		// we generate the aabsolute pixel number of the grid for drawing
		let absX = coordinateSetter(
			e.clientX - (gridContainer.clientWidth - grid.clientWidth) / 2,
		)
		let absY = coordinateSetter(
			e.clientY - (gridContainer.clientHeight - grid.clientHeight) / 2,
		)

		// we set the state so the absolute pixel number can be used in other functions
		this.setState({ absX, absY })

		// reduces absolute pixel number into circle number
		const request = JSON.stringify({
			code: 'c001',
			payload: `${padAndReduce(absX)}${padAndReduce(absY)}${sessionColour}`,
		})
		console.log(padAndReduce(absX), padAndReduce(absY))
		console.log('request sent...')
		connection.send(request)
	}

	render() {
		return (
			<div className='grid-container' ref='gridContainer'>
				<canvas
					ref='grid'
					height={this.state.canvasHeight}
					width={this.state.canvasWidth}
					onClick={e => this.handleClick(e)}
				/>
			</div>
		)
	}

	componentDidMount() {
		this.gridGen()
		this.socketTest()
	}
}

export default MasterGrid
